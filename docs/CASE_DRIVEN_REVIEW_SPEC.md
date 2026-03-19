# Case-Driven Review Spec

## Goal

Turn the review product from:

- `content -> AI opinion`

into:

- `content -> risk sentence extraction -> similar official cases -> law basis -> rewrite guidance`

The product should feel trustworthy because it can say:

- "This wording is risky"
- "There are official penalty cases with similar claims"
- "Here is the law basis"

## Why This Matters

Generic LLMs can already do a one-off compliance guess.

This product becomes defensible only if it adds:

1. Structured Taiwan-specific official case knowledge
2. Repeatable matching logic
3. A review result that cites precedent, not just AI output
4. A retained review workflow with logs and comparable results

## Current Repo State

Relevant existing pieces:

- Prisma models already exist for `Regulation`, `PenaltyCase`, `AdReview`
- Review API exists at `src/app/api/review/route.ts`
- Result UI exists at `src/components/review/ReviewResult.tsx`
- Static knowledge lives in `src/data/regulations.ts`
- FDA scraped cases are merged into `penaltyCases`

Current gap:

- Review results do not return similar cases
- Penalty cases are display-oriented, not matching-oriented
- There is no matching service between user input and penalty cases
- The result UI shows issues and suggestions, but not precedent

## Product Outcome

When a user submits content, the result page should show:

1. Risk summary
2. Risky sentences
3. Similar official cases
4. Law basis
5. Safer rewrite guidance

This is the trust moment:

- "Someone wrote something like this before"
- "They were fined"
- "Here is the source"

## Phase Plan

### Phase 1: MVP in Static Data Layer

Use existing `src/data/regulations.ts` without waiting for a DB migration.

Build:

1. A case matching service
2. API response fields for matched cases
3. A result UI section for similar official cases

This phase should ship fast and prove value.

### Phase 2: Promote to Database-Backed Knowledge Layer

After the MVP works, migrate richer case metadata into Prisma and DB-backed search.

Build:

1. Structured case enrichment fields
2. Review-to-case snapshot logging
3. Admin tooling to inspect which cases are matched most often

### Phase 3: Semantic Matching and Social Signals

After official case matching is stable:

1. Add embeddings or semantic search
2. Add separate social signal ingestion
3. Keep official cases and social signals clearly separated in UI and scoring

## MVP Scope

### Data Shape

Extend the app-layer `PenaltyCase` type in `src/data/regulations.ts` with optional fields:

```ts
interface PenaltyCase {
  id: string
  category: string
  title: string
  description: string
  violationType: string
  violationText: string
  penalty: string
  fineAmount: number
  date: string
  authority: string
  source?: string
  sourceUrl?: string

  // new matching fields
  lawReference?: string
  platform?: string
  riskTags?: string[]
  keywords?: string[]
  sourceType?: 'official_case'
}
```

MVP note:

- Do not block on filling every case perfectly
- Start by enriching the highest-value cases first
- For cases without explicit `lawReference`, derive fallback from category and violation type

### Matching Output Shape

Add a new result type returned by the review API:

```ts
interface SimilarCaseMatch {
  id: string
  title: string
  category: string
  authority: string
  date: string
  penalty: string
  fineAmount: number
  violationType: string
  violationText: string
  source?: string
  sourceUrl?: string
  lawReference?: string
  riskTags?: string[]
  similarityScore: number
  matchedBy: Array<'product_type' | 'risk_tag' | 'keyword' | 'text_overlap'>
}
```

### API Response

Extend `src/app/api/review/route.ts` response:

```ts
{
  riskLevel,
  riskScore,
  issues,
  suggestions,
  revisedContent,
  provider,
  processingTime,
  audienceMode,
  analyzedAt,
  usage,
  similarCases: SimilarCaseMatch[],
  lawSummary: {
    primaryLaws: string[]
    relatedCategories: string[]
  }
}
```

MVP target:

- `similarCases.length` = 2 to 3
- prioritize official cases only

## Matching Logic

Create a new service:

- `src/services/caseMatcher.ts`

Responsibilities:

1. Normalize the user content
2. Use review issues plus product type as input
3. Score official cases
4. Return top ranked results

### Scoring Rules

Start simple and deterministic:

1. Product category match
2. Violation type overlap
3. Risk tag overlap
4. Keyword overlap
5. Text overlap against issue text and original content

Suggested first-pass score:

```txt
+40 same product category
+25 same violation type
+10 per shared risk tag
+6 per shared keyword
+4 per overlapping phrase from issue text
```

Rules:

- filter to same `productType` first when possible
- if fewer than 3 results, backfill with same-category recent official cases
- sort by score, then by newest date

### Inputs for Matching

Use:

- original `content`
- detected `productType`
- `issues[].type`
- `issues[].text`
- `issues[].law`

Do not use:

- revised content
- suggestion text

## UI Spec

### Result Page Section Order

In `src/components/review/ReviewResult.tsx`, insert a new section after risk issues and before rewrite guidance:

1. Risk summary
2. Risk items
3. Similar official cases
4. Suggestions
5. Consumer next steps or revised content

### Similar Cases Section

Title:

- `Similar Official Cases`

Chinese UI copy:

- section eyebrow: `Official Cases`
- section title: `Similar official penalty cases`
- helper copy: `These are similar official cases and are not formal legal advice.`

Each case card should show:

- case title
- violation text
- authority and date
- penalty / fine
- law reference if available
- source link

Recommended card footer:

- `Matched because: same category / same claim type / keyword overlap`

### Trust Copy

Fixed trust disclaimer:

- `These matches are similar official precedents used for risk comparison. They do not constitute a final legal determination.`

## Review Logging

The result shown to a user should also be retainable in logs later.

Phase 1 can keep this out of DB if needed.

Phase 2 should store a snapshot of matched cases per review.

Recommended new model:

```prisma
model ReviewCaseMatch {
  id              String   @id @default(cuid())
  reviewId         String
  caseId           String
  similarityScore  Float
  matchedBy        Json
  createdAt        DateTime @default(now())
}
```

If keeping `PenaltyCase` in DB:

```prisma
model PenaltyCase {
  id              String   @id @default(cuid())
  category        ProductType
  title           String
  description     String   @db.Text
  violationType   String
  violationText   String?  @db.Text
  penalty         String
  fineAmount      Int?
  date            DateTime
  authority       String?
  source          String?
  sourceUrl       String?
  caseNumber      String?

  // new
  lawReference    String?
  platform        String?
  riskTags        String[]
  keywords        String[]
  sourceType      CaseSourceType @default(OFFICIAL)
  isPublic        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum CaseSourceType {
  OFFICIAL
  SOCIAL_SIGNAL
  INTERNAL_REVIEW_PATTERN
}
```

## Social Signal Layer

Do not mix social discussion into official case matches.

Use a separate model later:

```prisma
model SocialSignal {
  id                String   @id @default(cuid())
  platform          String
  sourceUrl         String   @unique
  authorLabel       String?
  productCategory   ProductType?
  title             String?
  transcript        String?  @db.Text
  claimText         String   @db.Text
  discussionSummary String?  @db.Text
  riskTags          String[]
  confidenceScore   Float?
  publishedAt       DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

UI rule:

- official cases support trust and citation
- social signals support monitoring and early warning

## Concrete File Plan

### MVP Files to Add

- `src/services/caseMatcher.ts`

### MVP Files to Update

- `src/data/regulations.ts`
- `src/app/api/review/route.ts`
- `src/components/review/ReviewResult.tsx`
- `src/components/review/ReviewResult.module.css`

### Optional Support Files

- `src/types/review.ts`
- `src/services/caseMatcher.test.ts`

## Suggested Implementation Order

1. Enrich `PenaltyCase` app-layer type with optional matching fields
2. Build `caseMatcher.ts`
3. Return `similarCases` from review API
4. Render `similarCases` in result UI
5. Add logging snapshot model later

## Success Criteria

The feature is successful when:

1. A user submits content and sees 2 to 3 similar official cases
2. At least one matched case clearly explains why the wording is risky
3. The result page feels more trustworthy than a generic LLM answer
4. Admin can later inspect which cases are matched most often

## Out of Scope for MVP

- Full semantic embeddings
- YouTube or Threads ingestion
- Automatic legal final judgment
- Full DB migration of every case field before launch

## Next Recommended Build Step

Implement the MVP using the static `penaltyCases` dataset first.

That gives the fastest path to:

- higher trust
- precedent-based review
- visible product differentiation from ChatGPT or Gemini
