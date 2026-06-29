"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash, Edit, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Note = { id: string; name: string; image_url: string };

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("fragrance_notes").select("*").order("name");
    if (!error && data) setNotes(data);
    setIsLoading(false);
  };

  const handleEdit = (note: Note) => {
    setIsEditing(true);
    setCurrentId(note.id);
    setName(note.name);
    setImagePreview(note.image_url || "");
    setImageFile(null);
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentId(null);
    setName("");
    setImagePreview("");
    setImageFile(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName("");
    setImagePreview("");
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Name is required");
    
    setIsSaving(true);
    try {
      let finalImageUrl = imagePreview;

      // Upload image if a new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `notes/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      if (currentId) {
        // Update
        const { error } = await supabase
          .from("fragrance_notes")
          .update({ name, image_url: finalImageUrl })
          .eq("id", currentId);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("fragrance_notes")
          .insert([{ name, image_url: finalImageUrl }]);
        if (error) throw error;
      }
      
      await fetchNotes();
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      alert("Error saving note: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const { error } = await supabase.from("fragrance_notes").delete().eq("id", id);
      if (error) throw error;
      await fetchNotes();
    } catch (error: any) {
      alert("Error deleting: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Fragrance Notes</h1>
        {!isEditing && (
          <Button onClick={handleAddNew} className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4" /> Add Note
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm max-w-xl">
          <h2 className="text-lg font-bold mb-4">{currentId ? "Edit Note" : "New Note"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="e.g. Saffron"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-black focus:border-black" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button type="button" onClick={handleCancel} variant="outline" className="flex-1">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="flex-1 bg-black text-white hover:bg-gray-800">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 sm:p-6">
            {isLoading ? (
              <div className="col-span-full py-8 text-center text-gray-500 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : notes.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p>No notes found. Add your first ingredient.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="relative group flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-gray-200">
                    {note.image_url ? (
                      <img src={note.image_url} alt={note.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400" /></div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-center">{note.name}</span>
                  
                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm rounded-md border border-gray-200 p-1">
                    <button onClick={() => handleEdit(note)} className="p-1 text-gray-500 hover:text-black rounded"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(note.id)} className="p-1 text-gray-500 hover:text-red-600 rounded"><Trash className="w-3 h-3" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
