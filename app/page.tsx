import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Smart Bookmark
        </h1>
        <p className="text-lg text-gray-500">
          Your bookmarks, synced in realtime across all your tabs.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
