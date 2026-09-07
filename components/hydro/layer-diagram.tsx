"use client";

import { useId } from "react";
import { treatmentFrame, type Target } from "@/lib/hydro/data";

/** Explanatory cross-sections, deliberately not an ultrasound or a needle guide. */
export function LayerDiagram({ target, progress }: { target: Target; progress: number }) {
  const uid = useId().replace(/:/g, "");
  const { spread, needle, glide } = treatmentFrame(progress);
  const separate = spread * 30;
  const sideBySide = target.kind === "lumbar";
  const membrane = target.kind === "fascia";
  const bone = target.kind === "bone";
  const boundary = membrane ? 164 : 207;
  const labelUpper = target.upper.replace(/（.*）/, "");
  const labelLower = target.lower.replace(/（.*）/, "");
  const upperPath = membrane
    ? "M64 130 Q210 116 354 131 T644 130 L644 153 Q496 168 354 153 T64 154Z"
    : "M64 127 Q204 111 354 129 T644 125 L644 190 Q498 209 354 190 T64 193Z";
  const lowerPath = `M64 ${boundary + 9 + separate} Q206 ${boundary - 2 + separate} 354 ${boundary + 10 + separate} T644 ${boundary + 10 + separate} L644 335 Q354 359 64 332Z`;
  const surfaceText = membrane ? "筋膜" : "筋肉";

  return <svg className="layer-svg" viewBox="0 0 720 410" role="img" aria-label={`${target.name}の層の模式図。${progress === 0 ? "筋膜の滑りが悪い状態の例" : progress < 85 ? "注入液が筋膜の境目に広がる様子" : "滑りの改善を目指すイメージ"}`}>
    <defs>
      <linearGradient id={`${uid}-muscle`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e8a48f" /><stop offset=".45" stopColor="#d88573" /><stop offset="1" stopColor="#af5c51" /></linearGradient>
      <linearGradient id={`${uid}-fluid`}><stop stopColor="#b8edf4" /><stop offset=".5" stopColor="#66c5df" /><stop offset="1" stopColor="#b9e8ee" /></linearGradient>
      <pattern id={`${uid}-fibers`} width="24" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)"><path d="M0 3H24 M0 8H24 M0 13H24" fill="none" stroke="#fce5d6" strokeWidth="1.2" opacity=".48" /></pattern>
      <pattern id={`${uid}-fat`} width="40" height="25" patternUnits="userSpaceOnUse"><rect width="40" height="25" fill="#eddbb0" /><ellipse cx="11" cy="11" rx="15" ry="10" fill="#f5e8c7" stroke="#dbc591" strokeWidth="1" /><ellipse cx="35" cy="21" rx="13" ry="9" fill="#f8ebcb" stroke="#dbc591" strokeWidth="1" /></pattern>
      <pattern id={`${uid}-bone`} width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#e6e3d5" /><circle cx="4" cy="4" r="1.5" fill="#b9b6a5" /><circle cx="11" cy="11" r="1" fill="#c2bead" /></pattern>
      <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L8 5L1 9" fill="none" stroke="#176457" strokeWidth="2" /></marker>
    </defs>
    <text x="64" y="29" className="diagram-direction">皮膚側（浅い）</text>
    <path d="M64 64 Q210 52 354 65 T644 61 L644 84 Q490 95 354 82 T64 84Z" fill="#eec8b6" stroke="#c6947f" />
    <path d="M64 85 Q214 72 354 84 T644 83 L644 117 Q486 132 354 116 T64 119Z" fill={`url(#${uid}-fat)`} />
    <text x="565" y="106" textAnchor="middle" className="tissue-caption">皮下組織</text>
    {sideBySide ? <>
      <path d="M64 130Q354 116 644 129" fill="none" stroke="#c7d0c8" strokeWidth="10" />
      <text x="570" y="153" textAnchor="middle" className="tissue-caption">胸腰筋膜</text>
      <g transform={`translate(${-spread * 10},0)`}>
        <path d="M80 158 Q194 132 320 165 Q345 229 320 307 Q187 340 80 308Z" fill={`url(#${uid}-muscle)`} />
        <path d="M80 158 Q194 132 320 165 Q345 229 320 307 Q187 340 80 308Z" fill={`url(#${uid}-fibers)`} />
        <Label x={198} y={234} text="多裂筋" sub="背骨に近い側" />
      </g>
      <g transform={`translate(${spread * 10},0)`}>
        <path d="M361 165 Q481 137 630 169 L628 308 Q490 341 361 311 Q340 238 361 165Z" fill={`url(#${uid}-muscle)`} />
        <path d="M361 165 Q481 137 630 169 L628 308 Q490 341 361 311 Q340 238 361 165Z" fill={`url(#${uid}-fibers)`} />
        <Label x={492} y={234} text="最長筋" sub="外側" />
      </g>
      <path d="M340 169Q327 233 340 311" fill="none" stroke="#edf0e8" strokeWidth="8" />
      <path d="M341 180Q337 236 342 306" fill="none" stroke={`url(#${uid}-fluid)`} strokeWidth={7 + spread * 26} opacity={spread} strokeLinecap="round" pathLength={100} strokeDasharray={`${spread * 100} 100`} />
      {[182,211,243,272,299].map((y, i) => <path key={y} d={`M${323-i%2*2} ${y}l34 9`} stroke="#a77860" strokeWidth="3" opacity={(1-spread)*.8} />)}
      <path d="M95 350 Q178 320 304 346 L319 371H95Z" fill={`url(#${uid}-bone)`} stroke="#aaa998" strokeWidth="2" />
      <text x="198" y="367" textAnchor="middle" className="tissue-caption">椎弓の表面側</text>
      <Needle x={342} y={193} opacity={needle} />
      {glide > 0 && <path d="M147 287H247 M540 287H444" stroke="#176457" strokeWidth="3" markerEnd={`url(#${uid}-arrow)`} opacity={glide} />}
    </> : <>
      <path d={upperPath} fill={membrane ? "#e6ebe4" : `url(#${uid}-muscle)`} stroke={membrane ? "#b7c8c2" : "#bb7566"} strokeWidth="2" />
      {!membrane && <path d={upperPath} fill={`url(#${uid}-fibers)`} />}
      {membrane && [134,140,147].map(y => <path key={y} d={`M66 ${y} Q207 ${y-8} 352 ${y+1} T642 ${y}`} fill="none" stroke="white" opacity=".9" />)}
      <Label x={450} y={membrane ? 142 : 166} text={labelUpper} sub={surfaceText} />
      <path d={lowerPath} fill={bone ? `url(#${uid}-bone)` : `url(#${uid}-muscle)`} stroke={bone ? "#a5a493" : "#bb7566"} strokeWidth={bone ? 4 : 2} />
      {!bone && <path d={lowerPath} fill={`url(#${uid}-fibers)`} />}
      <path d={`M66 ${boundary+6+separate} Q210 ${boundary-5+separate} 354 ${boundary+6+separate} T642 ${boundary+7+separate}`} fill="none" stroke="#f3f1e7" strokeWidth="7" />
      <Label x={452} y={bone ? 291 : 284 + separate / 3} text={labelLower} sub={bone ? "骨の外側" : "深い側の筋肉"} />
      {[120,195,285,370,460,555,607].map((x,i) => <path key={x} d={`M${x} ${boundary-8}l${i%2?13:-10} ${21+separate}`} stroke="#a87861" strokeWidth="3" opacity={(1-spread)*.8} />)}
      <path d={`M85 ${boundary} Q210 ${boundary-12} 354 ${boundary} T630 ${boundary+2} L630 ${boundary+6+separate} Q488 ${boundary+19+separate} 354 ${boundary+6+separate} T85 ${boundary+5+separate}Z`} fill={`url(#${uid}-fluid)`} opacity={spread * .88} transform={`translate(80,0) scale(${spread},1) translate(-80,0)`} />
      <path d={`M88 ${boundary+5+separate/2} Q267 ${boundary-7+separate/2} 445 ${boundary+6+separate/2}`} stroke="#2a9ebb" fill="none" strokeWidth="2" strokeDasharray="7 7" opacity={spread} />
      <Needle x={227} y={boundary-2} opacity={needle} />
      {glide > 0 && <g stroke="#176457" strokeWidth="3.5" opacity={glide} markerEnd={`url(#${uid}-arrow)`}><path d={`M278 ${boundary-30}H366`} /><path d={`M367 ${boundary+48+separate}H280`} /></g>}
    </>}
    <text x="64" y="395" className="diagram-direction">体の奥側（深い）</text>
    <text x="644" y="395" textAnchor="end" className="diagram-direction">位置・厚みを簡略化した模式図</text>
  </svg>;
}

function Label({ x, y, text, sub }: { x: number; y: number; text: string; sub: string }) {
  const width = Math.max(100, text.length * 20 + 28);
  return <g><rect x={x-width/2} y={y-21} width={width} height="47" rx="7" fill="white" fillOpacity=".88" /><text x={x} y={y} textAnchor="middle" fill="#3d4742" fontSize="20" fontWeight="700">{text}</text><text x={x} y={y+18} textAnchor="middle" fill="#67756e" fontSize="12">{sub}</text></g>;
}
function Needle({ x, y, opacity }: { x: number; y: number; opacity: number }) {
  if (opacity <= 0) return null;
  return <g opacity={opacity}>
    <path d={`M36 24L${x} ${y}`} stroke="#fcffff" strokeWidth="7" />
    <path d={`M36 24L${x} ${y}`} stroke="#72898e" strokeWidth="3" />
    <path d="M19 13L48 38" stroke="#367f90" strokeWidth="12" strokeLinecap="round" />
    <circle cx={x} cy={y} r="4" fill="#229ebf" />
  </g>;
}

export function GlideComparison() {
  const id = useId().replace(/:/g, "");
  return <div className="comparison-pair">
    {[false,true].map(after => <figure key={String(after)}>
      <figcaption><span className={`comparison-dot ${after ? "after" : ""}`} />{after ? "滑りの改善を目指す" : "滑りにくい状態の例"}</figcaption>
      <svg viewBox="0 0 320 130" role="img" aria-label={after ? "液体が境目に広がり、組織が滑りやすくなるイメージ" : "組織の間で動きが制限されているイメージ"}>
        <defs><pattern id={`${id}-${after}`} width="18" height="10" patternUnits="userSpaceOnUse"><rect width="18" height="10" fill="#d58f7b" /><path d="M0 4H18M0 8H18" stroke="#f4c5ac" /></pattern></defs>
        <path d="M8 12Q88 0 160 13T312 13V48Q235 61 159 49T8 49Z" fill={`url(#${id}-${after})`} />
        <path d={`M8 ${after?84:63}Q87 ${after?72:52} 160 ${after?85:64}T312 ${after?85:64}V122H8Z`} fill={`url(#${id}-${after})`} />
        {after ? <><path d="M8 55Q84 44 160 56T312 56V78Q236 91 160 79T8 78Z" fill="#a7dfeb" /><path d="M25 31H95L84 23M95 31L84 39M292 106H222L233 98M222 106L233 114" fill="none" stroke="#176457" strokeWidth="4" /></> : [55,104,164,220,276].map(x => <path key={x} d={`M${x} 47l13 21m-5-23l-15 22`} stroke="#a97659" strokeWidth="3" />)}
      </svg>
    </figure>)}
  </div>;
}
