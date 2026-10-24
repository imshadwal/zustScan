"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  fieldClass,
  primaryButtonClass,
  quietButtonClass,
} from "@/components/admin/styles";
import { isValidLoginId, normalizeLoginId, parseSoldPrice, formatRupees } from "@/lib/login-id";

type Created = { loginId: string; password: string; soldPriceLabel: string };

export function OwnerForm({ siteOrigin }: { siteOrigin: string }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const [copied, setCopied] = useState(false);

  const normalized = normalizeLoginId(loginId);
  const preview = isValidLoginId(normalized) ? `${siteOrigin}/c/${normalized}` : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!isValidLoginId(normalized)) {
      setError("Use 2 to 40 letters, numbers, and hyphens.");
      return;
    }
    if (password.length < 8 || password.length > 72) {
      setError("Use a password of 8 to 72 characters.");
      return;
    }
    const price = parseSoldPrice(soldPrice);
    if (price === null) {
      setError("Enter the price in whole rupees.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/admin/business-owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: normalized, password, soldPrice: String(price) }),
      });
      const body = (await response.json().catch(() => null)) as
        | { loginId?: string; password?: string; error?: string }
        | null;
      if (!response.ok || !body?.loginId || !body.password) {
        setError(body?.error ?? "The business owner could not be created.");
        setPending(false);
        return;
      }
      setCreated({
        loginId: body.loginId,
        password: body.password,
        soldPriceLabel: formatRupees(price),
      });
      setPassword("");
      setSoldPrice("");
      setPending(false);
    } catch {
      setError("The request could not be sent.");
      setPending(false);
    }
  }

  async function copyPassword() {
    if (!created) return;
    await navigator.clipboard.writeText(created.password);
    setCopied(true);
  }

  if (created) {
    const pageUrl = `${siteOrigin}/c/${created.loginId}`;
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white">Business owner created</h1>
        <p className="mt-2 text-sm text-white/70">
          Copy the password now. A later visit can only set a new one.
        </p>
        <div
          className="mt-6 rounded-3xl bg-white p-6 text-ink shadow-[0_12px_40px_rgba(7,20,40,0.08)]"
          role="status"
        >
          <p className="text-sm font-semibold text-muted">Login id</p>
          <p className="mt-1 font-mono text-lg">{created.loginId}</p>
          <p className="mt-5 text-sm font-semibold text-muted">Sold for</p>
          <p className="mt-1 text-lg">{created.soldPriceLabel}</p>
          <p className="mt-5 text-sm font-semibold text-muted">Password</p>
          <p className="mt-1 font-mono text-lg break-all">{created.password}</p>
          <button type="button" onClick={copyPassword} className={`${quietButtonClass} mt-4`}>
            {copied ? "Copied" : "Copy password"}
          </button>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/admin/business-owners/${created.loginId}/qr`}
              alt={`QR code linking to ${pageUrl}`}
              width={160}
              height={160}
              className="h-40 w-40 rounded-2xl border border-slate-200"
            />
            <div>
              <p className="text-sm break-all text-muted">{pageUrl}</p>
              <a
                href={`/api/admin/business-owners/${created.loginId}/qr?download=1`}
                className={`${primaryButtonClass} mt-3`}
              >
                Download QR
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm font-semibold">
          <Link href="/admin" className="text-white hover:text-white/80">
            All business owners
          </Link>
          <button
            type="button"
            className="cursor-pointer text-white/70 hover:text-white"
            onClick={() => {
              setCreated(null);
              setLoginId("");
              setSoldPrice("");
              setCopied(false);
            }}
          >
            Create another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New business owner</h1>
      <p className="mt-2 text-sm text-white/70">
        The login id becomes sign-in and the address inside the QR.
      </p>
      <form
        onSubmit={submit}
        className="mt-6 rounded-3xl bg-white p-6 text-ink shadow-[0_12px_40px_rgba(7,20,40,0.08)]"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="owner-login-id">
              Login id
            </label>
            <input
              id="owner-login-id"
              name="loginId"
              autoComplete="off"
              spellCheck={false}
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="natkhat-media"
              className={`${fieldClass} mt-2`}
              required
            />
            <p className="mt-1.5 text-xs text-muted">
              {preview ? `QR opens ${preview}` : "Letters, numbers, and hyphens."}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="owner-password">
              Password
            </label>
            <input
              id="owner-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className={`${fieldClass} mt-2`}
              required
            />
            <p className="mt-1.5 text-xs text-muted">Shown once after you save.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="owner-price">
              Price sold
            </label>
            <input
              id="owner-price"
              name="soldPrice"
              inputMode="numeric"
              autoComplete="off"
              value={soldPrice}
              onChange={(event) => setSoldPrice(event.target.value)}
              placeholder="3499"
              className={`${fieldClass} mt-2`}
              required
            />
            <p className="mt-1.5 text-xs text-muted">Whole rupees this business owner paid.</p>
          </div>
        </div>
        {error ? (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={`${primaryButtonClass} mt-6`} disabled={pending}>
          {pending ? "Saving…" : "Create business owner"}
        </button>
      </form>
    </div>
  );
}
