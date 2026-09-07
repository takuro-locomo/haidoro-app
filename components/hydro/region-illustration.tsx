import type { Region, RegionId } from "@/lib/hydro/data";

// Cropped views of the attributed anatomy plates already used in the explorer.
// These are location cues for the selector, not injection landmarks.
const views: Record<RegionId, string> = {
  neck: "100 55 600 415",
  scapula: "305 245 395 370",
  lumbar: "290 850 500 700",
  thigh: "210 290 250 555",
  calf: "1160 10 395 1180",
};

export function RegionIllustration({ region }: { region: Region }) {
  return <span className={`region-illustration illustration-${region.id}`} aria-hidden="true">
    <svg viewBox={views[region.id]} focusable="false" preserveAspectRatio="xMidYMid meet">
      <image href={region.asset} width={region.imageSize[0]} height={region.imageSize[1]} />
    </svg>
  </span>;
}
