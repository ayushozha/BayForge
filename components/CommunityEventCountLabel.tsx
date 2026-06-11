"use client";

import { useCommunityCount } from "./CommunityCountProvider";

type CommunityEventCountLabelProps = {
  as?: "strong" | "span";
};

export default function CommunityEventCountLabel({ as = "span" }: CommunityEventCountLabelProps) {
  const { eventsLabel } = useCommunityCount();
  return as === "strong" ? <strong>{eventsLabel}</strong> : <span>{eventsLabel}</span>;
}
