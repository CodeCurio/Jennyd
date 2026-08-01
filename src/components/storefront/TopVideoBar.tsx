"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, X } from "lucide-react";

const TOP_VIDEOS = [
  {
    id: "tv1",
    src: "/assets/videos/video-1.mp4",
    label: "Artisanal Unboxing",
    tag: "LIVE EXPERIENCE"
  },
  {
    id: "tv2",
    src: "/assets/videos/video-2.mp4",
    label: "Projection & Sillage",
    tag: "24HR EXTRAIT"
  },
  {
    id: "tv3",
    src: "/assets/videos/video-3.mp4",
    label: "Perfume Connoisseurs",
    tag: "REAL REVIEWS"
  },
  {
    id: "tv4",
    src: "/assets/videos/video-4.mp4",
    label: "Distillation & Craft",
    tag: "PURE ATTAR"
  }
];

export function TopVideoBar() {
  const [activeVideo, setActiveVideo] = useState<typeof TOP_VIDEOS[0] | null>(null);

  return (
    <section className="bg-[#0D0D0D] border-b border-[#D4AF37]/30 py-3 px-4 sm:px-6 relative z-20 overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
        
        {/* Left Label */}
        <div className="flex items-center gap-2 text-white shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Featured Video Reels
          </span>
          <span className="hidden sm:inline text-neutral-500 text-xs">| Tap to preview in motion</span>
        </div>

        {/* 4 Mini Video Reel Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
          {TOP_VIDEOS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className="flex items-center gap-2 bg-[#171717] hover:bg-[#222222] border border-[#D4AF37]/25 hover:border-[#D4AF37] p-1.5 pr-3 rounded-xl transition-all duration-300 group cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:border-[#D4AF37]">
                <video
                  src={item.src}
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-3 h-3 text-[#D4AF37] fill-current" />
                </div>
              </div>

              {/* Title & Tag */}
              <div className="text-left overflow-hidden">
                <span className="block text-[8px] text-[#D4AF37] font-bold uppercase tracking-wider line-clamp-1">
                  {item.tag}
                </span>
                <span className="block text-[10.5px] text-white font-medium group-hover:text-[#D4AF37] transition-colors truncate">
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Lightbox Modal when a top reel pill is clicked */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm aspect-[9/16] bg-black border border-[#D4AF37] rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/20 hover:border-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <video
                src={activeVideo.src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block mb-0.5">
                  {activeVideo.tag}
                </span>
                <h4 className="text-lg font-serif text-white font-bold">{activeVideo.label}</h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
