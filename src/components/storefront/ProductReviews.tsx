"use client";

import { useState, useEffect } from "react";
import { Star, UploadCloud, X, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
  media_urls: string[];
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  // Form State
  const [rating, setRating] = useState(5);
  const [authorEmail, setAuthorEmail] = useState("");
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
      
      // Validation: Max 2 files total
      if (files.length + selectedFiles.length > 2) {
        addToast({ title: "Limit Exceeded", message: "You can only upload a maximum of 2 files.", type: "error" });
        return;
      }

      const validFiles: File[] = [];
      for (const file of selectedFiles) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        const sizeMB = file.size / (1024 * 1024);

        if (!isImage && !isVideo) {
          addToast({ title: "Invalid File", message: "Only images and videos are allowed.", type: "error" });
          continue;
        }

        if (isImage && sizeMB > 5) {
          addToast({ title: "File too large", message: "Images must be less than 5MB.", type: "error" });
          continue;
        }

        if (isVideo && sizeMB > 15) {
          addToast({ title: "File too large", message: "Videos must be less than 15MB.", type: "error" });
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

      // 1. Upload Files
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

      // 2. Insert Review
      const { error: insertError } = await supabase.from("reviews").insert([{
        product_id: productId,
        author_name: "Anonymous",
        author_email: authorEmail,
        rating,
        title: "",
        body,
        media_urls: uploadedUrls,
        status: "pending" // Needs admin approval
      }]);

      if (insertError) throw insertError;

      // 3. Success cleanup
      setIsModalOpen(false);
      setAuthorEmail("");
      setBody("");
      setRating(5);
      setFiles([]);
      addToast({ 
        title: "Review Submitted", 
        message: "Thank you! Your review is pending approval by our team.", 
        type: "success" 
      });

    } catch (error: any) {
      console.error(error);
      addToast({ title: "Error", message: error.message || "Failed to submit review.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-0.5 text-accent">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`${interactive ? "w-8 h-8" : "w-5 h-5"} ${star <= count ? "fill-accent text-accent" : "text-gray-200"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            {renderStars(reviews.length > 0 ? Math.round(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length) : 0)}
            <span className="text-sm text-gray-500">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest font-bold px-8">
          Write a Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border border-gray-100 rounded-lg">
            <p className="text-gray-500 mb-4">No reviews yet for this product.</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-white text-black border border-black hover:bg-gray-100 rounded-none uppercase tracking-widest text-xs font-bold px-6">
              Be the first to review
            </Button>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                {renderStars(review.rating)}
                <span className="text-xs text-gray-400 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{review.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{review.body}</p>
              
              {/* Media Display */}
              {review.media_urls && review.media_urls.length > 0 && (
                <div className="flex gap-4 mb-4 overflow-x-auto no-scrollbar pb-2">
                  {review.media_urls.map((url, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      {url.includes('.mp4') || url.includes('.mov') || url.includes('video') ? (
                        <video src={url} className="w-full h-full object-cover" controls muted />
                      ) : (
                        <img src={url} alt={`Review media ${idx}`} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <span className="bg-gray-100 px-2 py-1 rounded text-black">{review.author_name || "Verified Buyer"}</span>
                <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3 h-3" /> Verified</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Write a Review">
        <div className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 flex flex-col items-center mb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Overall Rating</label>
              <div>
                {renderStars(rating, true)}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</label>
              <input type="email" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)} required className="w-full bg-gray-50 border border-transparent py-3 px-4 rounded-md focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-sm transition-all" placeholder="john@example.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Review</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} required rows={4} className="w-full bg-gray-50 border border-transparent py-3 px-4 rounded-md focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-sm resize-none transition-all" placeholder="Describe your experience..." />
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex justify-between items-center">
                <span>Attach Media</span>
                <span className="text-gray-400 font-medium normal-case">{files.length}/2 Files</span>
              </label>
              <div className="flex gap-4 items-start">
                
                {files.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-md border border-gray-200 overflow-hidden group bg-gray-50 flex items-center justify-center shadow-sm">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                      <span className="text-[10px] font-medium text-gray-500">Video</span>
                    )}
                    <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {files.length < 2 && (
                  <div className="relative w-20 h-20 rounded-md border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-colors flex flex-col items-center justify-center cursor-pointer text-gray-500">
                    <UploadCloud className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-center">Add</span>
                    <input 
                      type="file" 
                      accept="image/*,video/mp4,video/quicktime" 
                      multiple 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 pt-1">Supported: JPG, PNG (Max 5MB), MP4 (Max 15MB)</p>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white hover:bg-gray-900 rounded-none uppercase tracking-widest text-sm font-bold h-12 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Review"}
            </Button>
          </form>
        </div>
      </Modal>

    </div>
  );
}
