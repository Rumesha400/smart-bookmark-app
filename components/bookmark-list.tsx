"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/database";
import BookmarkItem from "./bookmark-item";
import BookmarkForm from "./bookmark-form";

export default function BookmarkList({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const supabase = createClient();

  const handleAddLocal = (bookmark: Bookmark) => {
    setBookmarks((prev) => {
      // Prevent duplicates from optimistic updates
      if (prev.some((b) => b.id === bookmark.id)) return prev;
      return [bookmark, ...prev];
    });
  };

  useEffect(() => {
    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as Bookmark;
          setBookmarks((prev) =>
            prev.map((b) => (b.id === updated.id ? updated : b))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          const deletedId = payload.old.id;
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  return (
    <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/50 shadow-2xl p-8 transition-all duration-300">
      {/* Header with gradient */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Bookmarks
          </h2>
        </div>
        <p className="text-sm text-gray-600 ml-15">Save and organize your favorite links</p>
      </div>

      {/* Add bookmark form */}
      <BookmarkForm userId={userId} onAdd={handleAddLocal} />

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-purple-200/50"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white/60 px-4 text-xs font-semibold text-purple-600 backdrop-blur-sm">
            {bookmarks.length} {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
          </span>
        </div>
      </div>

      {/* Bookmarks list */}
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
            <svg className="h-10 w-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No bookmarks yet</h3>
          <p className="text-sm text-gray-500">Start by adding your first bookmark above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks
            .filter((bookmark, index, self) => 
              index === self.findIndex((b) => b.id === bookmark.id)
            )
            .map((bookmark) => (
            <BookmarkItem 
            key={bookmark.id} 
            bookmark={bookmark}
            onDelete={(id: string) =>
              setBookmarks((prev) => prev.filter((b) => b.id !== id))
            }
            />
          ))}
        </div>
      )}
    </div>
  );
}
