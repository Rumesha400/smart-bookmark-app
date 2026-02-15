"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/database";


export default function BookmarkItem({ bookmark, onDelete }: { bookmark: Bookmark, onDelete: (id: string) => void; }) {
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle || !trimmedUrl) {
      setError("Both fields are required.");
      return;
    }
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase
      .from("bookmarks")
      .update({ title: trimmedTitle, url: trimmedUrl })
      .eq("id", bookmark.id);
    setSaving(false);

    if (updateError) {
      setError("Failed to save. Try again.");
      return;
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setError("");
    setEditing(false);
  };

  const handleDelete = async () => {
    await supabase.from("bookmarks").delete().eq("id", bookmark.id);
    onDelete(bookmark.id);
  };

  if (editing) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-purple-200/50 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-purple-400 focus:shadow-md"
            placeholder="Bookmark title"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border-2 border-purple-200/50 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-purple-400 focus:shadow-md"
            placeholder="https://example.com"
          />
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-xs font-medium text-red-700">{error}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:scale-[1.01]">
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" style={{ padding: '2px' }}>
        <div className="h-full w-full rounded-2xl bg-white"></div>
      </div>
      
      {/* Accent bar */}
      <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></div>
      
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex items-center gap-2 w-fit"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 transition-all duration-300 group-hover/link:from-purple-200 group-hover/link:to-pink-200">
              <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover/link:text-purple-600">
                {bookmark.title}
              </h3>
              <p className="truncate text-sm text-gray-500 transition-colors group-hover/link:text-purple-500">
                {bookmark.url}
              </p>
            </div>
          </a>
        </div>
        
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-xs font-semibold text-blue-600 transition-all hover:from-blue-100 hover:to-indigo-100 hover:shadow-md"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:from-red-100 hover:to-pink-100 hover:shadow-md"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

