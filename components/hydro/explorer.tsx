"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, CircleCheck, Droplets, Info, Layers3, MessageCircle, Pause, Play, RotateCcw, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { CLINIC_URL, LINE_URL, REGIONS, getRegion, getTarget, treatmentFrame, type RegionId } from "@/lib/hydro/data";
import { AnatomyAtlas } from "./anatomy-atlas";
import { GlideComparison, LayerDiagram } from "./layer-diagram";
import { RegionIllustration } from "./region-illustration";

const stages = [
  { value: 0, name: "注射前", phase: "before", title: "筋膜の滑りが悪い状態の例", description: "筋肉を包む膜どうしの動きが悪くなると、動いたときのつっぱりや痛みに関わることがあります。" },
  { value: 58, name: "注入中", phase: "injecting", title: "境目へ、注入液が広がる", description: "エコーで針先と周囲を確認しながら、選んだ層へ生理食塩水を注入します。青い部分は液体の広がりです。" },
  { value: 100, name: "変化のイメージ", phase: "after", title: "組織の滑りを助け、動きやすく", description: "注入により組織の間が広がり、滑りの改善や痛みの軽減を目指します。変化の程度・持続には個人差があります。" },
] as const;

export function HydroExplorer() {
  const [regionId, setRegionId] = useState<RegionId>("neck");
  const region = getRegion(regionId);
  const [targetId, setTargetId] = useState(region.targets[0].id);
  const target = getTarget(region, targetId);
  const [view, setView] = useState<"anatomy" | "layers">("anatomy");
  const resultRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const animation = useRef<number | null>(null);
  const frame = treatmentFrame(progress);
  const stage = stages.find(item => item.phase === frame.phase) ?? stages[0];

  useEffect(() => () => { if (animation.current !== null) cancelAnimationFrame(animation.current); }, []);
  function stop() {
    if (animation.current !== null) cancelAnimationFrame(animation.current);
    animation.current = null; setPlaying(false);
  }
  function selectRegion(value: string) {
    stop(); const next = getRegion(value);
    setRegionId(next.id); setTargetId(next.targets[0].id); setProgress(0); setView("anatomy");
  }
  function showResult() {
    if (window.matchMedia("(max-width: 800px)").matches) {
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start" }));
    }
  }
  function changeView(next: "anatomy" | "layers") { stop(); setView(next); }
  function selectTarget(value: string) { stop(); setTargetId(value); setProgress(0); }
  function seek(value: number) { stop(); setProgress(value); }
  function play() {
    if (playing) { stop(); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setProgress(100); return; }
    const initial = progress >= 100 ? 0 : progress;
    setProgress(initial); setPlaying(true);
    let start: number | null = null;
    const tick = (time: number) => {
      if (start === null) start = time;
      const value = Math.min(100, initial + (time-start)/58);
      setProgress(value);
      if (value < 100) animation.current = requestAnimationFrame(tick);
      else { animation.current = null; setPlaying(false); }
    };
    animation.current = requestAnimationFrame(tick);
  }

  return <>
    <a className="skip-link" href="#explore">症状の選択へ</a>
    <header className="site-header"><div className="header-inner">
      <a href={CLINIC_URL} className="clinic-brand" target="_blank" rel="noreferrer"><span className="brand-symbol" aria-hidden="true">上</span><span><small>長野市 三輪</small><strong>上野医院</strong></span></a>
      <span className="header-note"><Stethoscope size={17} aria-hidden="true" />整形外科専門医による診療</span>
      <a href={LINE_URL} target="_blank" rel="noreferrer" className="header-consult"><MessageCircle size={17} aria-hidden="true" />LINEで予約</a>
    </div></header>

    <main>
      <section className="intro content-width">
        <div><p className="intro-kicker"><span />筋肉の「間」に、アプローチ。</p><h1><span>整形外科専門医が打つ</span>ハイドロリリース</h1><p className="intro-copy">そのつっぱり、どの層から？<br className="mobile-break" /> 症状から、注射の仕組みを見てみましょう。</p></div>
        <div className="intro-guide"><div><Stethoscope /><span>エコーで確認</span></div><ArrowRight /><div><Droplets /><span>筋膜の間に注入</span></div><ArrowRight /><div><Layers3 /><span>滑りの改善を目指す</span></div></div>
      </section>

      <section id="explore" className="content-width explorer-section" aria-labelledby="symptom-title">
        <div className="section-heading"><h2 id="symptom-title">気になるところは、どこですか？</h2><span>イラストを押して選択</span></div>
        <Tabs value={regionId} onValueChange={selectRegion} className="region-tabs">
          <TabsList aria-label="気になる部位" className="symptom-tabs">{REGIONS.map(r => <TabsTrigger key={r.id} value={r.id} className="symptom-tab" onClick={showResult}><RegionIllustration region={r} /><span className="symptom-tab-copy"><strong>{r.title}</strong><small>{r.symptom}</small></span><span className="symptom-tab-action" aria-hidden="true">{r.id === regionId ? <><CircleCheck />選択中</> : <>この部位を見る<ArrowRight /></>}</span></TabsTrigger>)}</TabsList>
          <TabsContent value={regionId} className="region-content">
            <div id="selected-region" ref={resultRef} className="selected-symptom"><div><div className="result-heading"><span className="region-chip">{region.regionLabel}</span><a href="#explore" className="reselect-link">部位を選び直す ↑</a></div><h2>{region.symptom}</h2><p>{region.description}</p></div><p className="diagnosis-note"><Info size={17} aria-hidden="true" />症状だけで癒着や注射部位は決まりません。<br />以下は、診察で検討する層の説明例です。</p></div>

            <div className="mobile-view-switch" role="group" aria-label="図の表示切り替え">
              <Button variant="ghost" aria-pressed={view === "anatomy"} aria-controls="anatomy-view" onClick={() => changeView("anatomy")}><span>1</span>筋肉の位置</Button>
              <Button variant="ghost" aria-pressed={view === "layers"} aria-controls="layer-view" onClick={() => changeView("layers")}><span>2</span>注射の変化</Button>
            </div>
            <div className="explorer-grid" data-view={view}>
              <div id="anatomy-view" className="anatomy-view"><AnatomyAtlas key={regionId} region={region} target={target} /><Button className="next-view-button" onClick={() => { changeView("layers"); showResult(); }}>次へ：注射の変化を見る<ArrowRight /></Button></div>
              <section id="layer-view" className="layer-panel" aria-labelledby="layer-title">
                <div className="panel-heading"><div><span className="eyebrow">02 / 注射する層と変化</span><h3 id="layer-title">筋肉の「間」を見てみる</h3></div><span className="diagram-tag">断面のイメージ</span></div>
                {region.targets.length > 1 && <fieldset className="target-picker"><legend><Layers3 size={17} aria-hidden="true" />注射する層を選ぶ</legend><RadioGroup value={target.id} onValueChange={selectTarget} className="target-options" aria-label="詳しく見たい筋肉の層">{region.targets.map(t => <label key={t.id} htmlFor={`target-${t.id}`} className={target.id === t.id ? "selected" : ""}><RadioGroupItem id={`target-${t.id}`} value={t.id} />{t.name}</label>)}</RadioGroup></fieldset>}
                <p className="layer-intro">{target.explanation}</p>
                <div className={`diagram-surface phase-${frame.phase}`}><div className="diagram-legend"><span><i className="muscle-swatch" />筋肉</span><span><i className="fascia-swatch" />筋膜</span><span><i className="fluid-swatch" />注入液</span></div><LayerDiagram target={target} progress={progress} /><div className="tissue-key" aria-label="図に示した組織"><span>{target.kind === "lumbar" ? "背骨寄り" : "浅い側"}：<strong>{target.upper}</strong></span><span>{target.kind === "lumbar" ? "外側" : "深い側"}：<strong>{target.lower}</strong></span></div><div className="plane-label"><Droplets size={17} aria-hidden="true" /><span>{progress === 0 ? "注射を検討する場所" : "液体が広がる場所"}：<strong>{target.name}</strong></span></div></div>
                <div className="animation-controls"><Button size="lg" className="play-button" onClick={play}>{playing ? <Pause /> : progress === 100 ? <RotateCcw /> : <Play />}{playing ? "一時停止" : progress === 100 ? "もう一度見る" : progress > 0 ? "続きを見る" : "注射の変化を見る"}</Button><div className="stage-controls" aria-label="表示する段階">{stages.map((s,i) => <Button key={s.phase} variant="ghost" onClick={() => seek(s.value)} aria-pressed={frame.phase === s.phase} className={frame.phase === s.phase ? "active-stage" : ""}><span>{i+1}</span>{s.name}</Button>)}</div></div>
                <Slider value={[progress]} onValueChange={value => seek(value[0] ?? 0)} min={0} max={100} step={1} aria-label="注入のイメージを動かす" aria-valuetext={stage.name} className="treatment-slider" />
                <div className="stage-explanation" aria-live="polite" aria-atomic="true"><strong>{stage.title}</strong><p>{stage.description}</p></div>
                <details className="layer-list"><summary>皮膚から奥までの順番を見る<ArrowDown size={15} aria-hidden="true" /></summary><ol>{target.layers.map((l,i) => <li key={l}><span>{i+1}</span>{l}</li>)}</ol></details>
              </section>
            </div>
            <section className="understand-section" aria-labelledby="change-title"><div className="change-description"><span className="eyebrow">03 / 目指す変化</span><h3 id="change-title">つっぱりを和らげ、<br />いつもの動きをしやすく。</h3><p>{region.benefit}</p><p className="small-note">図は仕組みを伝えるイメージです。実際の癒着や効果を予測するものではなく、青い液体がそのまま残り続けるわけではありません。</p></div><div className="comparison-block"><GlideComparison /><p>筋膜の滑りの変化に注目した模式図。改善の程度・持続には個人差があります。</p></div></section>
            <div className="care-grid"><section className="care-card"><h3><Stethoscope size={21} aria-hidden="true" />まず、痛みの原因を見きわめます</h3><p>{region.differential}</p><p>診察とエコーで状態を確認し、注射が合うか、ほかの治療がよいかを相談します。</p></section><section className="care-card risk-card"><h3><Info size={21} aria-hidden="true" />副作用・リスクについて</h3><p>注射時の痛み、内出血、一時的な痛みの増加、気分不良など。まれに感染や神経・血管の損傷、部位によっては気胸のリスクがあります。</p><p>{region.caution}</p></section></div>
            <section id="consultation" className="consultation" aria-labelledby="consultation-title">
              <div className="consultation-main"><span className="eyebrow">上野医院でのハイドロリリース</span><h2 id="consultation-title">まずは、気になる痛みを<br />ご相談ください。</h2><p>整形外科専門医 上野琢郎が、エコーを用いて診療します。治療の適応や回数は、症状に合わせてご案内します。</p><div className="booking-note"><CircleCheck size={17} aria-hidden="true" />金曜・土曜／完全予約制</div><Button asChild size="lg" className="consult-button"><a href={LINE_URL} target="_blank" rel="noreferrer"><MessageCircle />LINEで予約する<ArrowRight /></a></Button><p className="line-hint">「ハイドロリリース希望」と、気になる部位をお伝えください。</p></div>
              <div className="fee-card"><div className="fee-heading"><span>選択中：{region.title}</span><span>自由診療</span></div><p className="fee-label">ハイドロリリース 1部位</p><p className="fee-amount">5,500<small>円（税込）</small></p><p className="fee-details">診察・エコー・薬剤・手技料を含みます。<br />大腿・下腿も、1部位あたり同じ料金です。</p><div className="fee-secondary"><span>2部位（肩＋腰）</span><strong>8,800<small>円（税込）</small></strong></div><p className="small-note">1部位の範囲や複数部位の組み合わせは、予約・診察時にご確認ください。</p><a href={CLINIC_URL} target="_blank" rel="noreferrer" className="text-link">医院の詳しい案内を見る ↗</a></div>
            </section>
          </TabsContent>
        </Tabs>
      </section>
      <section className="source-section content-width"><details><summary>このアプリの説明・出典について</summary><div><p>患者さんと医師が治療を相談するための教材です。症状の選択は診断ではありません。研究は部位や方法によって異なり、図に示したすべての層で同じ効果が実証されているわけではありません。</p><p>上部僧帽筋周囲への生理食塩水注入の比較試験、急性腰痛への多裂筋周辺の注入に関する観察研究などを参考にしています。大腿・下腿については、解剖学的な位置関係と診察時の検討例を示しています。</p><ul><li><a href={CLINIC_URL} target="_blank" rel="noreferrer">上野医院 ハイドロリリースの案内</a>（2026年9月7日確認）</li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8211995/" target="_blank" rel="noreferrer">Tantanatip et al., 2021：上部僧帽筋周囲の比較試験</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/32840876/" target="_blank" rel="noreferrer">Kanamoto et al., 2021：急性腰痛・多裂筋の観察研究</a></li><li><a href="/anatomy/ATTRIBUTION.md" target="_blank" rel="noreferrer">解剖図の出典・ライセンス一覧</a>（Gray&apos;s Anatomy / OpenStax、表示範囲の切り取り・番号を追加）</li></ul><p>急な片脚の腫れ・熱感、進行する手足の脱力、排尿・排便の異常、発熱を伴う強い痛みなどは、このアプリで判断せず速やかに医療機関へご相談ください。</p></div></details></section>
    </main>
    <nav className="mobile-booking-bar" aria-label="スマートフォンのメニュー"><a href="#explore" className="mobile-reselect">部位を選ぶ ↑</a><a href={LINE_URL} target="_blank" rel="noreferrer" className="mobile-line"><MessageCircle aria-hidden="true" /><span>LINEで予約<small>1部位 5,500円（税込）</small></span></a></nav>
    <footer className="site-footer content-width"><div><strong>上野医院</strong><span>長野市 三輪｜整形外科専門医が打つハイドロリリース</span></div><a href={CLINIC_URL} target="_blank" rel="noreferrer">医院ホームページ ↗</a></footer>
  </>;
}
