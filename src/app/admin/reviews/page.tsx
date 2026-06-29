"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Star, CheckCircle, XCircle, Trash2, Loader2, PlayCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

type ReviewStatus = "pending" | "approved" | "rejected";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  author_name: string;
  author_email: string;
  status: ReviewStatus;
  created_at: string;
  media_urls: string[];
  product_id: string;
  products: {
    title: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReviewStatus>("pending");
  const { addToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const fetchReviews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        products ( title, slug )
      `)
      .eq("status", activeTab)
      .order("created_at", { ascending: false });

    if (error) {
      addToast({ title: "Error fetching reviews", message: error.message, type: "error" });
    } else {
      setReviews(data as any || []);
    }
    setIsLoading(false);
  };

  const updateReviewStatus = async (id: string, newStatus: ReviewStatus) => {
    const { error } = await supabase.from("reviews").update({ status: newStatus }).eq("id", id);
    if (error) {
      addToast({ title: "Error", message: error.message, type: "error" });
    } else {
      addToast({ title: "Success", message: `Review marked as ${newStatus}.`, type: "success" });
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this review?")) return;
    
    // Note: We might want to delete the media from storage too, but for simplicity we'll just delete the DB record.
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    
    if (error) {
      addToast({ title: "Error", message: error.message, type: "error" });
    } else {
      addToast({ title: "Deleted", message: "Review deleted permanently.", type: "success" });
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= count ? "fill-yellow-400" : "text-gray-300 fill-gray-300"}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Review Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {(["pending", "approved", "rejected"] as ReviewStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-gray-500">No {activeTab} reviews found.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{review.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-500">• {new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{review.author_name || "Guest"}</span>
                    {review.author_email && <p className="text-xs text-gray-400">{review.author_email}</p>}
                  </div>
                </div>

                <p className="text-gray-600 text-sm">{review.body}</p>

                {/* Media Gallery */}
                {review.media_urls && review.media_urls.length > 0 && (
                  <div className="flex gap-3 pt-2">
                    {review.media_urls.map((url, idx) => {
                      const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('video');
                      return (
                        <div key={idx} className="relative w-20 h-20 rounded bg-gray-100 border border-gray-200 overflow-hidden">
                          {isVideo ? (
                            <>
                              <video src={url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <PlayCircle className="w-6 h-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <img src={url} alt="Review attachment" className="w-full h-full object-cover" />
                          )}
                          <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" title="Open media in new tab"></a>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="pt-2 text-xs text-gray-500">
                  Product: <a href={`/products/${review.products?.slug}`} target="_blank" className="font-medium text-blue-600 hover:underline">{review.products?.title}</a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                {activeTab !== "approved" && (
                  <button 
                    onClick={() => updateReviewStatus(review.id, "approved")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded text-sm font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                )}
                {activeTab !== "rejected" && (
                  <button 
                    onClick={() => updateReviewStatus(review.id, "rejected")}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded text-sm font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                )}
                <button 
                  onClick={() => deleteReview(review.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-medium transition-colors mt-auto"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
