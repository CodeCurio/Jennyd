"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { 
  Save, Loader2, Plus, Trash2, Edit2, ArrowUp, ArrowDown, Upload, 
  Settings, Link as LinkIcon, Info, Phone, MessageSquare, Image as ImageIcon 
} from "lucide-react";

interface HeroSlide {
  id: string;
  image_url: string;
  tablet_image_url?: string;
  mobile_image_url?: string;
  heading: string;
  subheading: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "announcement" | "hero">("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // General & Brand Settings State
  const [siteName, setSiteName] = useState("Jennyd Scents");
  const [tagline, setTagline] = useState("Crafting premium, evocative scents that linger long after you leave the room.");
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [logoInvertedUrl, setLogoInvertedUrl] = useState("/logo.png");
  const [faviconUrl, setFaviconUrl] = useState("/favicon.ico");
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [taxRate, setTaxRate] = useState(0);
  const [taxInclusive, setTaxInclusive] = useState(true);

  // Contact & Social Settings State
  const [contactEmail, setContactEmail] = useState("support@jennyd.com");
  const [contactPhone, setContactPhone] = useState("+91 9682899765");
  const [businessAddress, setBusinessAddress] = useState("4B, Fawn Break Apartment, Sarojini Naidu Road, Lucknow, Uttar Pradesh 226001, India");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");

  // Announcement Bar State
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementText, setAnnouncementText] = useState("Free Shipping on all orders above ₹999 | COD Available");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [announcementColor, setAnnouncementColor] = useState("#000000");
  const [announcementTextColor, setAnnouncementTextColor] = useState("#ffffff");
  const [announcementsList, setAnnouncementsList] = useState<{ text: string; link: string }[]>([]);

  // Hero Slides State
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const s = data[0];
        setSiteName(s.site_name || "");
        setTagline(s.tagline || "");
        setLogoUrl(s.logo_url || "");
        setLogoInvertedUrl(s.logo_inverted_url || "");
        setFaviconUrl(s.favicon_url || "");
        setCurrencyCode(s.currency_code || "INR");
        setCurrencySymbol(s.currency_symbol || "₹");
        setTaxRate(Number(s.tax_rate) || 0);
        setTaxInclusive(s.tax_inclusive ?? true);
        setContactEmail(s.contact_email || "");
        setContactPhone(s.contact_phone || "");
        setBusinessAddress(s.business_address || "");
        setSocialInstagram(s.social_instagram || "");
        setSocialFacebook(s.social_facebook || "");
        setSocialTwitter(s.social_twitter || "");
        setSocialTiktok(s.social_tiktok || "");
        setSocialYoutube(s.social_youtube || "");
        setAnnouncementActive(s.announcement_bar_active ?? false);
        setAnnouncementText(s.announcement_bar_text || "");
        setAnnouncementLink(s.announcement_bar_link || "");
        setAnnouncementColor(s.announcement_bar_color || "#000000");
        setAnnouncementTextColor(s.announcement_bar_text_color || "#ffffff");
        
        // Handle announcements list fallback to single column
        const list = Array.isArray(s.announcements) ? s.announcements : [];
        if (list.length === 0 && s.announcement_bar_text) {
          list.push({ text: s.announcement_bar_text, link: s.announcement_bar_link || "" });
        }
        setAnnouncementsList(list);
      }
    } catch (err: any) {
      addToast({ title: "Error loading settings", message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setSlides(data || []);
    } catch (err: any) {
      addToast({ title: "Error loading slides", message: err.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchSlides();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      site_name: siteName,
      tagline,
      logo_url: logoUrl,
      logo_inverted_url: logoInvertedUrl,
      favicon_url: faviconUrl,
      currency_code: currencyCode,
      currency_symbol: currencySymbol,
      tax_rate: taxRate,
      tax_inclusive: taxInclusive,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      business_address: businessAddress,
      social_instagram: socialInstagram,
      social_facebook: socialFacebook,
      social_twitter: socialTwitter,
      social_tiktok: socialTiktok,
      social_youtube: socialYoutube,
      announcement_bar_active: announcementActive,
      // Still populate single text/link for compatibility, using the first announcement in list
      announcement_bar_text: announcementsList[0]?.text || announcementText,
      announcement_bar_link: announcementsList[0]?.link || announcementLink,
      announcement_bar_color: announcementColor,
      announcement_bar_text_color: announcementTextColor,
      announcements: announcementsList,
    };

    try {
      const { data: existing } = await supabase.from("site_settings").select("id").limit(1);

      let error;
      if (existing && existing.length > 0) {
        // Update existing row
        const { error: err } = await supabase
          .from("site_settings")
          .update(payload)
          .eq("id", existing[0].id);
        error = err;
      } else {
        // Insert new row
        const { error: err } = await supabase
          .from("site_settings")
          .insert([payload]);
        error = err;
      }

      if (error) throw error;
      addToast({ title: "Settings Saved", message: "Storefront customization updated successfully.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Save Failed", message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image Upload Helper
  const uploadImage = async (file: File, fieldSetter: (url: string) => void) => {
    try {
      setIsSubmitting(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `brand_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("brand-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("brand-assets")
        .getPublicUrl(fileName);

      fieldSetter(publicUrl);
      addToast({ title: "Image Uploaded", message: "Logo updated successfully.", type: "success" });
    } catch (err: any) {
      addToast({ 
        title: "Upload Failed", 
        message: "Ensure 'brand-assets' storage bucket exists, or input image URL manually.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Slide Specific Image Upload Helper
  const uploadSlideImage = async (file: File, key: "image_url" | "tablet_image_url" | "mobile_image_url") => {
    try {
      setIsSubmitting(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `hero_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("brand-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("brand-assets")
        .getPublicUrl(fileName);

      setEditingSlide(prev => ({ ...prev, [key]: publicUrl }));
      addToast({ title: "Image Uploaded", message: "Responsive image updated.", type: "success" });
    } catch (err: any) {
      addToast({ 
        title: "Upload Failed", 
        message: "Ensure 'brand-assets' storage bucket exists, or enter URL manually.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Slide CRUD Actions
  const handleOpenAddSlide = () => {
    if (slides.length >= 5) {
      addToast({ title: "Limit Reached", message: "Maximum 5 slides allowed.", type: "error" });
      return;
    }
    setEditingSlide({
      image_url: "",
      tablet_image_url: "",
      mobile_image_url: "",
      heading: "",
      subheading: "",
      cta_text: "Shop Now",
      cta_link: "/products",
      is_active: true,
      sort_order: slides.length
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.image_url) {
      addToast({ title: "Error", message: "Main Desktop image is required.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSlide.id) {
        // Update
        const { error } = await supabase
          .from("hero_slides")
          .update(editingSlide)
          .eq("id", editingSlide.id);
        if (error) throw error;
        addToast({ title: "Slide Updated", message: "Carousel slide saved successfully.", type: "success" });
      } else {
        // Insert
        const { error } = await supabase
          .from("hero_slides")
          .insert([editingSlide]);
        if (error) throw error;
        addToast({ title: "Slide Created", message: "New slide added successfully.", type: "success" });
      }
      setIsSlideModalOpen(false);
      setEditingSlide(null);
      fetchSlides();
    } catch (err: any) {
      addToast({ title: "Error saving slide", message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("hero_slides").delete().eq("id", id);
      if (error) throw error;
      addToast({ title: "Slide Deleted", message: "Carousel slide removed successfully.", type: "success" });
      fetchSlides();
    } catch (err: any) {
      addToast({ title: "Error deleting slide", message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveSlide = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const list = [...slides];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Recalculate order numbers
    const updatedList = list.map((item, idx) => ({
      ...item,
      sort_order: idx
    }));

    setSlides(updatedList);
    setIsSubmitting(true);

    try {
      for (const item of updatedList) {
        await supabase
          .from("hero_slides")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id);
      }
      addToast({ title: "Order Saved", message: "Carousel slide order updated.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Order Save Failed", message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnnouncement = () => {
    if (announcementsList.length >= 5) {
      addToast({ title: "Limit Reached", message: "Maximum 5 announcements allowed.", type: "error" });
      return;
    }
    setAnnouncementsList(prev => [...prev, { text: "", link: "" }]);
  };

  const handleUpdateAnnouncement = (index: number, key: "text" | "link", val: string) => {
    setAnnouncementsList(prev => prev.map((item, idx) => idx === index ? { ...item, [key]: val } : item));
  };

  const handleDeleteAnnouncement = (index: number) => {
    setAnnouncementsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveAnnouncement = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= announcementsList.length) return;
    const list = [...announcementsList];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setAnnouncementsList(list);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-150">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure layout, details, colors, and responsive homepage content.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        {[
          { id: "general", label: "Brand & General", icon: Settings },
          { id: "contact", label: "Contact & Social", icon: Phone },
          { id: "announcement", label: "Announcement Bar", icon: MessageSquare },
          { id: "hero", label: "Homepage Hero Slides", icon: ImageIcon },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === t.id 
                  ? "border-black text-black" 
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Forms content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
        {activeTab !== "hero" && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Site details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Site Name</label>
                    <input 
                      type="text" 
                      value={siteName} 
                      onChange={e => setSiteName(e.target.value)} 
                      placeholder="e.g. Jennyd Scents"
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Site Tagline</label>
                    <input 
                      type="text" 
                      value={tagline} 
                      onChange={e => setTagline(e.target.value)} 
                      placeholder="e.g. Premium Fragrances"
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                </div>

                <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pt-4 pb-2">Brand Logos & Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Primary Logo */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded border border-gray-100">
                    <label className="text-sm font-semibold block">Primary Logo (Light BG)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="text" 
                        value={logoUrl} 
                        onChange={e => setLogoUrl(e.target.value)} 
                        placeholder="Image URL"
                        className="w-full border border-gray-300 bg-white rounded-md p-2 text-xs focus:ring-black focus:border-black" 
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 rounded text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" /> Upload File
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], setLogoUrl)}
                            className="hidden" 
                          />
                        </label>
                        {logoUrl && <a href={logoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Preview</a>}
                      </div>
                    </div>
                  </div>

                  {/* Inverted Logo */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded border border-gray-100">
                    <label className="text-sm font-semibold block">Inverted Logo (Dark BG)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="text" 
                        value={logoInvertedUrl} 
                        onChange={e => setLogoInvertedUrl(e.target.value)} 
                        placeholder="Inverted Image URL"
                        className="w-full border border-gray-300 bg-white rounded-md p-2 text-xs focus:ring-black focus:border-black" 
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 rounded text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" /> Upload File
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], setLogoInvertedUrl)}
                            className="hidden" 
                          />
                        </label>
                        {logoInvertedUrl && <a href={logoInvertedUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Preview</a>}
                      </div>
                    </div>
                  </div>

                  {/* Favicon */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded border border-gray-100">
                    <label className="text-sm font-semibold block">Favicon (.ico/.png)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="text" 
                        value={faviconUrl} 
                        onChange={e => setFaviconUrl(e.target.value)} 
                        placeholder="Favicon URL"
                        className="w-full border border-gray-300 bg-white rounded-md p-2 text-xs focus:ring-black focus:border-black" 
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 rounded text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" /> Upload File
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], setFaviconUrl)}
                            className="hidden" 
                          />
                        </label>
                        {faviconUrl && <a href={faviconUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Preview</a>}
                      </div>
                    </div>
                  </div>

                </div>

                <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pt-4 pb-2">Regional & Tax</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Currency Code</label>
                    <select 
                      value={currencyCode} 
                      onChange={e => setCurrencyCode(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Currency Symbol</label>
                    <input 
                      type="text" 
                      value={currencySymbol} 
                      onChange={e => setCurrencySymbol(e.target.value)} 
                      placeholder="e.g. ₹"
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Global Tax Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={taxRate} 
                      onChange={e => setTaxRate(Number(e.target.value))} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Business contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Business Email</label>
                    <input 
                      type="email" 
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Business Phone</label>
                    <input 
                      type="text" 
                      value={contactPhone} 
                      onChange={e => setContactPhone(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Business Address (Comma Separated)</label>
                    <textarea 
                      value={businessAddress} 
                      onChange={e => setBusinessAddress(e.target.value)} 
                      rows={3}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                </div>

                <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pt-4 pb-2">Social links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Instagram URL</label>
                    <input 
                      type="text" 
                      value={socialInstagram} 
                      onChange={e => setSocialInstagram(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Facebook URL</label>
                    <input 
                      type="text" 
                      value={socialFacebook} 
                      onChange={e => setSocialFacebook(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Twitter/X URL</label>
                    <input 
                      type="text" 
                      value={socialTwitter} 
                      onChange={e => setSocialTwitter(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">YouTube URL</label>
                    <input 
                      type="text" 
                      value={socialYoutube} 
                      onChange={e => setSocialYoutube(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">TikTok URL</label>
                    <input 
                      type="text" 
                      value={socialTiktok} 
                      onChange={e => setSocialTiktok(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ANNOUNCEMENT TAB */}
            {activeTab === "announcement" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-150 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Announcement Bar Settings</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage up to 5 announcement messages to display at the top of your storefront.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddAnnouncement}
                    disabled={announcementsList.length >= 5}
                    className="bg-black text-white px-3.5 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Announcement ({announcementsList.length}/5)
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* General Bar settings */}
                  <div className="md:col-span-1 space-y-5 p-4 bg-gray-50 rounded-lg border border-gray-200 h-fit">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="announcementActive" 
                        checked={announcementActive} 
                        onChange={e => setAnnouncementActive(e.target.checked)} 
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black cursor-pointer"
                      />
                      <label htmlFor="announcementActive" className="text-sm font-semibold cursor-pointer">Enable Announcement Bar</label>
                    </div>

                    {/* Colors grid */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      {/* Background Color */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Background Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={announcementColor} 
                            onChange={e => setAnnouncementColor(e.target.value)} 
                            className="w-10 h-10 border border-gray-300 rounded bg-transparent p-0 cursor-pointer flex-shrink-0"
                          />
                          <input 
                            type="text" 
                            value={announcementColor} 
                            onChange={e => setAnnouncementColor(e.target.value)} 
                            className="border border-gray-300 bg-white rounded-md p-2 text-xs font-mono uppercase focus:ring-black focus:border-black w-full"
                          />
                        </div>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Text Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={announcementTextColor} 
                            onChange={e => setAnnouncementTextColor(e.target.value)} 
                            className="w-10 h-10 border border-gray-300 rounded bg-transparent p-0 cursor-pointer flex-shrink-0"
                          />
                          <input 
                            type="text" 
                            value={announcementTextColor} 
                            onChange={e => setAnnouncementTextColor(e.target.value)} 
                            className="border border-gray-300 bg-white rounded-md p-2 text-xs font-mono uppercase focus:ring-black focus:border-black w-full"
                          />
                        </div>
                      </div>

                      {/* Reset Colors Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setAnnouncementColor("#000000");
                          setAnnouncementTextColor("#ffffff");
                          addToast({ title: "Colors Reset", message: "Colors set to defaults (Black bg, White text).", type: "info" });
                        }}
                        className="w-full mt-1.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Reset to Defaults
                      </button>
                    </div>

                    {/* Live Preview box */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Live Preview</span>
                      <div 
                        className="w-full text-center py-2 px-3 text-[10px] md:text-xs uppercase tracking-widest rounded font-semibold overflow-hidden whitespace-nowrap text-ellipsis shadow-inner transition-all select-none min-h-[32px] flex items-center justify-center"
                        style={{
                          backgroundColor: announcementActive ? announcementColor : "#e5e7eb",
                          color: announcementActive ? announcementTextColor : "#9ca3af",
                          opacity: announcementActive ? 1 : 0.6
                        }}
                      >
                        {announcementsList.length > 0 
                          ? (announcementsList[0].text || "Announcement Text Preview")
                          : "Announcement Bar Disabled"
                        }
                      </div>
                    </div>
                  </div>

                  {/* Announcements list */}
                  <div className="md:col-span-2 space-y-4">
                    {announcementsList.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-gray-300 rounded text-gray-500 text-sm">
                        No announcement messages added. Click "Add Announcement" to create one!
                      </div>
                    ) : (
                      announcementsList.map((ann, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white shadow-xs relative group/ann">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Announcement #{idx + 1}</span>
                            <div className="flex items-center gap-1.5">
                              <button 
                                type="button"
                                onClick={() => handleMoveAnnouncement(idx, "up")}
                                disabled={idx === 0}
                                className="p-1 border border-gray-200 bg-white rounded text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleMoveAnnouncement(idx, "down")}
                                disabled={idx === announcementsList.length - 1}
                                className="p-1 border border-gray-200 bg-white rounded text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteAnnouncement(idx)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 ml-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Message Text *</label>
                              <input 
                                type="text" 
                                value={ann.text} 
                                onChange={e => handleUpdateAnnouncement(idx, "text", e.target.value)}
                                required
                                placeholder="e.g. Free shipping on all orders above ₹999!"
                                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-black focus:border-black"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Link URL (Optional)</label>
                              <input 
                                type="text" 
                                value={ann.link} 
                                onChange={e => handleUpdateAnnouncement(idx, "link", e.target.value)}
                                placeholder="e.g. /collections/all"
                                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-black focus:border-black"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button for Settings Form */}
            <div className="pt-6 border-t border-gray-150 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-black text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
                Save settings
              </button>
            </div>
            
          </form>
        )}

        {/* HERO SLIDES TAB */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Homepage Hero Slides</h3>
                <p className="text-xs text-gray-500 mt-0.5">Control the top banners on your storefront (Max 5 slides, responsive dimensions required).</p>
              </div>
              <button 
                onClick={handleOpenAddSlide}
                disabled={slides.length >= 5}
                className="bg-black text-white px-4 py-2 text-xs font-bold rounded flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Slide ({slides.length}/5)
              </button>
            </div>

            {/* Slides List Table */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Slide Preview</th>
                    <th className="px-4 py-3">Heading / Subheading</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Order</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {slides.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-500 text-sm">
                        No custom hero slides created. Using default fallback slides.
                      </td>
                    </tr>
                  ) : (
                    slides.map((slide, idx) => (
                      <tr key={slide.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="relative w-32 h-16 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                            {slide.image_url ? (
                              <img src={slide.image_url} alt={slide.heading} className="object-cover w-full h-full" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900 leading-normal">{slide.heading || "Untitled Slide"}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{slide.subheading || "No subtitle"}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                            slide.is_active ? "bg-green-150 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            {slide.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => handleMoveSlide(idx, "up")}
                              disabled={idx === 0 || isSubmitting}
                              className="p-1 border border-gray-200 bg-white rounded text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleMoveSlide(idx, "down")}
                              disabled={idx === slides.length - 1 || isSubmitting}
                              className="p-1 border border-gray-200 bg-white rounded text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleOpenEditSlide(slide)}
                              className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSlide(slide.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Slide Modal */}
            {isSlideModalOpen && editingSlide && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-lg border border-gray-200 max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  
                  <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-foreground">
                      {editingSlide.id ? "Edit Slide Settings" : "Create Homepage Slide"}
                    </h3>
                    <button 
                      onClick={() => setIsSlideModalOpen(false)}
                      className="text-gray-500 hover:text-black font-semibold text-lg cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleSaveSlide} className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Typography details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Heading (Main Title)</label>
                        <input 
                          type="text" 
                          value={editingSlide.heading || ""} 
                          onChange={e => setEditingSlide(prev => ({ ...prev, heading: e.target.value }))}
                          placeholder="e.g. Floral Fantasies"
                          className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-black focus:border-black" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Subheading (Top Tag)</label>
                        <input 
                          type="text" 
                          value={editingSlide.subheading || ""} 
                          onChange={e => setEditingSlide(prev => ({ ...prev, subheading: e.target.value }))}
                          placeholder="e.g. NEW ARRIVALS"
                          className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-black focus:border-black" 
                        />
                      </div>
                    </div>

                    {/* CTA Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">CTA Button Text</label>
                        <input 
                          type="text" 
                          value={editingSlide.cta_text || ""} 
                          onChange={e => setEditingSlide(prev => ({ ...prev, cta_text: e.target.value }))}
                          placeholder="e.g. SHOP NOW"
                          className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-black focus:border-black" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">CTA Link URL</label>
                        <input 
                          type="text" 
                          value={editingSlide.cta_link || ""} 
                          onChange={e => setEditingSlide(prev => ({ ...prev, cta_link: e.target.value }))}
                          placeholder="e.g. /products?category=women"
                          className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-black focus:border-black" 
                        />
                      </div>
                    </div>

                    {/* Image inputs for Laptop, Tablet, Mobile */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> Responsive Images
                      </h4>

                      {/* Desktop */}
                      <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <label className="text-xs font-bold text-gray-700">1. Laptop / Desktop Image (Required)</label>
                          <span className="text-[10px] text-gray-400 font-medium font-mono">Recommended: 1600x900px or 1920x800px (16:9)</span>
                        </div>
                        <input 
                          type="text" 
                          value={editingSlide.image_url || ""} 
                          onChange={e => setEditingSlide(prev => ({ ...prev, image_url: e.target.value }))}
                          required
                          placeholder="Public Image URL"
                          className="w-full border border-gray-300 bg-white rounded p-2 text-xs focus:ring-black focus:border-black" 
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-[11px] font-semibold cursor-pointer">
                            <Upload className="w-3 h-3" /> Upload File
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={e => e.target.files?.[0] && uploadSlideImage(e.target.files[0], "image_url")}
                              className="hidden" 
                            />
                          </label>
                          {editingSlide.image_url && <a href={editingSlide.image_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">Preview</a>}
                        </div>
                      </div>

                      {/* Tablet */}
                      <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <label className="text-xs font-bold text-gray-700">2. Tablet Image (Optional - falls back to Laptop)</label>
                          <span className="text-[10px] text-gray-400 font-medium font-mono">Recommended: 1024x768px (4:3)</span>
                        </div>
                        <input 
                          type="text" 
                          value={editingSlide.tablet_image_url || ""} 
                          onChange={e => setEditingSlide(prev => ({ ...prev, tablet_image_url: e.target.value }))}
                          placeholder="Tablet Image URL"
                          className="w-full border border-gray-300 bg-white rounded p-2 text-xs focus:ring-black focus:border-black" 
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-[11px] font-semibold cursor-pointer">
                            <Upload className="w-3 h-3" /> Upload File
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={e => e.target.files?.[0] && uploadSlideImage(e.target.files[0], "tablet_image_url")}
                              className="hidden" 
                            />
                          </label>
                          {editingSlide.tablet_image_url && <a href={editingSlide.tablet_image_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">Preview</a>}
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <label className="text-xs font-bold text-gray-700">3. Mobile Image (Optional - falls back to Laptop)</label>
                          <span className="text-[10px] text-gray-400 font-medium font-mono">Recommended: 400x500px (4:5) or 375x812px</span>
                        </div>
                        <input 
                          type="text" 
                          value={editingSlide.mobile_image_url || ""} 
                          onChange={e => setEditingSlide(prev => ({ ...prev, mobile_image_url: e.target.value }))}
                          placeholder="Mobile Image URL"
                          className="w-full border border-gray-300 bg-white rounded p-2 text-xs focus:ring-black focus:border-black" 
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-[11px] font-semibold cursor-pointer">
                            <Upload className="w-3 h-3" /> Upload File
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={e => e.target.files?.[0] && uploadSlideImage(e.target.files[0], "mobile_image_url")}
                              className="hidden" 
                            />
                          </label>
                          {editingSlide.mobile_image_url && <a href={editingSlide.mobile_image_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">Preview</a>}
                        </div>
                      </div>

                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        id="slideActive" 
                        checked={editingSlide.is_active || false}
                        onChange={e => setEditingSlide(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <label htmlFor="slideActive" className="text-sm font-semibold cursor-pointer">Show slide on storefront</label>
                    </div>

                    <div className="pt-4 border-t border-gray-150 flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsSlideModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-sm font-semibold rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-black text-white px-5 py-2 text-sm font-semibold rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Slide
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
