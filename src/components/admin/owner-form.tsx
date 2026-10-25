"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  fieldClass,
  primaryButtonClass,
  quietButtonClass,
} from "@/components/admin/styles";
import { PasswordInput, RevealableSecret } from "@/components/password-input";
import { useToast } from "@/components/toast/toast-provider";
import { isValidLoginId, normalizeLoginId, parseSoldPrice, formatRupees } from "@/lib/login-id";
import type { StandeeType } from "@/lib/standee-type";

type Created = {
  loginId: string;
  password: string;
  soldPriceLabel: string;
  standeeType: StandeeType;
};

export function OwnerForm({ siteOrigin }: { siteOrigin: string }) {
  const { success, error: toastError } = useToast();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [standeeType, setStandeeType] = useState<StandeeType>("table");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const [copied, setCopied] = useState(false);

  const normalized = normalizeLoginId(loginId);
  const preview = isValidLoginId(normalized)
    ? standeeType === "event"
      ? `${siteOrigin}/e/${normalized}`
      : `${siteOrigin}/c/${normalized}`
    : null;

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
        body: JSON.stringify({
          loginId: normalized,
          password,
          soldPrice: String(price),
          standeeType,
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { loginId?: string; password?: string; standeeType?: StandeeType; error?: string }
        | null;
      if (!response.ok || !body?.loginId || !body.password) {
        const message = body?.error ?? "The business owner could not be created.";
        setError(message);
        toastError(message);
        setPending(false);
        return;
      }
      success("Business owner saved.");
      const createdStandeeType = body.standeeType === "event" ? "event" : "table";
      setCreated({
        loginId: body.loginId,
        password: body.password,
        soldPriceLabel: formatRupees(price),
        standeeType: createdStandeeType,
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
    const pageUrl =
      created.standeeType === "event"
        ? `${siteOrigin}/e/${created.loginId}`
        : `${siteOrigin}/c/${created.loginId}`;
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
          <p className="mt-5 text-sm font-semibold text-muted">Standee type</p>
          <p className="mt-1 text-lg">
            {created.standeeType === "event" ? "Event (/e/…)" : "Table (/c/…)"}
          </p>
          <p className="mt-5 text-sm font-semibold text-muted">Password</p>
          <RevealableSecret value={created.password} />
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
              setStandeeType("table");
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
            <PasswordInput
              id="owner-password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
              inputClassName={fieldClass}
              wrapperClassName="mt-2"
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
          <fieldset>
            <legend className="text-sm font-semibold text-ink">Standee type</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer gap-3 rounded-2xl border-2 border-slate-200 p-4 has-checked:border-blue has-checked:bg-blue/5">
                <input
                  type="radio"
                  name="standeeType"
                  value="table"
                  checked={standeeType === "table"}
                  onChange={() => setStandeeType("table")}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold">Table standee</span>
                  <span className="mt-1 block text-xs text-muted">
                    Everyday QR — guests use /c/login-id (services & products).
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer gap-3 rounded-2xl border-2 border-slate-200 p-4 has-checked:border-blue has-checked:bg-blue/5">
                <input
                  type="radio"
                  name="standeeType"
                  value="event"
                  checked={standeeType === "event"}
                  onChange={() => setStandeeType("event")}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold">Event standee</span>
                  <span className="mt-1 block text-xs text-muted">
                    Function QR — /e/login-id, event name, date, and areas (Food, Hall…).
                  </span>
                </span>
              </label>
            </div>
          </fieldset>
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
