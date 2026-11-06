import type { Metadata } from "next";
import { siteName } from "@/lib/site";

const ogImage = {
  url: "/icon-512.png",
  width: 512,
  height: 512,
  alt: siteName,
};

export function pageMetadata({
  title,
  description,
  path,
  absolute = false,
}: {
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
}): Metadata {
  const branded = absolute ? title : `${title} | ${siteName}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: branded,
      description,
      url: path,
      siteName,
      type: "website",
      locale: "en_IN",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: branded,
      description,
      images: [ogImage.url],
    },
  };
}
