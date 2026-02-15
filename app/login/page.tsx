import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/auth-button";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Smart Bookmark</h1>
          <p className="mt-2 text-sm text-gray-500">
            Save and organize your bookmarks
          </p>
        </div>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
