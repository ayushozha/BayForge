"use client";

import { useCommunityCount } from "./CommunityCountProvider";

type CommunityProjectCountLabelProps = {
  as?: "strong" | "span";
};

export default function CommunityProjectCountLabel({
  as = "span",
}: CommunityProjectCountLabelProps) {
  const { projectsLabel } = useCommunityCount();
  return as === "strong" ? <strong>{projectsLabel}</strong> : <span>{projectsLabel}</span>;
}
