"use client";

import dynamic from "next/dynamic";

// Dynamically import the share content with no SSR to avoid hydration issues
const SharePageContent = dynamic(() => import("./SharePageContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-golden-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function SharePage() {
  return <SharePageContent />;
}
