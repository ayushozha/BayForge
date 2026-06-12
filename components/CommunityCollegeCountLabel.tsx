"use client";

import { useCommunityCount } from "./CommunityCountProvider";

type CommunityCollegeCountLabelProps = {
  as?: "strong" | "span";
};

export default function CommunityCollegeCountLabel({
  as = "span",
}: CommunityCollegeCountLabelProps) {
  const { collegesLabel } = useCommunityCount();
  return as === "strong" ? <strong>{collegesLabel}</strong> : <span>{collegesLabel}</span>;
}
