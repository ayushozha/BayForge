"use client";

import { useState } from "react";
import { useCommunityCount } from "./CommunityCountProvider";

type StatusTone = "neutral" | "success" | "error";

type Status = {
  message: string;
  tone: StatusTone;
};

type SubscribeMessages = {
  initial: string;
  submitting?: string;
  invalidEmail?: string;
  success?: string;
  duplicate?: string;
  genericError?: string;
  networkError?: string;
};

function useSubscribe(source: string, messages: SubscribeMessages) {
  const { applyTotal } = useCommunityCount();
  const [status, setStatus] = useState<Status>({ message: messages.initial, tone: "neutral" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const email = emailInput.value.trim();

    if (!emailInput.checkValidity()) {
      setStatus({
        message: messages.invalidEmail ?? "Please enter a valid email address.",
        tone: "error",
      });
      emailInput.focus();
      return;
    }

    setSubmitting(true);
    setStatus({ message: messages.submitting ?? "Adding you to the Bay Forge list.", tone: "neutral" });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          metadata: {
            source,
            page: window.location.pathname,
            referrer: document.referrer || null,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        form.reset();
        applyTotal(typeof data.total === "number" ? data.total : null, 1);
        setStatus({
          message: messages.success ?? "Thank you for signing up. We'll send the next Bay Forge drop soon.",
          tone: "success",
        });
        return;
      }

      if (response.status === 409) {
        setStatus({
          message: messages.duplicate ?? "You're already signed up. We'll keep you posted.",
          tone: "success",
        });
        return;
      }

      setStatus({ message: data.error || messages.genericError || "Signup failed. Please try again.", tone: "error" });
    } catch {
      setStatus({
        message: messages.networkError ?? "Network issue. Please try again in a moment.",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return { status, submitting, handleSubmit };
}

function statusClassName(base: string, tone: StatusTone) {
  return tone === "error" ? `${base} is-error` : base;
}

export function HeroSubscribeForm() {
  const { status, submitting, handleSubmit } = useSubscribe(
    "landing-hero",
    {
      initial: "Be the first to know about hackathons, workshops, and community events.",
    },
  );

  return (
    <>
      <form className="subscribe-form" id="subscribe" noValidate onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="email">
          Email address
        </label>
        <div className="input-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6.5h16v11H4v-11Zm1.7 1.4 6.3 4.8 6.3-4.8H5.7Zm12.8 8.2v-6.6l-6.5 4.9-6.5-4.9v6.6h13Z" />
          </svg>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <button className="button button-primary form-button" type="submit" disabled={submitting}>
          {submitting ? "Joining..." : "Get Updates"}
        </button>
      </form>

      <p className={statusClassName("form-status", status.tone)} role="status" aria-live="polite">
        {status.message}
      </p>
    </>
  );
}

type NewsletterSubscribeFormProps = {
  emailLabel: string;
  placeholder: string;
  buttonLabel: string;
  submittingLabel: string;
  helperText: string;
  source: string;
};

export function NewsletterSubscribeForm({
  emailLabel,
  placeholder,
  buttonLabel,
  submittingLabel,
  helperText,
  source,
}: NewsletterSubscribeFormProps) {
  const { status, submitting, handleSubmit } = useSubscribe(source, {
    initial: helperText,
    submitting: submittingLabel,
  });

  return (
    <form className="mini-subscribe-form" noValidate onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="footerEmail">
        {emailLabel}
      </label>
      <input
        id="footerEmail"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={placeholder}
        required
      />
      <button className="button button-primary" type="submit" disabled={submitting}>
        {submitting ? (
          submittingLabel
        ) : (
          <>
            {buttonLabel}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.3 5.3 20 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.2l-4.3-4.3 1.4-1.4Z" />
            </svg>
          </>
        )}
      </button>
      <p
        className={statusClassName("form-status mini-status", status.tone)}
        role="status"
        aria-live="polite"
      >
        {status.message}
      </p>
    </form>
  );
}
