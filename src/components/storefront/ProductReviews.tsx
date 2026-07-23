"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  UploadCloud, 
  X, 
  Loader2, 
  CheckCircle2, 
  PenSquare, 
  Camera, 
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
  media_urls: string[];
}

const RATING_DESCRIPTIONS: Record<number, { text: string; color: string }> = {
  1: { text: "Very Poor", color: "text-red-600 bg-red-50 border-red-200" },
  2: { text: "Poor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  3: { text: "Average", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  4: { text: "Good", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  5: { text: "Excellent", color: "text-emerald-800 bg-emerald-100 border-emerald-300" },
};

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { addToast } = useToast();

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    // Fetch only approved reviews
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    } else {
      console.error("Error fetching reviews:", error);
    }
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (files.length + selectedFiles.length > 2) {
        addToast({ title: "Limit Exceeded", message: "You can upload up to 2 images/videos.", type: "error" });
        return;
      }

      const validFiles: File[] = [];
      for (const file of selectedFiles) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        const sizeMB = file.size / (1024 * 1024);

        if (!isImage && !isVideo) {
          addToast({ title: "Invalid File", message: "Only images and videos are supported.", type: "error" });
          continue;
        }

        if (isImage && sizeMB > 5) {
          addToast({ title: "File too large", message: "Images must be under 5MB.", type: "error" });
          continue;
        }

        if (isVideo && sizeMB > 15) {
          addToast({ title: "File too large", message: "Videos must be under 15MB.", type: "error" });
          continue;
        }

        validFiles.push(file);
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorEmail || !body) return;
    setIsSubmitting(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${productId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("review-media")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("review-media")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const { error: insertError } = await supabase.from("reviews").insert([{
        product_id: productId,
        author_name: authorName.trim() || "Verified Buyer",
        author_email: authorEmail,
        rating,
        title: reviewTitle.trim(),
        body: body.trim(),
        media_urls: uploadedUrls,
        status: "pending"
      }]);

      if (insertError) throw insertError;

      setIsFormOpen(false);
      setAuthorName("");
      setAuthorEmail("");
      setReviewTitle("");
      setBody("");
      setRating(5);
      setFiles([]);
      addToast({ 
        title: "Review Submitted!", 
        message: "Thank you! Your review has been submitted for verification.", 
        type: "success" 
      });

    } catch (error: any) {
      console.error(error);
      addToast({ title: "Submission Failed", message: error.message || "Unable to submit review.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating || rating;
  const activeRatingDesc = RATING_DESCRIPTIONS[currentDisplayRating] || RATING_DESCRIPTIONS[5];

  // Calculate Rating Distribution for Amazon/Flipkart style breakdown
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    percentage: totalReviews > 0 ? Math.round((reviews.filter((r) => r.rating === s).length / totalReviews) * 100) : 0
  }));

  return (
    <div className="w-full font-sans">
      {/* Amazon/Flipkart Style Rating Overview Header */}
      <div className="bg-neutral-50/80 border border-neutral-200/80 p-6 md:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Col: Overall Rating Score */}
          <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col items-center md:items-start text-center md:text-left gap-4 border-b md:border-b-0 md:border-r border-neutral-200/80 pb-6 md:pb-0 md:pr-8">
            <div>
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-1">Customer Reviews</h2>
              <p className="text-xs text-neutral-500 font-sans">Empowering real opinions from verified buyers</p>
            </div>

            {totalReviews > 0 ? (
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl md:text-5xl font-serif font-bold text-[#1A1A1A]">{averageRating}</span>
                <div className="flex flex-col items-start">
                  <div className="flex text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(averageRating)) ? "fill-current" : "text-neutral-300"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500 mt-1 font-medium">{totalReviews} verified review{totalReviews !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 font-medium">No reviews published yet for this fragrance.</p>
            )}

            <Button 
              onClick={() => setIsFormOpen(!isFormOpen)} 
              className="mt-2 bg-[#1A1A1A] text-white hover:bg-[#D4AF37] rounded-none uppercase tracking-widest text-xs font-bold px-6 py-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300 w-full sm:w-auto"
            >
              <PenSquare className="w-4 h-4" />
              {isFormOpen ? "Close Form" : "Write a Customer Review"}
            </Button>
          </div>

          {/* Right Col: Rating Star Breakdown Bars */}
          <div className="md:col-span-7 space-y-2">
            {starCounts.map(({ star, percentage }) => (
              <div key={star} className="flex items-center gap-3 text-xs font-sans">
                <span className="w-12 text-neutral-600 font-semibold flex items-center gap-1 justify-end">
                  {star} <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                </span>
                <div className="flex-1 h-2.5 bg-neutral-200 overflow-hidden relative">
                  <div 
                    className="h-full bg-[#D4AF37] transition-all duration-500" 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
                <span className="w-10 text-neutral-400 font-medium text-right">{percentage}%</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Amazon / Flipkart Style Inline Collapsible Write-Review Section */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden mb-10"
          >
            <div className="bg-white border-2 border-[#1A1A1A] p-6 sm:p-8 md:p-10 shadow-xl relative">
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />

              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] flex items-center gap-2">
                    Create Review <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Share your experience with fragrance notes, longevity & packaging.</p>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-neutral-400 hover:text-black p-2 transition-colors cursor-pointer"
                  title="Close review form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Star Rating Selector with Dynamic Emojis & Labels */}
                <div className="bg-[#FAF9F6] border border-neutral-200 p-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] block mb-1">Overall Score</label>
                    <p className="text-xs text-neutral-500">Tap a star to rate your purchase</p>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-1.5">
                    <div className="flex gap-1.5 text-[#D4AF37]" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform duration-200 cursor-pointer focus:outline-none"
                        >
                          <Star 
                            className={`w-7 h-7 sm:w-8 sm:h-8 ${star <= currentDisplayRating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-neutral-300"}`} 
                          />
                        </button>
                      ))}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 border ${activeRatingDesc.color}`}>
                      {currentDisplayRating}/5 - {activeRatingDesc.text}
                    </span>
                  </div>
                </div>

                {/* Step 2: Review Title & Body */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Review Headline
                    </label>
                    <input 
                      type="text" 
                      value={reviewTitle} 
                      onChange={(e) => setReviewTitle(e.target.value)} 
                      placeholder="e.g. Long lasting, exquisite scent & fast delivery!" 
                      className="w-full text-xs sm:text-sm border border-neutral-300 bg-white px-4 py-3 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                      Detailed Review <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      value={body} 
                      onChange={(e) => setBody(e.target.value)} 
                      required 
                      rows={4} 
                      placeholder="Write your honest opinion about the scent notes, sillage, bottle quality, or performance..." 
                      className="w-full text-xs sm:text-sm border border-neutral-300 bg-white px-4 py-3 focus:outline-none focus:border-[#1A1A1A] transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Step 3: Media Attachment Cards (Photos/Videos) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#D4AF37]" /> Add Photos or Video
                    </label>
                    <span className="text-[11px] text-neutral-400 font-medium">{files.length}/2 attached</span>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center pt-1">
                    {files.map((file, idx) => (
                      <div key={idx} className="relative w-24 h-24 border border-neutral-300 overflow-hidden group bg-neutral-100 shadow-xs">
                        {file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="attachment preview" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-white p-2">
                            <span className="text-[10px] font-bold uppercase">Video</span>
                            <span className="text-[9px] text-neutral-400 truncate max-w-full">{file.name}</span>
                          </div>
                        )}
                        <button 
                          type="button" 
                          onClick={() => removeFile(idx)} 
                          className="absolute top-1 right-1 bg-black/80 text-white p-1 hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {files.length < 2 && (
                      <label className="w-24 h-24 border-2 border-dashed border-neutral-300 hover:border-[#1A1A1A] hover:bg-neutral-50 transition-all flex flex-col items-center justify-center cursor-pointer text-neutral-500 p-2 text-center">
                        <UploadCloud className="w-5 h-5 mb-1 text-[#D4AF37]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                        <span className="text-[8px] text-neutral-400 mt-0.5">Photo or Video</span>
                        <input 
                          type="file" 
                          accept="image/*,video/mp4,video/quicktime" 
                          multiple 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-400">Supported formats: JPG, PNG (up to 5MB), MP4 (up to 15MB)</p>
                </div>

                {/* Step 4: Reviewer Identity Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" /> Display Name
                    </label>
                    <input 
                      type="text" 
                      value={authorName} 
                      onChange={(e) => setAuthorName(e.target.value)} 
                      placeholder="e.g. Rahul M. (or leave empty for Verified Buyer)" 
                      className="w-full text-xs sm:text-sm border border-neutral-300 bg-white px-4 py-2.5 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={authorEmail} 
                      onChange={(e) => setAuthorEmail(e.target.value)} 
                      required 
                      placeholder="your.email@domain.com" 
                      className="w-full text-xs sm:text-sm border border-neutral-300 bg-white px-4 py-2.5 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>
                </div>

                {/* Verified notice */}
                <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-3">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>Your email is kept private and will only be used to verify your purchase.</span>
                </div>

                {/* Form Action Row */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsFormOpen(false)}
                    className="w-full sm:w-auto border-neutral-300 text-neutral-700 hover:border-black rounded-none uppercase tracking-widest text-xs font-bold px-6 py-3"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !authorEmail || !body}
                    className="w-full sm:w-auto bg-[#1A1A1A] text-white hover:bg-[#D4AF37] disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-none uppercase tracking-widest text-xs font-bold px-8 py-3 flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>

              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 border border-neutral-200/80 p-8">
            <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">No Reviews Yet</h3>
            <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto">Be the first customer to share feedback for this perfume!</p>
            <Button 
              onClick={() => setIsFormOpen(true)} 
              className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] rounded-none uppercase tracking-widest text-xs font-bold px-8 py-3 transition-colors"
            >
              Write First Review
            </Button>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-neutral-200 p-6 md:p-8 space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
              {/* Star Rating + Date */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-current text-[#D4AF37]" : "text-neutral-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A]">{review.rating}.0 / 5.0</span>
                </div>
                <span className="text-xs text-neutral-400 font-sans">
                  {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Review Title & Body */}
              {review.title && (
                <h4 className="font-serif text-base md:text-lg font-bold text-[#1A1A1A]">{review.title}</h4>
              )}
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-sans">{review.body}</p>

              {/* Media Attachments Display */}
              {review.media_urls && review.media_urls.length > 0 && (
                <div className="flex gap-3 pt-1 overflow-x-auto no-scrollbar">
                  {review.media_urls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                      {url.includes('.mp4') || url.includes('.mov') || url.includes('video') ? (
                        <video src={url} className="w-full h-full object-cover" controls muted />
                      ) : (
                        <img src={url} alt={`Review media ${idx}`} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Author & Verified Buyer Tag */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1A1A1A]">{review.author_name || "Verified Buyer"}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Purchase
                  </span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
