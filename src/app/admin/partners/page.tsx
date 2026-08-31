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
  ShieldCheck,
  CreditCard,
  Landmark,
  User,
  CheckSquare,
  AlertCircle,
  Download,
  Users
} from "lucide-react";
import { format } from "date-fns";

export interface IBORegistration {
  id: string;
  full_name: string;
  mother_name?: string | null;
  father_name?: string | null;
  dob?: string | null;
  gender?: string | null;
  occupation?: string | null;
  marital_status?: string | null;

  pan_tax_number?: string | null;
  aadhaar_national_id?: string | null;
  other_gov_id?: string | null;
  driving_license?: string | null;
  passport_number?: string | null;
  national_id_number?: string | null;
  voter_card_number?: string | null;

  mobile_number: string;
  whatsapp_number: string;
  email: string;
  alternate_contact?: string | null;

  house_flat_no?: string | null;
  street?: string | null;
  landmark?: string | null;
  city: string;
  district?: string | null;
  state?: string | null;
  pin_code?: string | null;
  country?: string | null;
  same_as_permanent?: boolean;

  perm_house_flat_no?: string | null;
  perm_street?: string | null;
  perm_landmark?: string | null;
  perm_city?: string | null;
  perm_district?: string | null;
  perm_state?: string | null;
  perm_pin_code?: string | null;
  perm_country?: string | null;

  sponsor_name?: string | null;
  sponsor_ibo_id?: string | null;
  sponsor_mobile?: string | null;

  account_holder_name?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  upi_id?: string | null;

  hear_about_us?: string[] | null;
  hear_about_other?: string | null;

  consent_agreement?: boolean;
  consent_income_disclosure?: boolean;
  purchase_order_no: string;

  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  admin_notes?: string | null;
  created_at: string;
}

export interface LegacyPartnerApplication {
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

const LOCAL_IBO_KEY = "jennyd_ibo_registrations";
const LOCAL_LEGACY_KEY = "jennyd_partner_applications";

export default function AdminPartnersPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"ibo" | "legacy">("ibo");
  
  // IBO State
  const [iboList, setIboList] = useState<IBORegistration[]>([]);
  const [selectedIbo, setSelectedIbo] = useState<IBORegistration | null>(null);
  
  // Legacy State
  const [legacyList, setLegacyList] = useState<LegacyPartnerApplication[]>([]);
  const [selectedLegacy, setSelectedLegacy] = useState<LegacyPartnerApplication | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [adminNotes, setAdminNotes] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all registrations from Supabase & LocalStorage
  const fetchAllData = async () => {
    setIsLoading(true);

    // 1. Fetch IBO Registrations
    let supabaseIbos: IBORegistration[] = [];
    try {
      const { data, error } = await supabase
        .from("ibo_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        supabaseIbos = data;
      }
    } catch (err) {
      console.log("Supabase IBO fetch notice:", err);
    }

    let localIbos: IBORegistration[] = [];
    try {
      const saved = localStorage.getItem(LOCAL_IBO_KEY);
      if (saved) localIbos = JSON.parse(saved);
    } catch (e) {}

    const combinedIboMap = new Map<string, IBORegistration>();
    [...supabaseIbos, ...localIbos].forEach((item) => {
      const key = item.id || `${item.mobile_number}-${item.purchase_order_no}`;
      if (!combinedIboMap.has(key)) {
        combinedIboMap.set(key, {
          ...item,
          status: item.status || "Pending"
        });
      }
    });
    setIboList(Array.from(combinedIboMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));

    // 2. Fetch Legacy Partner Inquiries
    let supabaseLegacy: LegacyPartnerApplication[] = [];
    try {
      const { data, error } = await supabase
        .from("partner_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        supabaseLegacy = data.map((item: any) => ({
          id: item.id || `legacy-${Math.random()}`,
          full_name: item.full_name || item.name || "N/A",
          business_name: item.business_name || null,
          phone: item.phone || "N/A",
          email: item.email || null,
          city: item.city || "N/A",
          partner_type: item.partner_type || "Partner Inquiry",
          message: item.message || null,
          status: item.status || "Pending",
          admin_notes: item.admin_notes || null,
          created_at: item.created_at || new Date().toISOString()
        }));
      }
    } catch (err) {}

    let localLegacy: LegacyPartnerApplication[] = [];
    try {
      const saved = localStorage.getItem(LOCAL_LEGACY_KEY);
      if (saved) localLegacy = JSON.parse(saved);
    } catch (e) {}

    const combinedLegacyMap = new Map<string, LegacyPartnerApplication>();
    [...supabaseLegacy, ...localLegacy].forEach((item) => {
      const key = item.id || `${item.phone}-${item.created_at}`;
      if (!combinedLegacyMap.has(key)) {
        combinedLegacyMap.set(key, item);
      }
    });
    setLegacyList(Array.from(combinedLegacyMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Stats calculation for active tab
  const stats = useMemo(() => {
    const list = activeTab === "ibo" ? iboList : legacyList;
    const total = list.length;
    const pending = list.filter((a) => a.status === "Pending" || !a.status).length;
    const contacted = list.filter((a) => a.status === "Contacted").length;
    const approved = list.filter((a) => a.status === "Approved").length;
    return { total, pending, contacted, approved };
  }, [activeTab, iboList, legacyList]);

  // Filtered IBO List
  const filteredIbos = useMemo(() => {
    return iboList.filter((item) => {
      if (statusFilter !== "All" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.full_name?.toLowerCase().includes(q);
        const matchPhone = item.mobile_number?.includes(q) || item.whatsapp_number?.includes(q);
        const matchEmail = item.email?.toLowerCase().includes(q);
        const matchCity = item.city?.toLowerCase().includes(q);
        const matchPO = item.purchase_order_no?.toLowerCase().includes(q);
        const matchPan = item.pan_tax_number?.toLowerCase().includes(q);
        const matchAadhaar = item.aadhaar_national_id?.toLowerCase().includes(q);
        const matchSponsor = item.sponsor_ibo_id?.toLowerCase().includes(q) || item.sponsor_name?.toLowerCase().includes(q);
        return matchName || matchPhone || matchEmail || matchCity || matchPO || matchPan || matchAadhaar || matchSponsor;
      }
      return true;
    });
  }, [iboList, searchQuery, statusFilter]);

  // Filtered Legacy List
  const filteredLegacy = useMemo(() => {
    return legacyList.filter((item) => {
      if (statusFilter !== "All" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.full_name?.toLowerCase().includes(q);
        const matchPhone = item.phone?.includes(q);
        const matchEmail = item.email?.toLowerCase().includes(q);
        const matchCity = item.city?.toLowerCase().includes(q);
        const matchType = item.partner_type?.toLowerCase().includes(q);
        return matchName || matchPhone || matchEmail || matchCity || matchType;
      }
      return true;
    });
  }, [legacyList, searchQuery, statusFilter]);

  // Open IBO Modal
  const handleOpenIboModal = (ibo: IBORegistration) => {
    setSelectedIbo(ibo);
    setAdminNotes(ibo.admin_notes || "");
  };

  // Open Legacy Modal
  const handleOpenLegacyModal = (item: LegacyPartnerApplication) => {
    setSelectedLegacy(item);
    setAdminNotes(item.admin_notes || "");
  };

  // Update IBO Status
  const handleUpdateIboStatus = async (newStatus: "Pending" | "Contacted" | "Approved" | "Rejected") => {
    if (!selectedIbo) return;
    setStatusUpdating(true);

    try {
      await supabase
        .from("ibo_registrations")
        .update({ status: newStatus, admin_notes: adminNotes })
        .eq("id", selectedIbo.id);

      const updated = iboList.map((a) =>
        a.id === selectedIbo.id ? { ...a, status: newStatus, admin_notes: adminNotes } : a
      );
      setIboList(updated);
      setSelectedIbo({ ...selectedIbo, status: newStatus, admin_notes: adminNotes });
      try {
        localStorage.setItem(LOCAL_IBO_KEY, JSON.stringify(updated));
      } catch (e) {}

      addToast({ title: "Status Updated", message: `IBO status set to ${newStatus}`, type: "success" });
    } catch (err: any) {
      addToast({ title: "Updated locally", message: "Saved status update.", type: "info" });
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete IBO
  const handleDeleteIbo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this IBO registration record?")) return;
    setIsDeleting(true);

    try {
      await supabase.from("ibo_registrations").delete().eq("id", id);
      const updated = iboList.filter((a) => a.id !== id);
      setIboList(updated);
      try {
        localStorage.setItem(LOCAL_IBO_KEY, JSON.stringify(updated));
      } catch (e) {}
      setSelectedIbo(null);
      addToast({ title: "Deleted", message: "IBO Registration removed successfully.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Launch WhatsApp for IBO
  const handleLaunchIboWhatsApp = (ibo: IBORegistration) => {
    const text = `Hello ${ibo.full_name}!\n\nCongratulations on submitting your Independent Business Owner (IBO) registration with Jennyd Scents.\n\n*Purchase Order No:* ${ibo.purchase_order_no}\n*Status:* ${ibo.status}\n*Sponsor ID:* ${ibo.sponsor_ibo_id || "Direct"}\n\nOur onboarding executive is here to complete your verification and guide you through the partner catalog and product orders.`;
    const cleanPhone = (ibo.whatsapp_number || ibo.mobile_number).replace(/[^0-9]/g, "");
    const formatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Loading registrations &amp; partner data...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 text-[#916b08] border border-[#D4AF37]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Join &amp; Grow Management Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            IBO Registrations &amp; Partner Network
          </h1>
        </div>

        <button
          onClick={fetchAllData}
          className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => { setActiveTab("ibo"); setStatusFilter("All"); }}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "ibo"
              ? "border-[#D4AF37] text-black font-extrabold"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          <Users className="w-4 h-4 text-[#D4AF37]" />
          <span>IBO Registrations</span>
          <span className="ml-1 bg-[#D4AF37]/20 text-[#846107] px-2 py-0.5 rounded-full text-[10px] font-mono">
            {iboList.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("legacy"); setStatusFilter("All"); }}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "legacy"
              ? "border-[#D4AF37] text-black font-extrabold"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span>General Partner Inquiries</span>
          <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-mono">
            {legacyList.length}
          </span>
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.total}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Submissions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.pending}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pending Review</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.contacted}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Contacted</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stats.approved}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Approved IBOs</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder={activeTab === "ibo" ? "Search by Name, PO No, Phone, PAN, Aadhaar, Sponsor ID..." : "Search by Name, Business, Phone, City..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {["All", "Pending", "Contacted", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB 1: IBO REGISTRATIONS TABLE ── */}
        {activeTab === "ibo" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">IBO Applicant</th>
                  <th className="px-6 py-3.5">Purchase Order No</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Identity (PAN / Aadhaar)</th>
                  <th className="px-6 py-3.5">Sponsor / Referral</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIbos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No IBO registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredIbos.map((ibo) => (
                    <tr key={ibo.id} className="hover:bg-amber-50/20 transition-colors">
                      
                      {/* Name & Basic */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#916b08] font-serif font-bold text-xs uppercase shrink-0">
                            {(ibo.full_name || "?")[0]}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">
                              {ibo.full_name}
                            </span>
                            <span className="text-[11px] text-gray-500 block">
                              {ibo.gender || "N/A"} • {ibo.occupation || "IBO"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* PO Number */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                          <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {ibo.purchase_order_no}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <a
                            href={`tel:${ibo.mobile_number}`}
                            className="font-mono text-gray-900 font-bold hover:text-[#D4AF37] transition-colors block"
                          >
                            📞 {ibo.mobile_number}
                          </a>
                          <span className="text-[11px] text-gray-500 block font-mono">
                            ✉ {ibo.email}
                          </span>
                          <span className="text-[11px] text-gray-400 block">
                            📍 {ibo.city}{ibo.state ? `, ${ibo.state}` : ""}
                          </span>
                        </div>
                      </td>

                      {/* Identity */}
                      <td className="px-6 py-4 font-mono text-[11px]">
                        <div className="space-y-0.5">
                          {ibo.pan_tax_number && (
                            <span className="block font-bold text-gray-800">
                              PAN: {ibo.pan_tax_number}
                            </span>
                          )}
                          {ibo.aadhaar_national_id && (
                            <span className="block text-gray-500">
                              UID: {ibo.aadhaar_national_id}
                            </span>
                          )}
                          {!ibo.pan_tax_number && !ibo.aadhaar_national_id && (
                            <span className="text-gray-400 italic">No Govt ID</span>
                          )}
                        </div>
                      </td>

                      {/* Sponsor */}
                      <td className="px-6 py-4">
                        {ibo.sponsor_ibo_id || ibo.sponsor_name ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-gray-900 block text-xs">
                              {ibo.sponsor_name || "Sponsor"}
                            </span>
                            <span className="font-mono text-[11px] text-[#916b08] block">
                              ID: {ibo.sponsor_ibo_id || "N/A"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Direct / None</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                        {format(new Date(ibo.created_at), "MMM d, yyyy • h:mm a")}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ibo.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : ibo.status === "Contacted"
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : ibo.status === "Rejected"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-blue-100 text-blue-800 border border-blue-300"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {ibo.status || "Pending"}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenIboModal(ibo)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-black bg-white border border-gray-300 hover:border-black hover:bg-gray-50 px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>View Dossier</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 2: LEGACY PARTNER INQUIRIES TABLE ── */}
        {activeTab === "legacy" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Applicant / Store</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Contact / Phone</th>
                  <th className="px-6 py-3.5">City &amp; Location</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLegacy.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No general partner inquiries found.
                    </td>
                  </tr>
                ) : (
                  filteredLegacy.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-bold text-xs">
                            {(app.full_name || "?")[0]}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">
                              {app.full_name}
                            </span>
                            {app.business_name && (
                              <span className="text-[11px] text-gray-500 block">
                                🏢 {app.business_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-800">
                          {app.partner_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-gray-900 font-bold block">
                            📞 {app.phone}
                          </span>
                          {app.email && (
                            <span className="text-[11px] text-gray-400 font-mono block">
                              {app.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        📍 {app.city}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                        {format(new Date(app.created_at), "MMM d, yyyy • h:mm a")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-800">
                          {app.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenLegacyModal(app)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-black bg-white border border-gray-300 hover:border-black px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          View Inquiry
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── FULL IBO DOSSIER MODAL (ALL FIELDS) ── */}
      {selectedIbo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedIbo(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-gray-200 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 text-[#916b08] flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg font-serif">
                    IBO Registration Dossier
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    PO No: <span className="font-mono font-bold text-black">{selectedIbo.purchase_order_no}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIbo(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-left">
              
              {/* Profile Card Banner */}
              <div className="bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#222222] text-white p-6 rounded-2xl border border-[#D4AF37]/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Official IBO Registration
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-white">
                    {selectedIbo.full_name}
                  </h4>
                  <p className="text-xs text-neutral-300 font-sans">
                    Submitted on {format(new Date(selectedIbo.created_at), "MMMM d, yyyy • h:mm a")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() => handleLaunchIboWhatsApp(selectedIbo)}
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>WhatsApp Direct</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`tel:${selectedIbo.mobile_number}`}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* 1. Personal Details */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" /> 1. Personal Information
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Full Name</span>
                    <span className="font-semibold text-gray-900">{selectedIbo.full_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Mother's Name</span>
                    <span className="font-medium text-gray-900">{selectedIbo.mother_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Father's Name</span>
                    <span className="font-medium text-gray-900">{selectedIbo.father_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Date of Birth</span>
                    <span className="font-medium text-gray-900">{selectedIbo.dob || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Gender</span>
                    <span className="font-medium text-gray-900">{selectedIbo.gender || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Occupation</span>
                    <span className="font-medium text-gray-900">{selectedIbo.occupation || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Marital Status</span>
                    <span className="font-medium text-gray-900">{selectedIbo.marital_status || "—"}</span>
                  </div>
                </div>
              </div>

              {/* 2. Identity & Government Verification */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 2. Identity &amp; Government Verification
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">PAN / Tax Number</span>
                    <span className="font-mono font-bold text-gray-900">{selectedIbo.pan_tax_number || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Aadhaar / National ID</span>
                    <span className="font-mono font-bold text-gray-900">{selectedIbo.aadhaar_national_id || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Driving License</span>
                    <span className="font-mono text-gray-900">{selectedIbo.driving_license || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Passport Number</span>
                    <span className="font-mono text-gray-900">{selectedIbo.passport_number || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">National ID No</span>
                    <span className="font-mono text-gray-900">{selectedIbo.national_id_number || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Voter Card No</span>
                    <span className="font-mono text-gray-900">{selectedIbo.voter_card_number || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Other Govt ID</span>
                    <span className="text-gray-900">{selectedIbo.other_gov_id || "—"}</span>
                  </div>
                </div>
              </div>

              {/* 3. Contact & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact */}
                <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">3. Contact Details</span>
                  <div className="space-y-1">
                    <p><strong>Mobile:</strong> <span className="font-mono font-bold select-all">{selectedIbo.mobile_number}</span></p>
                    <p><strong>WhatsApp:</strong> <span className="font-mono select-all">{selectedIbo.whatsapp_number}</span></p>
                    <p><strong>Email:</strong> <span className="font-mono select-all">{selectedIbo.email}</span></p>
                    {selectedIbo.alternate_contact && <p><strong>Alt Contact:</strong> <span className="font-mono">{selectedIbo.alternate_contact}</span></p>}
                  </div>
                </div>

                {/* Residential Address */}
                <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">4. Residential Address</span>
                  <p className="text-gray-800 leading-relaxed">
                    {[
                      selectedIbo.house_flat_no,
                      selectedIbo.street,
                      selectedIbo.landmark ? `(Near ${selectedIbo.landmark})` : null,
                      selectedIbo.city,
                      selectedIbo.district,
                      selectedIbo.state,
                      selectedIbo.pin_code,
                      selectedIbo.country
                    ].filter(Boolean).join(", ")}
                  </p>
                  {!selectedIbo.same_as_permanent && selectedIbo.perm_city && (
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Permanent Address</span>
                      <p className="text-gray-700">
                        {[
                          selectedIbo.perm_house_flat_no,
                          selectedIbo.perm_street,
                          selectedIbo.perm_city,
                          selectedIbo.perm_state,
                          selectedIbo.perm_pin_code
                        ].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Sponsor & 6. Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sponsor */}
                <div className="space-y-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 text-xs">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">5. Sponsor / Referral Information</span>
                  <div className="space-y-1">
                    <p><strong>Sponsor Name:</strong> {selectedIbo.sponsor_name || "Direct / No Sponsor"}</p>
                    <p><strong>Sponsor IBO ID:</strong> <span className="font-mono font-bold text-[#916b08]">{selectedIbo.sponsor_ibo_id || "N/A"}</span></p>
                    <p><strong>Sponsor Mobile:</strong> <span className="font-mono">{selectedIbo.sponsor_mobile || "N/A"}</span></p>
                  </div>
                </div>

                {/* Bank */}
                <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">6. Bank &amp; Payment Details</span>
                  <div className="space-y-1">
                    <p><strong>A/C Holder (As per PAN):</strong> {selectedIbo.account_holder_name || "—"}</p>
                    <p><strong>Bank Name:</strong> {selectedIbo.bank_name || "—"}</p>
                    <p><strong>Account No:</strong> <span className="font-mono select-all">{selectedIbo.account_number || "—"}</span></p>
                    <p><strong>IFSC Code:</strong> <span className="font-mono uppercase font-bold">{selectedIbo.ifsc_code || "—"}</span></p>
                    {selectedIbo.upi_id && <p><strong>UPI ID:</strong> <span className="font-mono">{selectedIbo.upi_id}</span></p>}
                  </div>
                </div>
              </div>

              {/* 7. Business & Consent & PO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Business Info */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">7. How heard about us</span>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(selectedIbo.hear_about_us) && selectedIbo.hear_about_us.length > 0 ? (
                      selectedIbo.hear_about_us.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-semibold text-gray-700">
                          {h}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">Not specified</span>
                    )}
                    {selectedIbo.hear_about_other && (
                      <span className="text-gray-600 block text-[11px]">Note: {selectedIbo.hear_about_other}</span>
                    )}
                  </div>
                </div>

                {/* Consent Status */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">8. Consent &amp; Declaration</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>IBO Agreement Agreed</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Income Disclosure Agreed</span>
                    </div>
                  </div>
                </div>

                {/* Mandatory PO */}
                <div className="bg-amber-100/60 p-4 rounded-2xl border border-amber-300 space-y-1.5">
                  <span className="text-[10px] text-amber-900 font-bold uppercase block">9. Purchase Order No</span>
                  <span className="font-mono text-sm font-extrabold text-amber-950 block select-all">
                    {selectedIbo.purchase_order_no}
                  </span>
                </div>
              </div>

              {/* Status Update & Admin Notes Controls */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Update Registration Status:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(["Pending", "Contacted", "Approved", "Rejected"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleUpdateIboStatus(s)}
                        disabled={statusUpdating}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          selectedIbo.status === s
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
                    placeholder="Add internal notes (e.g., Verified PO No, called applicant on WhatsApp, kit dispatched...)"
                    className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <button
                      onClick={() => handleDeleteIbo(selectedIbo.id)}
                      disabled={isDeleting}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Record
                    </button>
                    
                    <button
                      onClick={() => handleUpdateIboStatus(selectedIbo.status)}
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

      {/* ── LEGACY DETAIL MODAL ── */}
      {selectedLegacy && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedLegacy(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-gray-900 text-base">Partner Inquiry Details</h3>
              <button onClick={() => setSelectedLegacy(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Name:</strong> {selectedLegacy.full_name}</p>
              {selectedLegacy.business_name && <p><strong>Business:</strong> {selectedLegacy.business_name}</p>}
              <p><strong>Category:</strong> {selectedLegacy.partner_type}</p>
              <p><strong>Phone:</strong> {selectedLegacy.phone}</p>
              <p><strong>Email:</strong> {selectedLegacy.email || "N/A"}</p>
              <p><strong>City:</strong> {selectedLegacy.city}</p>
              {selectedLegacy.message && <p><strong>Message:</strong> "{selectedLegacy.message}"</p>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
