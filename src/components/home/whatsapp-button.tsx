"use client";

import { useEnquiry } from "@/components/home/enquiry";

export function WhatsappButton() {
  const { openEnquiry } = useEnquiry();

  return (
    <button
      type="button"
      onClick={openEnquiry}
      className="btn-primary fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6"
    >
      Send an enquiry
    </button>
  );
}
