"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      addToast({ title: "Error fetching categories", message: error.message, type: "error" });
    } else {
      setCategories(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products in this category will become uncategorized.")) return;
    
    setIsSubmitting(true);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    setIsSubmitting(false);

    if (error) {
      addToast({ title: "Error deleting", message: error.message, type: "error" });
    } else {
      addToast({ title: "Deleted", message: "Category deleted successfully.", type: "success" });
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      description
    };

    if (editingId) {
      // Update
      const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
      if (error) {
        addToast({ title: "Update Failed", message: error.message, type: "error" });
      } else {
        addToast({ title: "Updated", message: "Category updated.", type: "success" });
        resetForm();
        fetchCategories();
      }
    } else {
      // Insert
      const { error } = await supabase.from("categories").insert([payload]);
      if (error) {
        addToast({ title: "Creation Failed", message: error.message, type: "error" });
      } else {
        addToast({ title: "Created", message: "New category created.", type: "success" });
        resetForm();
        fetchCategories();
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <div className="md:col-span-1">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  placeholder="e.g. Woody" 
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  required 
                  placeholder="e.g. woody" 
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={3} 
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-black focus:border-black" 
                />
              </div>
              
              <div className="pt-2 flex gap-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                  {editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="px-4 py-2 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      No categories found. Create your first one!
                    </td>
                  </tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold">{cat.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(cat)} className="text-gray-400 hover:text-blue-600 p-1">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600 p-1">
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
        </div>
        
      </div>
    </div>
  );
}
