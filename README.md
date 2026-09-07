# 上野医院｜見てわかるハイドロリリース

長野市三輪・上野医院の、患者向けハイドロリリース説明アプリです。

首・肩、肩甲骨まわり、腰、大腿、下腿の症状から、解剖図・注射を検討する層・注入液の広がり・目指す変化・リスク・料金を確認できます。LINE予約への導線を備えます。

- 料金：全対象部位で1部位5,500円（税込）。大腿・下腿も同額（医院からの指定）。肩＋腰の2部位は8,800円（税込）。
- 解剖図：Gray's Anatomy / OpenStax。原本と出典を `public/anatomy/` に保存。
- アニメーション：教育用の模式図。診断・効果予測・穿刺手技のガイドではありません。
- 医学的な説明・文献の適用範囲：`docs/MEDICAL-NOTES.md`。

## 開発

Node.js 22.13以上。

```sh
npm install
npm run dev
npm run build
node --test tests/rendered-html.test.mjs tests/hydro-model.test.mjs
```

Vinext / React / Vite / Cloudflare Worker。部位選択はブラウザ内で完結し、患者情報を収集・送信しません。LINEボタンは医院HPに掲載された予約先へのリンクです。
