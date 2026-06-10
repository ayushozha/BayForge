"use client";

import { useCommunityCount } from "./CommunityCountProvider";

export default function CommunityCountLabel() {
  const { label } = useCommunityCount();
  return <strong>{label}</strong>;
}
