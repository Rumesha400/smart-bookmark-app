"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types/database";

export default function BookmarkForm({ userId, onAdd }: { userId: string, onAdd: (bookmark: Bookmark) => void }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
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

    setLoading(true);

    const { data, error: insertError } = await supabase.from("bookmarks").insert({
      title: trimmedTitle,
      url: trimmedUrl,
      user_id: userId,
    })
    .select()
    .single();

    setLoading(false);

    if (insertError) {
      setError("Failed to add bookmark. Try again.");
      return;
    }

    if (data) onAdd(data);

    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleAddBookmark} className="space-y-5">
      <div className="relative group">
        <input
          type="text"
          placeholder=" "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="peer w-full rounded-2xl border-2 border-purple-200/50 bg-white/80 backdrop-blur-sm px-5 py-4 text-base text-gray-900 placeholder-transparent outline-none transition-all duration-300 focus:border-purple-400 focus:bg-white focus:shadow-lg focus:shadow-purple-100/50 focus:ring-0"
          id="bookmark-title"
        />
        <label
          htmlFor="bookmark-title"
          className="absolute left-5 -top-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm font-semibold transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-none peer-placeholder-shown:bg-clip-border peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-purple-600 peer-focus:to-pink-600 peer-focus:bg-clip-text"
        >
          Bookmark Title
        </label>
      </div>

      <div className="relative group">
        <input
          type="text"
          placeholder=" "
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="peer w-full rounded-2xl border-2 border-purple-200/50 bg-white/80 backdrop-blur-sm px-5 py-4 text-base text-gray-900 placeholder-transparent outline-none transition-all duration-300 focus:border-purple-400 focus:bg-white focus:shadow-lg focus:shadow-purple-100/50 focus:ring-0"
          id="bookmark-url"
        />
        <label
          htmlFor="bookmark-url"
          className="absolute left-5 -top-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm font-semibold transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-none peer-placeholder-shown:bg-clip-border peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-purple-600 peer-focus:to-pink-600 peer-focus:bg-clip-text"
        >
          https://example.com
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 animate-shake">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding ...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Bookmark
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </button>
    </form>
  );
}
