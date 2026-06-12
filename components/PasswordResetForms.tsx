"use client";

import { useState } from "react";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "").trim();
    setSubmitting(true);
    setStatus({ message: "Sending reset link…", error: false });

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok || response.status === 404) {
        // Don't reveal whether the account exists.
        setDone(true);
        setStatus({
          message: "If an account exists for that email, a reset link is on its way.",
          error: false,
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus({ message: data.error || "Could not send the reset link. Try again.", error: true });
      }
    } catch {
      setStatus({ message: "Network hiccup. Please try again.", error: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Reset your password</h1>
      <p className="auth-subtitle">
        Enter the email you signed up with and we&apos;ll send you a reset link.
      </p>

      {!done && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
            Send reset link
          </button>
        </form>
      )}

      {status && (
        <p className={`auth-message${status.error ? " error" : ""}`} role="status">
          {status.message}
        </p>
      )}

      <p className="auth-switch">
        Remembered it? <a href="/login">Back to sign in</a>
      </p>
    </div>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const password = String(fields.get("password") || "");
    const confirm = String(fields.get("confirm") || "");

    if (password !== confirm) {
      setStatus({ message: "Passwords don't match.", error: true });
      return;
    }

    setSubmitting(true);
    setStatus({ message: "Updating your password…", error: false });

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setDone(true);
        setStatus({ message: "Password updated. You can sign in now.", error: false });
      } else {
        setStatus({
          message: data.error || "This reset link is invalid or expired. Request a new one.",
          error: true,
        });
      }
    } catch {
      setStatus({ message: "Network hiccup. Please try again.", error: true });
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="auth-card">
        <h1 className="auth-title">Reset link invalid</h1>
        <p className="auth-subtitle">
          This page needs the link from your reset email. You can request a new one below.
        </p>
        <a className="button button-primary auth-submit" href="/forgot-password">
          Request a new link
        </a>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Choose a new password</h1>
      <p className="auth-subtitle">Set a new password for your Bay Forge account.</p>

      {!done ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>New password</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </label>
          <label className="auth-field">
            <span>Confirm password</span>
            <input name="confirm" type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
            Update password
          </button>
        </form>
      ) : (
        <a className="button button-primary auth-submit" href="/login">
          Go to sign in
        </a>
      )}

      {status && (
        <p className={`auth-message${status.error ? " error" : ""}`} role="status">
          {status.message}
        </p>
      )}
    </div>
  );
}
