import assert from "node:assert/strict";
import test from "node:test";


test("serves the patient explorer with anatomy, fees, risks and LINE reservation", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  for (const text of ['ハイドロリリース','首・肩','肩甲骨まわり','太もも','ふくらはぎ','注射の変化を見る','5,500','副作用・リスク','LINEで予約する']) assert.ok(html.includes(text), text);
  assert.match(html, /https:\/\/lin\.ee\/zNl8pfQ/);
  assert.match(html, /gray409-shoulder\.png/);
  assert.match(html, /role="tablist"/);
  assert.doesNotMatch(html, /出典を確認中|診察時に確認<|codex-preview|Create Next App/);
});
