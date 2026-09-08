import type { Region, RegionId } from "@/lib/hydro/data";

// General symptom illustrations; the anatomy atlas is reserved for the explanation.
const illustrations: Record<RegionId, string> = {
  neck: "neck-shoulder",
  scapula: "scapula",
  lumbar: "lumbar",
  thigh: "thigh",
  calf: "calf",
};

export function RegionIllustration({ region }: { region: Region }) {
  return <span className={`region-illustration illustration-${region.id}`} aria-hidden="true">
    <img src={`/symptoms/${illustrations[region.id]}.webp`} alt="" width={480} height={480} decoding="async" />
  </span>;
}
