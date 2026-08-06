# LinguaFlow Family

A warm, mobile-first part of the LinguaFlow ecosystem that helps multilingual families support English learning at home—without needing to be English experts. The first release supports English, Simplified Chinese, and Korean.

The visual system shares LinguaFlow's cyan-to-violet gradient, cool neutral palette, editorial headings, rounded controls, and light elevated surfaces while keeping a warmer, more playful tone for families.

The application mark is stored at `src/assets/linguaflow-family-logo.png`. It is a transparent, family-surface refinement of the shared LinguaFlow ribbon “L” and should remain recognizable across every ecosystem experience.

## What is included

- **Today / This Week:** one newsletter-linked idea, one age-aware activity, and three clear parent pathways
- **Activities:** 18 curated activities balanced across ages 6–14, with age, time, and goal filters
- **Understand My Child:** WIDA-friendly language-development explanations and common parent questions
- **Parent Academy:** short, reassuring learning modules for families
- **Reviewed family questions:** a small local answer set currently presented within Understand My Child
- **School Connection:** meeting prompts and copyable phrases for common parent–child and school conversations
- Direct, shareable hash URLs for activities, lessons, and weekly newsletter features
- Locally remembered language and age preferences without an account or backend
- Responsive navigation, keyboard-accessible controls, reduced-motion support, and language switching across core content

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal. To verify a production build:

```bash
npm run build
npm run lint
```

## Live site

The production site is deployed automatically from `main` with GitHub Actions:

[https://lenguajelabs-design.github.io/LinguaFlow-Family/](https://lenguajelabs-design.github.io/LinguaFlow-Family/)

Every push to `main` runs a clean install, builds the Vite application, and publishes the generated `dist` directory to GitHub Pages.

## Architecture

```text
src/
├── components/ui.tsx    Small shadcn-style Button, Card, and Chip primitives
├── data/content.ts      Typed local seed content and translations
├── lib/utils.ts         Shared class-name utility
├── App.tsx              MVP pages, navigation, and client-side interactions
├── index.css            Tailwind import, global tokens, and accessibility defaults
└── main.tsx             React entry point
```

The MVP intentionally uses a simple local data layer and hash-based client routing. It has no accounts, database, analytics, or external AI calls. Language and age preferences are stored only in the family's browser. This keeps family data private and makes newsletter links reliable on GitHub Pages.

The complete English Parent Academy editorial source—including website and newsletter versions—is stored in `content/parent-academy-lessons.md`. The app publishes the 12 core website lessons and retains the optional lessons and newsletter copy for editorial use.

Activity research is preserved in `content/research-based-activity-library.md`. It is intentionally integrated in stages so the public library stays balanced across ages 6–14; incomplete research batches are not automatically published.

The next reading-and-writing expansion is scoped in `content/reading-writing-pathway-brief.md`. It captures the question-first product direction, recommended 12-strategy launch set, newsletter sequence, and the evidence review required before publication. The complete revised English source is preserved in `content/reading-writing-strategy-library.md`.

The UI uses React + Vite + TypeScript, Tailwind CSS v4, shadcn-style component conventions, and Lucide icons.

## Extending the content

All multilingual seed content lives in `src/data/content.ts`.

1. Add an activity to the `activities` array and provide `en`, `zh`, and `ko` values for every `LocalText` field.
2. Add parent questions to `questions`. Keep answers short, plain-language, non-judgmental, and careful not to present a WIDA level as a grade or limit.
3. Add copyable language to `phrases`. Use phrases parents can say naturally, not literal or formal translations.
4. Run `npm run build` so TypeScript catches missing translations.

Content should be reviewed by fluent speakers and an EAL specialist before public release. Avoid making medical, diagnostic, or school-specific claims.

## Product principles

- Make the next helpful action obvious.
- Treat home language as an asset.
- Use plain language and explain school jargon.
- Prefer useful family moments over a large visible resource library.
- Reassure without minimizing a parent’s concern.
- Never imply that a child’s language level measures intelligence or potential.

## Roadmap

### 0.2 — Content depth

- Expand to 30–50 activities with age, time, skill, and interest filters
- Add full Parent Academy lessons and audio support
- Complete a native-speaker translation review
- Add printable/offline activity cards

### 0.3 — Personalization

- Optional local family profile: age range, interests, home language, and learning focus
- Personalized Today activity while preserving a no-account path
- Saved favorites and recently used activities

### 1.0 — Trusted connected support

- Teacher-curated resource recommendations
- Carefully scoped, privacy-first expert support with clear limits and source-backed answers
- School-specific phrase packs and meeting preparation
- Additional home languages, beginning with Spanish, Japanese, Arabic, Portuguese, and Hindi
- Content-management workflow and accessibility/user testing with multilingual families

## Current limitations

The language selector changes the primary UI and seeded content, while the full Parent Academy lesson bodies remain English-first. The standalone answer finder is intentionally hidden until the reviewed library is deep enough to support the promise. Only language and age preferences currently persist between visits.

## Photography

Activity and supporting family photography is stored locally as optimized assets. The approved library currently includes six activity images and four culturally diverse supporting images. See [`PHOTO_CREDITS.md`](PHOTO_CREDITS.md) for source pages, photographers, license, processing notes, and responsible-use caveat.
