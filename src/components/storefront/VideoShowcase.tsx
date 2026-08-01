"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Sparkles, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface VideoItem {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  badge: string;
  productName?: string;
  productLink?: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: "v1",
    src: "/assets/videos/video-1.mp4",
    title: "Luxury Unboxing Experience",
    subtitle: "Tamper-evident gold foil seal & heavy glass bottle",
    badge: "UNBOXING",
    productName: "Oud Royale Extrait",
    productLink: "/products/oud-royale"
  },
  {
    id: "v2",
    src: "/assets/videos/video-2.mp4",
    title: "Artisanal Sillage & Projection",
    subtitle: "24-hour ultra concentrated Extrait de Parfum",
    badge: "INSIDE THE BOTTLE",
    productName: "Velvet Rose & Vanilla",
    productLink: "/products/velvet-rose"
  },
  {
    id: "v3",
    src: "/assets/videos/video-3.mp4",
    title: "Customer Reactions & Favorites",
    subtitle: "Loved by perfume connoisseurs across India",
    badge: "VERIFIED REVIEWS",
    productName: "Midnight Amber Intense",
    productLink: "/products/midnight-amber"
  },
  {
    id: "v4",
    src: "/assets/videos/video-4.mp4",
    title: "Craftsmanship & Distillation",
    subtitle: "Pure non-alcoholic attars & high end extracts",
    badge: "THE CRAFT",
    productName: "Ruh Khus Pure Attar",
    productLink: "/products/ruh-khus-attar"
  }
];

export function VideoShowcase() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    v1: true,
    v2: true,
    v3: true,
    v4: true
  });
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const togglePlay = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      // Pause all other videos
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (k !== id && v) v.pause();
      });
      video.play().catch(() => {});
      setPlayingId(id);
    } else {
      video.pause();
      setPlayingId(null);
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;
    video.muted = !video.muted;
    setMutedStates(prev => ({ ...prev, [id]: video.muted }));
  };

  const openModal = (video: VideoItem) => {
    setActiveModalVideo(video);
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#0A0A0A] text-white relative overflow-hidden border-y border-[#D4AF37]/20">
      {/* Background Decorative Gold Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 flex flex-col gap-2">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold font-sans flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Jennyd In Motion <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-wide">
            Visual Stories & Customer Reel Showcase
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-sans leading-relaxed max-w-md mx-auto">
            Experience the texture, bottle craftsmanship, sillage, and unboxing moments captured live in high definition.
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-2" />
        </div>

        {/* 4 Video Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {VIDEOS.map((item) => {
            const isPlaying = playingId === item.id;
            const isMuted = mutedStates[item.id] ?? true;

            return (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#121212] hover:border-[#D4AF37]/60 transition-all duration-500 shadow-2xl hover:shadow-[#D4AF37]/20 cursor-pointer flex flex-col aspect-[9/16] sm:aspect-[9/15]"
              >
                {/* Video Element */}
                <video
                  ref={(el) => { videoRefs.current[item.id] = el; }}
                  src={item.src}
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onPlay={() => setPlayingId(item.id)}
                  onPause={() => setPlayingId((prev) => (prev === item.id ? null : prev))}
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                  <span className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                    {item.badge}
                  </span>
                  
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <button
                      onClick={(e) => toggleMute(item.id, e)}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-white hover:text-[#D4AF37] transition-all backdrop-blur-md cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
                    </button>
                    <button
                      onClick={() => openModal(item)}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-white hover:text-[#D4AF37] transition-all backdrop-blur-md cursor-pointer"
                      title="Expand Video"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Center Play/Pause Floating Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
                  <button
                    onClick={(e) => togglePlay(item.id, e)}
                    className={`w-14 h-14 rounded-full bg-[#121212]/80 border border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center backdrop-blur-md transition-all duration-300 transform shadow-2xl cursor-pointer ${
                      isPlaying 
                        ? "opacity-0 group-hover:opacity-100 scale-90 hover:scale-100" 
                        : "opacity-100 scale-100 group-hover:scale-110 bg-[#D4AF37] text-black border-white"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Bottom Title Gradient Card */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-5 z-20 flex flex-col gap-1 pointer-events-none">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-300 font-sans line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>

                  {item.productName && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> {item.productName}
                      </span>
                      <span className="text-white/70 group-hover:text-white flex items-center gap-0.5 font-bold uppercase tracking-wider text-[9px]">
                        Watch <ArrowRight className="w-2.5 h-2.5 text-[#D4AF37]" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Video Modal Lightbox */}
      <AnimatePresence>
        {activeModalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveModalVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg aspect-[9/16] bg-black border border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Top Control Bar */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30">
                <span className="bg-black/70 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                  {activeModalVideo.badge}
                </span>

                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="w-10 h-10 rounded-full bg-black/70 hover:bg-black border border-white/20 hover:border-white text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Main Video */}
              <video
                src={activeModalVideo.src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Modal Bottom Detail Drawer */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 z-30 flex flex-col gap-2">
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                  {activeModalVideo.title}
                </h3>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {activeModalVideo.subtitle}
                </p>

                {activeModalVideo.productLink && (
                  <div className="pt-3">
                    <Link
                      href={activeModalVideo.productLink}
                      onClick={() => setActiveModalVideo(null)}
                      className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-colors shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Shop {activeModalVideo.productName}</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
