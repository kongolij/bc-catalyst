# GES Contentful External Record Picker

Proof-of-concept Contentful App that lets an editor select a hardcoded show record, stores only the record ID in Contentful, and previews the record with optional Contentful overrides.

## What this validates

- External/database-owned records can be selected through a custom Contentful field editor.
- Contentful stores a stable external ID rather than copying the whole source record.
- Source-owned fields can be displayed read-only.
- Approved Contentful override fields can be layered over the source record.
- Replacing the hardcoded data with an API client does not change the content model.

No external API or database is called in this version.

## Run locally

From the repository root:

```powershell
pnpm --filter @ges/contentful-record-picker dev
```

The app must be loaded by Contentful because `@contentful/app-sdk` initializes through the parent Contentful iframe. For local development, create a Contentful App Definition using `http://localhost:5173` and enable:

- App configuration
- Entry field

Your browser may require HTTPS or permission to load a localhost iframe, depending on organization policy.

## Content model

Create a content type such as **Show Landing Page** with these Short text fields:

| Field name | Field ID | Required | Ownership |
| --- | --- | --- | --- |
| External record | `externalRecordId` | Yes | Mock database reference |
| Title override | `titleOverride` | No | Contentful |
| Venue override | `venueOverride` | No | Contentful |
| Support email override | `supportEmailOverride` | No | Contentful |
| Support phone override | `supportPhoneOverride` | No | Contentful |

In the content type's **Appearance** settings, assign this app to `externalRecordId`. Keep the override fields on their standard editors.

## Contentful setup

1. In Contentful, open **Apps → Manage apps → Create app**.
2. Set the frontend URL to the local Vite URL for development or the deployed static URL.
3. Enable **App configuration** and **Entry field** locations.
4. Install the app into the desired space/environment.
5. Create or update the content type using the table above.
6. Assign the app to the `externalRecordId` field under **Appearance**.
7. Create an entry, select a mock show, then add override values to see the merged preview.

## Production build

```powershell
pnpm --filter @ges/contentful-record-picker build
```

The static output is written to `packages/contentful-record-picker/dist`. The recommended proof-of-concept deployment is Contentful App Hosting using the included `upload` script; no Vercel project is required.

For the complete Vercel and Contentful installation walkthrough, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Replacing mock records with an API

Replace `src/data/mock-records.ts` with an API client that returns the same `ShowRecord` shape. Do not put database credentials in this frontend app. If authentication or secrets are required, call a protected backend/API proxy and keep credentials server-side.
