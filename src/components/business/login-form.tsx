"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass } from "@/components/admin/styles";
import { PasswordInput } from "@/components/password-input";

export function BusinessLoginForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/business/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ loginId, password }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(body?.error ?? "That login id or password is not right.");
        setPending(false);
        return;
      }
      // Full load shows the dashboard spinner instead of a stuck "Signing in…" button
      // while /business RSC fetches profile and services from Supabase.
      window.location.assign("/business");
    } catch {
      setError("The request could not be sent.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 text-ink">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Zust Scan" width={1493} height={675} className="h-10 w-auto" />
        </div>
        <p className="caption-1 mt-6 text-center text-muted">Business owner</p>
        <h1 className="heading-4 mt-2 text-center">Sign in</h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="business-login-id">
              Login id
            </label>
            <input
              id="business-login-id"
              name="loginId"
              autoComplete="username"
              spellCheck={false}
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              className={`${fieldClass} mt-2`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="business-password">
              Password
            </label>
            <PasswordInput
              id="business-password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              inputClassName={fieldClass}
              wrapperClassName="mt-2"
              required
            />
          </div>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className={`${primaryButtonClass} w-full`} disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-semibold text-blue hover:text-blue-deep">
            Back to the site
          </Link>
        </p>
      </div>
      <p className="caption-1 mt-8 text-muted">Scan to share, review to care.</p>
    </div>
  );
}
