"use client";

import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { primaryButtonClass, quietButtonClass } from "@/components/admin/styles";

const OUTPUT_SIZE = 640;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read the photo."));
    image.src = src;
  });
}

async function cropToFile(imageSrc: string, pixels: Area) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not crop the photo.");
  context.drawImage(
    image,
    pixels.x,
    pixels.y,
    pixels.width,
    pixels.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.92);
  });
  if (!blob) throw new Error("Could not crop the photo.");
  return new File([blob], "founder.jpg", { type: "image/jpeg" });
}

export function FounderPhotoCrop({
  imageSrc,
  pending,
  onCancel,
  onUse,
}: {
  imageSrc: string;
  pending: boolean;
  onCancel: () => void;
  onUse: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!pixels || pending) return;
    setError(null);
    try {
      const file = await cropToFile(imageSrc, pixels);
      onUse(file);
    } catch {
      setError("Could not crop the photo. Try another image.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close photo adjust"
        className="absolute inset-0 bg-navy/75"
        disabled={pending}
        onClick={() => {
          if (!pending) onCancel();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="founder-crop-title"
        className="relative w-full max-w-md rounded-2xl border border-black/5 bg-white p-5 text-ink sm:p-6"
      >
        <h2 id="founder-crop-title" className="text-xl font-semibold">
          Adjust photo
        </h2>
        <p className="mt-1 text-sm text-muted">Drag to move. Slide to zoom. Guests see a circle.</p>
        <div className="relative mt-4 h-72 overflow-hidden rounded-2xl bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={0}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_area, nextPixels) => setPixels(nextPixels)}
          />
        </div>
        <label className="mt-4 block text-xs font-semibold text-muted" htmlFor="founder-photo-zoom">
          Zoom
        </label>
        <input
          id="founder-photo-zoom"
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          disabled={pending}
          onChange={(event) => setZoom(Number(event.target.value))}
          className="mt-2 w-full accent-blue"
        />
        {error ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className={`${quietButtonClass} w-full sm:w-auto`}
            disabled={pending}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${primaryButtonClass} w-full sm:w-auto`}
            disabled={pending || !pixels}
            onClick={() => void confirm()}
          >
            {pending ? "Uploading…" : "Use photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
