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
    <div className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <form
          onSubmit={submit}
          className="rounded-2xl border border-black/5 bg-white p-8 text-ink"
        >
          <Image
            src="/logo.png"
            alt="Zust Scan"
            width={1493}
            height={675}
            preload
            className="h-12 w-auto"
          />
          <p className="caption-1 mt-8 text-muted">Admin</p>
          <h1 className="heading-4 mt-4">Sign in</h1>
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
          <Link href="/" className="font-semibold text-ink hover:text-blue">
            Back to the site
          </Link>
          <p className="text-muted">Scan to share, review to care.</p>
        </div>
      </div>
    </div>
  );
}
