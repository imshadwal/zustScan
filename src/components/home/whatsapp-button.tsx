"use client";

import { useEnquiry } from "@/components/home/enquiry";

export function WhatsappButton() {
  const { openEnquiry } = useEnquiry();

  return (
    <button
      type="button"
      onClick={openEnquiry}
      aria-label="Send an enquiry"
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#111111] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-[#3dde7a] ring-2 ring-white" />
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 3C7.31 3 3.5 6.76 3.5 11.42c0 1.48.4 2.92 1.16 4.18L3.4 21l5.55-1.22a8.7 8.7 0 003.09.56h.01c4.73 0 8.54-3.76 8.54-8.42C20.59 6.76 16.77 3 12.04 3zm4.95 11.93c-.2.58-1.18 1.1-1.64 1.16-.42.06-.96.08-1.55-.1-.36-.1-.82-.26-1.41-.51-2.48-1.07-4.1-3.57-4.22-3.74-.12-.16-1-1.33-1-2.54s.63-1.8.86-2.05c.22-.24.48-.3.64-.3h.46c.15 0 .34-.05.53.4.2.48.67 1.64.73 1.76.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.47.14.24.62 1.02 1.33 1.66.92.82 1.69 1.07 1.93 1.19.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.16z"
        />
      </svg>
    </button>
  );
}
