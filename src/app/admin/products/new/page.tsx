"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, Check, Loader2, UploadCloud, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Note = { id: string; name: string; image_url: string };

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  
  // DB Notes
  const [dbNotes, setDbNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("");
  const [badge, setBadge] = useState("");
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [discountTag, setDiscountTag] = useState("");
  const [stock, setStock] = useState("");
  
  // Complex State
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const [images, setImages] = useState<(File | string | null)[]>([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", "", "", ""]);
  
  // Accordion State
  const [description, setDescription] = useState("");
  const [feelings, setFeelings] = useState("");
  const [occasions, setOccasions] = useState("");
  const [behindPerfume, setBehindPerfume] = useState("");

  const [dbCategories, setDbCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [notesRes, catRes] = await Promise.all([
        supabase.from("fragrance_notes").select("*").order("name"),
        supabase.from("categories").select("id, name").order("name")
      ]);
      
      if (notesRes.data) setDbNotes(notesRes.data);
      if (catRes.data) setDbCategories(catRes.data);
      
      setIsLoadingNotes(false);
    };
    fetchData();
  }, []);

  const toggleNote = (note: Note) => {
    const exists = selectedNotes.find(n => n.id === note.id);
    if (exists) {
      setSelectedNotes(selectedNotes.filter(n => n.id !== note.id));
    } else {
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const handleImageFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !price) return alert("Title, Slug, and Price are required.");
    
    setIsSubmitting(true);
    try {
      // 1. Upload Images
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        if (item instanceof File) {
          const fileExt = item.name.split('.').pop();
          const fileName = `products/${slug}-${i}-${Math.random()}.${fileExt}`;
          const { error } = await supabase.storage.from('product-images').upload(fileName, item);
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
          uploadedImageUrls.push(publicUrl);
        } else if (typeof item === 'string' && item !== "") {
          uploadedImageUrls.push(item);
        }
      }

      // 2. Format Metadata
      const metadata = {
        badge,
        type,
        discountTag,
        notes: selectedNotes.map(n => ({ name: n.name, image: n.image_url })),
        images: uploadedImageUrls,
        accordion: {
          description,
          feelings,
          occasions,
          behind_perfume: behindPerfume
        }
      };

      // 3. Insert Product
      const { error } = await supabase.from('products').insert([{
        title,
        slug,
        price: parseFloat(price),
        sale_price: mrp ? parseFloat(mrp) : null,
        stock_quantity: stock ? parseInt(stock) : 0,
        status,
        category_id: categoryId || null,
        metadata
      }]);

      if (error) throw error;

      alert("Product saved successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error(error);
      alert("Error saving product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotes = dbNotes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. SPICE WOOD 50ML" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL) *</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="e.g. spice-wood-50ml" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Type</label>
              <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder="e.g. EAU DE PARFUM" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Badge</label>
              <input type="text" value={badge} onChange={e => setBadge(e.target.value)} placeholder="e.g. UNISEX" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black">
                <option value="">No Category</option>
                {dbCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-2">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="1199" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">MRP (₹)</label>
              <input type="number" value={mrp} onChange={e => setMrp(e.target.value)} placeholder="1699" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Tag</label>
              <input type="text" value={discountTag} onChange={e => setDiscountTag(e.target.value)} placeholder="e.g. SAVE 29%" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium">Stock Quantity</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="100" className="w-full md:w-1/3 border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" />
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-2">Product Images</h2>
          <p className="text-sm text-gray-500">Upload the gallery images from your computer.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {imagePreviews.map((preview, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center shrink-0 overflow-hidden">
                  {preview ? <img src={preview} className="w-full h-full object-cover rounded" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(i, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 border border-dashed border-gray-300 rounded-md p-3 text-sm text-gray-600 justify-center hover:bg-gray-50 transition-colors">
                    <UploadCloud className="w-4 h-4" /> {preview ? "Change Image" : "Upload Image"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Notes Builder */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-lg font-bold">Visual Fragrance Notes</h2>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black"
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-80 overflow-y-auto p-1">
            {isLoadingNotes ? (
              <div className="col-span-full py-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
            ) : filteredNotes.length === 0 ? (
              <div className="col-span-full py-4 text-center text-sm text-gray-500">No notes found. <Link href="/admin/notes" className="text-blue-600 hover:underline">Add some in the Notes manager</Link>.</div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = !!selectedNotes.find(n => n.id === note.id);
                return (
                  <div 
                    key={note.id} 
                    onClick={() => toggleNote(note)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected ? "border-black bg-gray-50 shadow-sm" : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      {note.image_url ? (
                        <img src={note.image_url} alt={note.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-400" /></div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium text-center truncate w-full ${isSelected ? "text-black font-bold" : "text-gray-600"}`}>
                      {note.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Accordion Content */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-2">Detailed Content (Accordions)</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" placeholder="Rich, complex, and genderless..."></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Feelings</label>
            <textarea value={feelings} onChange={e => setFeelings(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" placeholder="Warm, Cozy, Confident..."></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Occasions</label>
            <textarea value={occasions} onChange={e => setOccasions(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" placeholder="Evening wear, Winter/Fall..."></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Behind The Perfume</label>
            <textarea value={behindPerfume} onChange={e => setBehindPerfume(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" placeholder="Created by our master perfumers..."></textarea>
          </div>
        </div>

      </form>
    </div>
  );
}
