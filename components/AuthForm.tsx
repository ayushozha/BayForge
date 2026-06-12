"use client";

import { useState } from "react";

type Mode = "login" | "signup";

type Props = {
  mode: Mode;
  initialError?: string;
};

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Social sign-in didn't complete. Please try again.",
  AUTH_OAUTH_CANCELLED: "Sign-in was cancelled.",
  provider_unavailable: "That sign-in method isn't available right now. Please use email instead.",
};

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        stroke="none"
        d="M12 1.6a10.4 10.4 0 0 0-3.29 20.27c.52.1.71-.22.71-.5l-.01-1.95c-2.9.63-3.51-1.23-3.51-1.23-.47-1.2-1.16-1.52-1.16-1.52-.95-.65.07-.64.07-.64 1.05.07 1.6 1.08 1.6 1.08.93 1.6 2.45 1.14 3.05.87.1-.68.37-1.14.66-1.4-2.31-.26-4.74-1.16-4.74-5.15 0-1.14.4-2.07 1.07-2.8-.11-.26-.46-1.32.1-2.75 0 0 .87-.28 2.86 1.07a9.9 9.9 0 0 1 5.21 0c1.98-1.35 2.85-1.07 2.85-1.07.57 1.43.21 2.49.1 2.75.67.73 1.07 1.66 1.07 2.8 0 4-2.43 4.88-4.75 5.14.37.32.7.96.7 1.93l-.01 2.87c0 .28.18.6.72.5A10.4 10.4 0 0 0 12 1.6Z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" stroke="none" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z" />
      <path fill="#34A853" stroke="none" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3a7.18 7.18 0 0 1-10.71-3.78H1.35v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" stroke="none" d="M5.35 14.3a7.21 7.21 0 0 1 0-4.6V6.6H1.35a12.01 12.01 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" stroke="none" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.97 11.97 0 0 0 1.35 6.6l4 3.1A7.18 7.18 0 0 1 12 4.77Z" />
    </svg>
  );
}

export default function AuthForm({ mode, initialError }: Props) {
  const [error, setError] = useState(
    initialError ? OAUTH_ERROR_MESSAGES[initialError] || "Sign-in failed. Please try again." : ""
  );
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const email = String(fields.get("email") || "").trim();
    const password = String(fields.get("password") || "");
    const displayName = String(fields.get("display_name") || "").trim();

    setError("");
    setNotice(mode === "login" ? "Signing you in…" : "Creating your account…");
    setSubmitting(true);

    try {
      const body: Record<string, string> = { email, password };
      if (mode === "signup" && displayName) body.display_name = displayName;

      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        window.location.assign("/?signed_in=1");
        return;
      }
      setNotice("");
      setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setNotice("");
      setError("Network hiccup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = mode === "login" ? "Welcome back" : "Join Bay Forge";
  const cta = mode === "login" ? "Sign in" : "Create account";

  return (
    <div className="auth-card">
      <h1 className="auth-title">{title}</h1>
      <p className="auth-subtitle">
        {mode === "login"
          ? "Sign in to your Bay Forge account."
          : "Create an account to build, ship, and launch with the Bay Forge community."}
      </p>

      <div className="auth-oauth">
        <a className="button button-secondary auth-oauth-button" href="/api/auth/oauth/github">
          <GitHubIcon />
          Continue with GitHub
        </a>
        <a className="button button-secondary auth-oauth-button" href="/api/auth/oauth/google">
          <GoogleIcon />
          Continue with Google
        </a>
      </div>

      <div className="auth-divider" role="separator">
        <span>or with email</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label className="auth-field">
            <span>Name</span>
            <input name="display_name" type="text" autoComplete="name" placeholder="Ada Lovelace" />
          </label>
        )}
        <label className="auth-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder={mode === "login" ? "Your password" : "At least 8 characters"}
            minLength={8}
            required
          />
        </label>

        {mode === "login" && (
          <p className="auth-forgot">
            <a href="/forgot-password">Forgot password?</a>
          </p>
        )}

        <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
          {cta}
        </button>
      </form>

      {(error || notice) && (
        <p className={`auth-message${error ? " error" : ""}`} role="status">
          {error || notice}
        </p>
      )}

      <p className="auth-switch">
        {mode === "login" ? (
          <>
            New to Bay Forge? <a href="/signup">Create an account</a>
          </>
        ) : (
          <>
            Already have an account? <a href="/login">Sign in</a>
          </>
        )}
      </p>
    </div>
  );
}
