# Chinese editorial and narrative review

Use this reference for Chinese technical talks, especially when copy feels translated, generic, or model-generated.

## Review in four passes

### 1. Claim

Ask of every slide:

- What single thing should the audience remember?
- Does the title make that claim, or merely name a topic?
- Does the body provide evidence for the title?
- Could this page be removed without changing the argument? If yes, combine or delete it.

Prefer titles such as:

- `先说清楚：做到什么才算成功`
- `规则越清楚，AI 越能把工作铺开`
- `字段不难，语义才难`
- `到了物理世界，只认测量结果`

Avoid category labels such as `核心洞察`, `价值升级`, or `关键赋能`.

### 2. Natural Chinese

Rewrite abstract nominalizations into subjects, verbs, and consequences.

| Avoid | Prefer |
| --- | --- |
| 先缩小成功的定义 | 先说清楚：做到什么才算成功 |
| 能力没有突然跃迁；机制在持续叠加 | 变化不只来自模型变强，也来自上下文、分工和反馈逐步完善 |
| 把隐藏取舍变成可实验的决策面 | 把原本藏着的取舍摆到台面上，方便讨论和实测 |
| 形成职业杠杆 | 形成长期能力 |
| 知识系统的最终验证者 | 一本书，最后要过读者这一关 |
| 修正持续沉淀 | 修过的问题不必一再重来 |

Treat `赋能`, `抓手`, `范式`, `复利`, `闭环`, `沉淀`, `能力增量`, and `护城河` as warning signs. They are not forbidden, but each occurrence must earn its meaning.

### 3. Mixed language

Translate interface labels and general process words:

- `Before / Inputs / After` → `动笔之前 / 写作材料 / 写完之后`
- `Human Lead / Reality` → `负责人 / 真实反馈`
- `Reader Journey` → `读者怎样一步步学会`
- `Review` → `审查` when it is not a product name
- `Session` → `会话` or `训练过程` according to context

Keep identifiers such as AWS, S3, BLE, QUIC, Rust, SigV4, and D3 when translation would reduce precision. Explain unfamiliar abbreviations on first use.

### 4. Speakability

Read aloud. Rewrite when:

- a sentence contains more than two abstract nouns in sequence;
- the subject is missing;
- semicolons hold together unrelated claims;
- every clause has the same rhetorical rhythm;
- a title requires a second reading;
- the speaker would naturally use different words.

## Memorable sentences

A memorable sentence should compress demonstrated evidence, not replace it.

Good patterns:

- contrast: `对话会结束，项目上下文会留下。`
- boundary: `AI 可以列选项，不能替你拍板。`
- reality check: `到了物理世界，只认测量结果。`
- agency: `答案越来越便宜，问题反而更重要。`
- choice: `速度已经到来，方向仍由我们选择。`

Use at most one dominant sentence in a short run of slides. Give it space. Do not stack several slogans on one page.

## Transition review

For each topic boundary, write one sentence answering:

1. What did the previous topic teach?
2. What assumption fails in the next topic?

Examples:

- tests → measurement: software failures can replay; physical reality adds temperature, obstruction, impact, and human motion;
- measurement → trust: devices need calibration; knowledge needs sources, review, and reader understanding;
- method → career: when build-measure-learn becomes fast, responsibility moves toward direction, evidence, and exceptions.

## Ending review

Avoid ending with a summary list. Build toward questions such as:

- What remains worth maintaining when implementation is cheap?
- Which judgments must never be delegated?
- Can saved time produce deeper understanding rather than more features?
- Do we want AI to amplify only efficiency, or also curiosity, imagination, and responsibility?

The final page should provide a frame for discussion, not a canned answer.

