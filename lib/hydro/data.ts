export type RegionId = "neck" | "scapula" | "lumbar" | "thigh" | "calf";
export type ViewMode = "atlas" | "layers";
export type TargetKind = "muscle" | "fascia" | "lumbar" | "bone";
export interface Target {
  id: string; name: string; upper: string; lower: string; kind: TargetKind;
  explanation: string; layers: string[];
}
export interface Region {
  id: RegionId; title: string; symptom: string; description: string;
  regionLabel: string; benefit: string; differential: string; caution: string;
  targets: [Target, ...Target[]];
  asset: string; imageSize: [number, number]; crop: string; fullCrop: string;
  attribution: string; source: string;
}
export const CLINIC_URL = "https://ueno-iin-biyou-miwa.com/hydrorelease/";
export const LINE_URL = "https://lin.ee/zNl8pfQ";
export const REGIONS: [Region, ...Region[]] = [
  {
    id: "neck", title: "首・肩", symptom: "首の痛み・肩の重さ", regionLabel: "頚部・肩上部",
    description: "首の付け根から肩にかけて、重い・張る・振り向きにくい。",
    benefit: "首や肩を動かしたときのつっぱりが和らぎ、動かしやすくなることを目指します。",
    differential: "頚椎や神経、肩関節などが原因のこともあります。筋膜の動きが関係しているかを診察で確認します。",
    caution: "血管や神経などの位置をエコーで確認し、注射する層を判断します。",
    targets: [{ id: "trapezius-levator", name: "僧帽筋と肩甲挙筋の間", upper: "僧帽筋", lower: "肩甲挙筋", kind: "muscle", explanation: "肩を覆う僧帽筋と、その下で肩甲骨を引き上げる肩甲挙筋。その境目の滑りが悪い場合、筋膜の間への注射を検討します。", layers: ["皮膚・皮下組織", "僧帽筋", "注射を検討する筋膜の間", "肩甲挙筋"] }],
    asset: "/anatomy/gray409-shoulder.png", imageSize: [733,1156], crop: "50 15 660 560", fullCrop: "0 0 733 1156", attribution: "Gray's Anatomy, 1918 · Public domain", source: "https://commons.wikimedia.org/wiki/File:Gray409.png",
  },
  {
    id: "scapula", title: "肩甲骨まわり", symptom: "肩甲骨の内側がこる", regionLabel: "肩甲骨内側・背中",
    description: "肩甲骨の内側が重い・背中が張る・腕を動かすとつっぱる。",
    benefit: "肩甲骨まわりのつっぱりを和らげ、腕や背中を動かしやすくすることを目指します。",
    differential: "首からの関連痛や、肩関節・神経の問題なども確認します。押すと痛い場所だけで原因を決めません。",
    caution: "この部位の奥には肋骨や胸膜があります。気胸などのリスクに配慮し、エコーで周囲の組織を確認します。",
    targets: [
      { id: "rhomboid-major", name: "僧帽筋と大菱形筋の間", upper: "僧帽筋", lower: "大菱形筋", kind: "muscle", explanation: "肩甲骨を背骨のほうへ引く大菱形筋は、僧帽筋の下にあります。筋膜の境目や周囲の動きを確認し、注射を検討します。", layers: ["皮膚・皮下組織", "僧帽筋", "注射を検討する筋膜の間", "大菱形筋", "肋骨・胸膜側（さらに深部）"] },
      { id: "rhomboid-minor", name: "小菱形筋の周囲", upper: "僧帽筋", lower: "小菱形筋", kind: "muscle", explanation: "小菱形筋は大菱形筋より上にあり、肩甲骨の内側上部を支えます。つっぱる場所と筋膜の動きを確かめ、周囲への注射を検討します。", layers: ["皮膚・皮下組織", "僧帽筋", "注射を検討する筋膜の間", "小菱形筋", "肋骨・胸膜側（さらに深部）"] },
    ],
    asset: "/anatomy/gray409-shoulder.png", imageSize: [733,1156], crop: "240 130 470 560", fullCrop: "0 0 733 1156", attribution: "Gray's Anatomy, 1918 · Public domain", source: "https://commons.wikimedia.org/wiki/File:Gray409.png",
  },
  {
    id: "lumbar", title: "腰", symptom: "腰の痛み・重だるさ", regionLabel: "腰部・背骨の両側",
    description: "腰の奥が重い・起き上がるとつっぱる・押すと痛む場所がある。",
    benefit: "筋肉・筋膜に由来する痛みを和らげ、立つ・かがむなどの動きをしやすくすることを目指します。",
    differential: "椎間板、関節、骨折、神経などが原因の腰痛もあります。症状と診察に応じて検査や別の治療を選びます。",
    caution: "図の深い層は椎弓の表面側です。骨の中や脊柱管の中へ注射する図ではありません。",
    targets: [
      { id: "multifidus-longissimus", name: "多裂筋と最長筋の周囲", upper: "多裂筋（内側）", lower: "最長筋（外側）", kind: "lumbar", explanation: "背骨に近い多裂筋と、その外側の最長筋。横に並ぶ筋肉の境目や周囲の膜を確認し、滑りにくい部分への注射を検討します。", layers: ["皮膚・皮下組織", "胸腰筋膜", "多裂筋（内側）／最長筋（外側）", "筋肉の境目・周囲", "椎弓の表面側"] },
      { id: "thoracolumbar", name: "胸腰筋膜と筋肉の間", upper: "胸腰筋膜", lower: "多裂筋・最長筋", kind: "fascia", explanation: "腰の筋肉の表面を包む胸腰筋膜。その深側で、筋肉と膜の間の動きを確認します。", layers: ["皮膚・皮下組織", "胸腰筋膜", "注射を検討する膜の深側", "多裂筋・最長筋"] },
      { id: "lamina", name: "多裂筋の深部・椎弓表面側", upper: "多裂筋", lower: "椎弓の表面側", kind: "bone", explanation: "多裂筋の深い付着部と、背骨の後ろ側にある椎弓の表面との位置関係です。診察で必要性を判断する、深い層の説明例です。", layers: ["皮膚・皮下組織", "胸腰筋膜", "多裂筋", "深い付着部の周辺", "椎弓（骨）の表面"] },
    ],
    asset: "/anatomy/openstax-back.png", imageSize: [1620,1600], crop: "270 750 580 825", fullCrop: "0 0 1620 1600", attribution: "OpenStax · CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:1117_Muscles_of_the_Back.png",
  },
  {
    id: "thigh", title: "太もも", symptom: "太もも外側の張り・痛み", regionLabel: "大腿外側",
    description: "歩くと太ももの外側がつっぱる・手術やけがのあとに張りが残る。",
    benefit: "膜と筋肉の動きに問題がある場合に、つっぱりや動かしにくさの軽減を目指します。",
    differential: "股関節や腰からの痛み、筋損傷などを確認します。すべての太ももの痛みが筋膜の癒着によるものではありません。",
    caution: "術後の癒着などを含めて個別に評価します。首・肩の治療結果を、そのまま大腿にも当てはめることはできません。",
    targets: [{ id: "iliotibial-vastus", name: "大腿筋膜と外側広筋の間", upper: "大腿筋膜・腸脛靱帯", lower: "外側広筋", kind: "fascia", explanation: "太ももを包む大腿筋膜は、外側では厚い腸脛靱帯になります。その下の外側広筋との境目で、滑りの状態を確認します。", layers: ["皮膚・皮下組織", "大腿筋膜（外側は腸脛靱帯）", "注射を検討する膜の深側", "外側広筋"] }],
    asset: "/anatomy/openstax-thigh.png", imageSize: [873,942], crop: "190 280 330 610", fullCrop: "0 0 873 942", attribution: "OpenStax College · CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:1122_Gluteal_Muscles_that_Move_the_Femur_a.png",
  },
  {
    id: "calf", title: "ふくらはぎ", symptom: "ふくらはぎの張り・痛み", regionLabel: "下腿後面",
    description: "歩くとふくらはぎがつっぱる・動かしたときに張りを感じる。",
    benefit: "筋膜の動きが関係している場合に、歩行時のつっぱりや動かしにくさの軽減を目指します。",
    differential: "肉離れ、アキレス腱、神経や血管の問題なども確認します。急な片脚の腫れや熱感は、まず医療機関へ相談してください。",
    caution: "腓腹筋とヒラメ筋の間には腱膜もあります。血管・神経の位置や筋損傷の有無を確認し、治療の適応を判断します。",
    targets: [{ id: "gastrocnemius-soleus", name: "腓腹筋とヒラメ筋の間", upper: "腓腹筋", lower: "ヒラメ筋", kind: "muscle", explanation: "表面に近い腓腹筋と、その奥のヒラメ筋。筋膜・腱膜の位置と筋肉の滑りを確かめ、必要に応じて境目への注射を検討します。", layers: ["皮膚・皮下組織", "腓腹筋", "筋膜・腱膜の境目", "ヒラメ筋"] }],
    asset: "/anatomy/openstax-leg.jpg", imageSize: [2279,1358], crop: "1160 0 400 1220", fullCrop: "0 0 2279 1358", attribution: "OpenStax · CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:1123_Muscles_of_the_Leg_that_Move_the_Foot_and_Toes.jpg",
  },
];
export function getRegion(id: string): Region { return REGIONS.find(r => r.id === id) ?? REGIONS[0]; }
export function getTarget(region: Region, id: string): Target { return region.targets.find(t => t.id === id) ?? region.targets[0]; }
export function treatmentFrame(progress: number) {
  const p = Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0));
  return { progress: p, spread: Math.max(0, Math.min(1, (p - 20) / 65)), needle: Math.min(1,p / 20) * (p > 86 ? (100-p)/14 : 1), glide: Math.max(0,(p - 72)/28), phase: p === 0 ? "before" : p < 85 ? "injecting" : "after" };
}
