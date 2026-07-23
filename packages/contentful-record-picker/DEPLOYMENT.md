# Contentful App Hosting deployment guide

This app can be uploaded directly to Contentful App Hosting. Vercel is not required for this proof of concept.

## Deployment sequence

```text
Create Contentful App Definition
        ↓
Build this local React/Vite app
        ↓
Upload dist/ as a Contentful App Bundle
        ↓
Contentful activates and hosts the bundle
        ↓
Install the app in a space/environment
        ↓
Assign the app to externalRecordId
```

## 1. Prerequisites

You need:

- Access to the Contentful organization that owns the target space.
- An organization role allowed to create/manage apps (owner, admin, or developer).
- Permission to install apps in the target space/environment.
- Node.js 20 or newer for the current Contentful App Scripts package.
- The dependencies installed in this repository.

Do not place a Contentful Personal Access Token in a committed file.

## 2. Install and verify locally

From `C:\bigComerce\bc-catalyst`:

```powershell
pnpm.cmd install --filter @ges/contentful-record-picker...
pnpm.cmd --filter @ges/contentful-record-picker typecheck
pnpm.cmd --filter @ges/contentful-record-picker build
```

The deployable bundle is generated at:

```text
C:\bigComerce\bc-catalyst\packages\contentful-record-picker\dist
```

It contains `index.html` and the compiled assets Contentful App Hosting requires.

## 3. Create the App Definition

You can use either the Contentful web application or the CLI.

### Option A — Contentful web application

1. Sign in to Contentful.
2. Open the organization that owns your target space.
3. Open the organization app-management area.
4. Select **Create app**.
5. Name the app:

   ```text
   GES External Show Record Picker
   ```

6. Enable Contentful-hosted frontend/app hosting rather than a self-hosted URL.
7. Enable these locations:

   - **App configuration**
   - **Entry field**

8. For the Entry Field location, enable **Short text / Symbol** fields.
9. Save the App Definition.
10. Copy its App Definition ID from the app details or URL. You will use it during upload.

### Option B — Contentful App Scripts CLI

From the repository root:

```powershell
pnpm.cmd --filter @ges/contentful-record-picker create-app-definition
```

The CLI will guide you through Contentful authentication, organization selection, name, and locations. Select:

- App configuration
- Entry field
- Short text / Symbol support for the Entry Field

If you already created the App Definition in the web application, do not create a second one.

## 4. Build the app

Run this after every code change you want to deploy:

```powershell
pnpm.cmd --filter @ges/contentful-record-picker build
```

The upload command does not replace the build step. It uploads the existing `dist` directory.

## 5. Upload to Contentful App Hosting

Run the interactive upload:

```powershell
pnpm.cmd --filter @ges/contentful-record-picker upload
```

The Contentful CLI will ask for or help you select:

1. A Contentful Personal Access Token.
2. The organization.
3. The App Definition.
4. The bundle directory, already configured as `./dist` by the package script.

The upload creates a Contentful App Bundle and activates it automatically. Once activated, Contentful hosts the frontend for the App Definition. No Vercel URL is involved.

### Non-interactive/CI upload

Set secrets in the shell or CI secret store:

```powershell
$env:CONTENTFUL_ORG_ID = 'your-organization-id'
$env:CONTENTFUL_APP_DEF_ID = 'your-app-definition-id'
$env:CONTENTFUL_ACCESS_TOKEN = 'your-personal-access-token'
```

Then run:

```powershell
pnpm.cmd --filter @ges/contentful-record-picker upload-ci
```

Never commit those values to `.env`, source code, documentation, or Git.

### Upload without immediately activating

For a controlled release, pass `--skip-activation`:

```powershell
pnpm.cmd --filter @ges/contentful-record-picker upload -- --skip-activation
```

Activate a selected bundle afterward:

```powershell
pnpm.cmd --filter @ges/contentful-record-picker activate
```

## 6. Install the app in a space/environment

Creating and uploading an App Definition does not install it automatically.

1. Open the target Contentful space.
2. Select a non-production environment for the first test.
3. Go to **Apps → Manage apps**.
4. Find **GES External Show Record Picker**.
5. Select **Install**.
6. Review and authorize access.
7. The configuration screen should say the data source is `mock`.
8. Save the configuration.

Installations are environment-specific. Installing in `master` does not automatically install the app in another environment, and vice versa.

## 7. Create the test content type

Create a content type named **Show Landing Page** with these Short text fields:

| Field name | Field ID | Required |
| --- | --- | --- |
| Name | `internalName` | Yes |
| External record | `externalRecordId` | Yes |
| Title override | `titleOverride` | No |
| Venue override | `venueOverride` | No |
| Support email override | `supportEmailOverride` | No |
| Support phone override | `supportPhoneOverride` | No |

The field IDs must match exactly because the app reads the sibling override fields by ID.

## 8. Assign the custom field editor

1. Open the **Show Landing Page** content type.
2. Edit the `externalRecordId` field.
3. Open **Appearance**.
4. Select **GES External Show Record Picker** instead of the standard single-line editor.
5. Save the content type.

Leave the four override fields on their normal single-line text editors.

## 9. Validate the proof of concept

1. Create a **Show Landing Page** entry.
2. Enter an internal name.
3. Search for `Toronto`, `Chicago`, `Las Vegas`, or `New York` in External record.
4. Select one record.
5. Confirm the field stores a stable ID such as `show-1001`.
6. Confirm the preview labels source values as **Mock database**.
7. Enter a Title override.
8. Confirm the preview changes and labels it **Contentful override**.
9. Clear the override and confirm it falls back to the mock database title.
10. Repeat with venue, email, and phone.
11. Save and publish the entry when satisfied.

## 10. Acceptance checklist

- App bundle is hosted by Contentful.
- App is installed in the intended environment.
- Editors can search and select one mock record.
- Contentful stores only the external record ID.
- Source values remain read-only.
- Only approved override fields replace source values.
- Empty overrides fall back to source data.
- No external database writes occur.
- No tokens or secrets exist in the browser bundle.

## 11. Deploying later changes

For each update:

```powershell
pnpm.cmd --filter @ges/contentful-record-picker typecheck
pnpm.cmd --filter @ges/contentful-record-picker build
pnpm.cmd --filter @ges/contentful-record-picker upload
```

Uploading and activating a new bundle updates the existing App Definition and therefore its installations. You do not create a new App Definition for each release.

## Troubleshooting

### The app is not listed under field Appearance

- Confirm the app is installed in the current environment.
- Confirm Entry Field is enabled on the App Definition.
- Confirm Short text / Symbol is an allowed field type.
- Confirm `externalRecordId` is a Short text field.

### Upload cannot find the bundle

- Run the build first.
- Confirm `packages/contentful-record-picker/dist/index.html` exists.
- Run the command from the repository root using the provided package script.

### Overrides do not update the preview

- Confirm the override field IDs match this document exactly.
- Save the content type after adding fields.
- Refresh the entry editor after changing the content model.

### The wrong organization or app is selected

- Cancel the upload rather than creating a duplicate App Definition.
- Copy the organization and App Definition IDs from Contentful.
- Use the CI-style environment variables to make the target explicit.

## Replacing hardcoded data later

Keep the `ShowRecord` interface and replace the mock module with an API client. If the real API requires secrets, call it through a protected backend or Contentful backend app/function. Do not embed database credentials in this frontend bundle.
