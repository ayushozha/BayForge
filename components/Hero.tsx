"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import scene1 from "@/public/assets/1.png";
import scene2 from "@/public/assets/2.png";
import scene3 from "@/public/assets/3.png";
import CommunityCollegeCountLabel from "./CommunityCollegeCountLabel";
import CommunityCountLabel from "./CommunityCountLabel";
import { HeroSubscribeForm } from "./SubscribeForm";

const SCENES = [
  { image: scene1, label: "Hackathon table scene" },
  { image: scene2, label: "Golden Gate builder meetup" },
  { image: scene3, label: "AI workshop scene" },
];

const SWITCH_FADE_MS = 140;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const switchTimer = useRef<number | null>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function selectScene(index: number) {
    if (index === activeIndex) {
      return;
    }

    setActiveIndex(index);
    setIsSwitching(true);

    if (switchTimer.current !== null) {
      window.clearTimeout(switchTimer.current);
    }

    switchTimer.current = window.setTimeout(() => {
      setDisplayedIndex(index);
      setIsSwitching(false);
    }, SWITCH_FADE_MS);
  }

  function openPreview() {
    setPreviewOpen(true);
  }

  function closePreview() {
    setPreviewOpen(false);
    playButtonRef.current?.focus();
  }

  useEffect(() => {
    return () => {
      if (switchTimer.current !== null) {
        window.clearTimeout(switchTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!previewOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [previewOpen]);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className={isSwitching ? "hero-bg is-switching" : "hero-bg"} aria-hidden="true">
          <Image
            src={SCENES[displayedIndex].image}
            alt=""
            fill
            sizes="100vw"
            priority
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Bay Area / Community / Impact</p>
            <h1 id="hero-title">
              <span className="title-main">Build the future.</span>
              <span className="title-accent">Together.</span>
            </h1>
            <p className="hero-lede">
              Bay Forge brings builders, designers, and dreamers together to create, learn, and
              launch at the heart of the Bay Area.
            </p>

            <HeroSubscribeForm />

            <p className="community-counter">
              <CommunityCountLabel /> builders in the community. Be one of them.
            </p>
          </div>

          <div className="hero-media" aria-label="Bay Forge scenes">
            <button
              ref={playButtonRef}
              className="play-button"
              type="button"
              aria-label="Preview Bay Forge scenes"
              onClick={openPreview}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.6v12.8L18.2 12 8 5.6Z" />
              </svg>
            </button>

            <div className="scene-rail" aria-label="Choose hero scene">
              {SCENES.map((scene, index) => (
                <button
                  key={scene.label}
                  className={index === activeIndex ? "scene-thumb is-active" : "scene-thumb"}
                  type="button"
                  aria-label={scene.label}
                  onClick={() => selectScene(index)}
                >
                  <Image src={scene.image} alt="" width={208} height={136} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <dl className="stats-panel" aria-label="Bay Forge community stats">
          <div className="stat">
            <dt>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16 11a4 4 0 1 0-3.2-6.4A5 5 0 0 1 14 8a5 5 0 0 1-1.2 3.2A4 4 0 0 0 16 11Zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.8-6 4v2h12v-2c0-2.2-2.7-4-6-4Zm8 0c-.8 0-1.6.1-2.3.4 1.4.9 2.3 2.1 2.3 3.6v2h6v-2c0-2.2-2.7-4-6-4Z" />
              </svg>
              <CommunityCountLabel as="span" />
            </dt>
            <dd>Builders</dd>
          </div>
          <div className="stat">
            <dt>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z" />
              </svg>
              <span>48</span>
            </dt>
            <dd>Events Hosted</dd>
          </div>
          <div className="stat">
            <dt>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m8.7 7.2-5 4.8 5 4.8 1.4-1.5L6.7 12l3.4-3.3-1.4-1.5Zm6.6 0-1.4 1.5 3.4 3.3-3.4 3.3 1.4 1.5 5-4.8-5-4.8ZM12.7 6l-3.4 12h2.1L14.8 6h-2.1Z" />
              </svg>
              <span>2,500+</span>
            </dt>
            <dd>Projects Built</dd>
          </div>
          <div className="stat">
            <dt>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3.1a15 15 0 0 0-1.1-5 8 8 0 0 1 4.2 5ZM12 4.1c.8 1.2 1.5 3.5 1.7 6.9h-3.4c.2-3.4.9-5.7 1.7-6.9ZM4.3 13h3.9c.1 1.9.4 3.6.9 5a8 8 0 0 1-4.8-5Zm3.9-2H4.3A8 8 0 0 1 9.1 6c-.5 1.4-.8 3.1-.9 5Zm3.8 8.9c-.8-1.2-1.5-3.5-1.7-6.9h3.4c-.2 3.4-.9 5.7-1.7 6.9Zm2.9-1.9c.5-1.4.8-3.1.9-5h3.1a8 8 0 0 1-4 5Z" />
              </svg>
              <CommunityCollegeCountLabel />
            </dt>
            <dd>Colleges Represented</dd>
          </div>
        </dl>
      </section>

      <div className="modal" hidden={!previewOpen}>
        <button
          ref={closeButtonRef}
          className="modal-close"
          type="button"
          aria-label="Close preview"
          onClick={closePreview}
        >
          Close
        </button>
        <div className="modal-frame" role="dialog" aria-modal="true" aria-label="Bay Forge preview">
          <Image
            src={scene3}
            alt="Bay Forge workshop with builders learning about AI agents"
            sizes="(max-width: 1120px) 100vw, 1120px"
          />
        </div>
      </div>
    </>
  );
}
