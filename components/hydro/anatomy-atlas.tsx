"use client";

import { useState } from "react";
import { Maximize2, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Region, Target } from "@/lib/hydro/data";

const anatomyKeys: Record<string, { x: number; y: number; name: string }[]> = {
  neck: [{ x: 280, y: 325, name: "僧帽筋" }, { x: 485, y: 260, name: "肩甲挙筋" }],
  scapula: [{ x: 335, y: 400, name: "僧帽筋" }, { x: 490, y: 455, name: "大菱形筋" }, { x: 448, y: 335, name: "小菱形筋" }],
  lumbar: [{ x: 508, y: 1240, name: "多裂筋" }, { x: 613, y: 1110, name: "最長筋" }],
  thigh: [{ x: 276, y: 683, name: "外側広筋" }],
  calf: [{ x: 1435, y: 240, name: "腓腹筋（切離）" }, { x: 1370, y: 620, name: "ヒラメ筋" }],
};
const captions: Record<string, string> = {
  neck: "背中側から見た図。左は表面の僧帽筋、右は僧帽筋を除いて奥の筋肉を示しています。",
  scapula: "右側は僧帽筋を取り除いた状態。肩甲骨の内側に大菱形筋、その上に小菱形筋があります。",
  lumbar: "背中の深い筋肉の図。多裂筋は背骨寄り、最長筋はその外側にあります。",
  thigh: "右の太ももを前から見た図。表面の筋膜を除いています。大腿筋膜は右の層の図で示します。",
  calf: "ふくらはぎを後ろから見た図。腓腹筋の一部を切り離し、奥のヒラメ筋を見せています。",
};

export function AnatomyAtlas({ region, target }: { region: Region; target: Target }) {
  const [full, setFull] = useState(false);
  const crop = full ? region.fullCrop : region.crop;
  const [, , cropWidth, cropHeight] = crop.split(" ").map(Number);
  const radius = Math.max(cropWidth / 32, cropHeight / 26);
  return <section className="anatomy-panel" aria-labelledby="anatomy-title">
    <div className="panel-heading"><div><span className="eyebrow">01 / 筋肉の位置</span><h3 id="anatomy-title">体のどこにある？</h3></div>
      <Button variant="outline" size="sm" onClick={() => setFull(!full)} aria-pressed={full}>{full ? <ScanLine /> : <Maximize2 />}{full ? "部位を拡大" : "図全体"}</Button></div>
    <div className={`atlas-viewport atlas-${region.id}`}>
      <span className="atlas-location">{region.regionLabel}</span>
      <svg viewBox={crop} role="img" aria-label={`${region.title}の解剖図。${captions[region.id]}`} preserveAspectRatio="xMidYMid meet">
        <image href={region.asset} width={region.imageSize[0]} height={region.imageSize[1]} />
        {anatomyKeys[region.id].map((point, index) => <g key={point.name}>
          <circle cx={point.x} cy={point.y} r={radius} fill="#176457" stroke="white" strokeWidth={radius / 5} />
          <text x={point.x} y={point.y + radius * .36} textAnchor="middle" fontSize={radius * 1.2} fill="white" fontWeight="700">{index + 1}</text>
        </g>)}
      </svg>
    </div>
    <div className="anatomy-key">{anatomyKeys[region.id].map((p, i) => <span key={p.name}><b>{i + 1}</b>{p.name}</span>)}</div>
    <p className="atlas-caption">{captions[region.id]}</p>
    <div className="target-summary"><span>今回見る層</span><strong>{target.name}</strong></div>
    <a className="attribution" href={region.source} target="_blank" rel="noreferrer">{region.attribution} ↗</a>
  </section>;
}
