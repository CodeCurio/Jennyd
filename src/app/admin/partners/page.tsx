"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { 
  Search, 
  Loader2, 
  Briefcase, 
  TrendingUp, 
  UserCheck, 
  X, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { format } from "date-fns";

export interface PartnerApplication {
  id: string;
  full_name: string;
  business_name?: string | null;
  phone: string;
  email?: string | null;
  city: string;
  partner_type: string;
  message?: string | null;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  admin_notes?: string | null;
  created_at: string;
}

const LOCAL_STORAGE_KEY = "jennyd_partner_applications";

export default function AdminPartnerApplicationsPage() {
  const { addToast } = useToast();
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Modal & Detail state
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch applications from Supabase + LocalStorage fallback
  const fetchApplications = async () => {
    setIsLoading(true);
    let supabaseApps: PartnerApplication[] = [];

    try {
      const { data, error } = await supabase
        .from("partner_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        supabaseApps = data.map((item: any) => ({
          id: item.id || `app-${Math.random()}`,
          full_name: item.full_name || item.name || "N/A",
          business_name: item.business_name || null,
          phone: item.phone || "N/A",
          email: item.email || null,
          city: item.city || "N/A",
          partner_type: item.partner_type || "Business Partner",
          message: item.message || null,
          status: item.status || "Pending",
          admin_notes: item.admin_notes || null,
          created_at: item.created_at || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.log("Supabase fetch notice:", err);
    }

    // Merge with fallback localStorage
    let localApps: PartnerApplication[] = [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        localApps = JSON.parse(saved);
      }
    } catch (e) {}

    // Deduplicate by ID or phone+created_at
    const combinedMap = new Map<string, PartnerApplication>();
    [...supabaseApps, ...localApps].forEach((app) => {
      const key = app.id || `${app.phone}-${app.created_at}`;
      if (!combinedMap.has(key)) {
        combinedMap.set(key, app);
      }
    });

    const combinedList = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setApplications(combinedList);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "Pending" || !a.status).length;
    const contacted = applications.filter((a) => a.status === "Contacted").length;
    const approved = applications.filter((a) => a.status === "Approved").length;

    return { total, pending, contacted, approved };
  }, [applications]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== "All" && app.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = app.full_name?.toLowerCase().includes(q);
        const matchBusiness = app.business_name?.toLowerCase().includes(q);
        const matchPhone = app.phone?.includes(q);
        const matchEmail = app.email?.toLowerCase().includes(q);
        const matchCity = app.city?.toLowerCase().includes(q);
        const matchType = app.partner_type?.toLowerCase().includes(q);

        return matchName || matchBusiness || matchPhone || matchEmail || matchCity || matchType;
      }
      return true;
    });
  }, [applications, searchQuery, statusFilter]);

  // Open Detail Modal
  const handleOpenDetails = (app: PartnerApplication) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || "");
  };

  // Update Status in Supabase & Local state
  const handleUpdateStatus = async (newStatus: "Pending" | "Contacted" | "Approved" | "Rejected") => {
    if (!selectedApp) return;
    setStatusUpdating(true);

    try {
      // 1. Try Supabase Update
      await supabase
        .from("partner_applications")
        .update({ status: newStatus, admin_notes: adminNotes })
        .eq("id", selectedApp.id);

      // 2. Update local state
      const updatedList = applications.map((a) =>
        a.id === selectedApp.id ? { ...a, status: newStatus, admin_notes: adminNotes } : a
      );
      setApplications(updatedList);
      setSelectedApp({ ...selectedApp, status: newStatus, admin_notes: adminNotes });

      // 3. Save to localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {}

      addToast({ title: "Status Updated", message: `Application status set to ${newStatus}`, type: "success" });
    } catch (err: any) {
      addToast({ title: "Update Notice", message: "Saved status locally.", type: "info" });
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete Application
  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner application?")) return;
    setIsDeleting(true);

    try {
      await supabase.from("partner_applications").delete().eq("id", id);

      const updatedList = applications.filter((a) => a.id !== id);
      setApplications(updatedList);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {}

      setSelectedApp(null);
      addToast({ title: "Deleted", message: "Application removed successfully.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Launch WhatsApp Direct Chat
  const handleLaunchWhatsApp = (app: PartnerApplication) => {
    const text = `Hello ${app.full_name}! Thank you for your interest in joining Jennyd Scents as an Independent Business Partner (${app.partner_type}).\n\nWe have reviewed your application from ${app.city}. Let's discuss partnership opportunities and retail margins!`;
    const cleanPhone = app.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white border border-gray-150 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Loading partner applications...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Join &amp; Grow Business Collaboration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Partner Applications &amp; B2B Leads
          </h1>
        </div>

        <button
          onClick={fetchApplications}
          className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-150 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.total}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Inquiries</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.pending}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pending Review</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-150 flex items-center justify-center text-purple-600 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.contacted}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Contacted</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.approved}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Approved Partners</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Container */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, business, city, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            {["All", "Pending", "Contacted", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-white text-black shadow-xs font-semibold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Applicant / Store</th>
                <th className="px-6 py-3.5">Partnership Category</th>
                <th className="px-6 py-3.5">Contact / Phone</th>
                <th className="px-6 py-3.5">City &amp; Location</th>
                <th className="px-6 py-3.5">Applied Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No partner applications found.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Name & Business */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs uppercase shrink-0">
                          {(app.full_name || "?")[0]}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-sm block">
                            {app.full_name}
                          </span>
                          {app.business_name && (
                            <span className="text-[11px] text-gray-500 font-medium block">
                              🏢 {app.business_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {app.partner_type}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <a
                          href={`tel:${app.phone}`}
                          className="font-mono text-gray-900 font-bold hover:text-[#D4AF37] transition-colors block"
                        >
                          📞 {app.phone}
                        </a>
                        {app.email && (
                          <span className="text-[11px] text-gray-400 font-mono block">
                            {app.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-6 py-4 font-medium text-gray-700">
                      📍 {app.city}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                      {format(new Date(app.created_at), "MMM d, yyyy • h:mm a")}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : app.status === "Contacted"
                            ? "bg-purple-100 text-purple-800 border border-purple-300"
                            : app.status === "Rejected"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {app.status || "Pending"}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDetails(app)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-black bg-white border border-gray-300 hover:border-black hover:bg-gray-50 px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>View Details</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── APPLICATION DETAIL & ACTION MODAL ── */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg font-serif">
                  Partner Application Profile
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-left">
              
              {/* Applicant Summary Header */}
              <div className="bg-gradient-to-r from-[#121212] to-[#1F1F1F] text-white p-5 rounded-2xl border border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest block">
                    {selectedApp.partner_type}
                  </span>
                  <h4 className="text-xl font-serif font-bold text-white mt-0.5">
                    {selectedApp.full_name}
                  </h4>
                  {selectedApp.business_name && (
                    <p className="text-xs text-neutral-300 font-sans">
                      🏢 {selectedApp.business_name}
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-400 font-sans mt-1">
                    Submitted on {format(new Date(selectedApp.created_at), "MMMM d, yyyy • h:mm a")}
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() => handleLaunchWhatsApp(selectedApp)}
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>WhatsApp Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Grid Info Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Phone / WhatsApp Number
                  </span>
                  <span className="font-mono text-sm font-bold text-gray-900 block select-all">
                    {selectedApp.phone}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Email Address
                  </span>
                  <span className="font-mono text-sm font-bold text-gray-900 block select-all break-all">
                    {selectedApp.email || "No email provided"}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    City &amp; Location
                  </span>
                  <span className="text-sm font-bold text-gray-900 block">
                    📍 {selectedApp.city}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Partnership Category
                  </span>
                  <span className="text-sm font-bold text-[#D4AF37] block">
                    {selectedApp.partner_type}
                  </span>
                </div>
              </div>

              {/* Requirements / Goals Message */}
              {selectedApp.message && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" /> Applicant Notes &amp; Business Goals
                  </span>
                  <p className="text-xs text-amber-950 font-sans leading-relaxed italic">
                    "{selectedApp.message}"
                  </p>
                </div>
              )}

              {/* Status Update & Admin Notes Controls */}
              <div className="space-y-4 pt-2 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Update Lead Status:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(["Pending", "Contacted", "Approved", "Rejected"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleUpdateStatus(s)}
                        disabled={statusUpdating}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          selectedApp.status === s
                            ? s === "Approved"
                              ? "bg-emerald-600 text-white shadow-md"
                              : s === "Contacted"
                              ? "bg-purple-600 text-white shadow-md"
                              : s === "Rejected"
                              ? "bg-red-600 text-white shadow-md"
                              : "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal Admin Notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Internal Follow-Up Notes
                  </label>
                  <textarea
                    rows={2.5}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes (e.g., Called on 18th Aug, interested in 500 units wholesale attars...)"
                    className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <button
                      onClick={() => handleDeleteApplication(selectedApp.id)}
                      disabled={isDeleting}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Inquiry
                    </button>
                    
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.status)}
                      disabled={statusUpdating}
                      className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      {statusUpdating ? "Saving..." : "Save Admin Notes"}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
