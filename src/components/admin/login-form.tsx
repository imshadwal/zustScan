"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass } from "@/components/admin/styles";
import { PasswordInput } from "@/components/password-input";

export function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ login, password }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(body?.error ?? "That id or password is not right.");
        setPending(false);
        return;
      }
      window.location.assign("/admin");
    } catch {
      setError("The request could not be sent.");
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-4 py-16 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-blue/30 blur-3xl" />
        <div className="absolute bottom-0 left-[-12%] h-64 w-64 rounded-full bg-blue/15 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <form
          onSubmit={submit}
          className="rounded-3xl bg-white p-8 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        >
          <Image
            src="/logo.png"
            alt="Zust Scan"
            width={1493}
            height={675}
            preload
            className="h-12 w-auto"
          />
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-xs font-semibold tracking-[0.14em] text-blue uppercase">
            Admin
          </p>
          <h1 className="mt-4 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Create a customer login and download its QR.
          </p>
          <label className="mt-6 block text-sm font-semibold" htmlFor="admin-login">
            Admin id
          </label>
          <input
            id="admin-login"
            name="username"
            autoComplete="username"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className={`${fieldClass} mt-2`}
            required
          />
          <label className="mt-4 block text-sm font-semibold" htmlFor="admin-password">
            Password
          </label>
          <PasswordInput
            id="admin-password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            inputClassName={fieldClass}
            wrapperClassName="mt-2"
            required
          />
          {error ? (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className={`${primaryButtonClass} mt-6 w-full`}
            disabled={pending}
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <Link href="/" className="font-semibold text-white/80 hover:text-white">
            Back to the site
          </Link>
          <p className="text-white/55">Scan to share, review to care.</p>
        </div>
      </div>
    </div>
  );
}
