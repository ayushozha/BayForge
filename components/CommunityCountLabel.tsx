"use client";

import { useCommunityCount } from "./CommunityCountProvider";

type CommunityCountLabelProps = {
  as?: "strong" | "span";
};

export default function CommunityCountLabel({ as = "strong" }: CommunityCountLabelProps) {
  const { label } = useCommunityCount();
  return as === "span" ? <span>{label}</span> : <strong>{label}</strong>;
}
