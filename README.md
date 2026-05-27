# Add-On Codes — Earning Statement Template

React + TypeScript + Modus Web Components implementation for the **Add-On Codes** section on Admin Settings → Earning Settings → General Settings → **Earning Statement Template** accordion.

## Placement

Insert **below** `TimeOffFields` and **above** `EmployerSecondaryAddress`:

```tsx
<TimeOffFields ... />
<AddOnCodesSection value={addonCodes} onChange={setAddonCodes} />
<EmployerSecondaryAddress ... />
```

## Company / entity payload

```json
{
  "earning_statement_template": {
    "addon_codes_section_title": "Accrued Balance Information",
    "addon_codes": [
      {
        "spectrum_code": "CVP",
        "label": "Canadian Vacation Pay",
        "show_ytd": true,
        "show_accrued": true,
        "show_on_check": true
      }
    ]
  }
}
```

## Files

| File | Purpose |
|------|---------|
| `src/types/addonCodes.types.ts` | Schema, defaults, limits |
| `src/components/AddOnCodesSection/AddOnCodesSection.tsx` | UI component |
| `src/components/AddOnCodesSection/AddOnCodesSection.css` | Viewpoint-aligned layout |
| `src/integration/EarningStatementTemplate.example.tsx` | Parent form wiring |

## Local HTML preview (no build)

Open in your browser:

```
file:///Users/sfarhat/Documents/Projects/viewpoint-hr-earnings-addon-codes/preview/add-on-codes-preview.html
```

Or from terminal:

```bash
open /Users/sfarhat/Documents/Projects/viewpoint-hr-earnings-addon-codes/preview/add-on-codes-preview.html
```

The preview includes sample data, add/remove rows, and a live JSON payload panel.

## Dependencies

```bash
npm install @trimble-oss/moduswebcomponents @trimble-oss/moduswebcomponents-react
```

Import Modus styles once in your app entry (per your project’s Modus setup).

## Behavior

- Section title: max 100 characters, default `"Accrued Balance Information"`
- Info tooltip on section header
- Up to 20 repeater rows
- Spectrum code forced to ALL CAPS via `text-transform` and `toUpperCase()` on change
- Label max 50 characters
- Display YTD / Display Accrued / Display On Check checkboxes
- Remove row (trash icon), add row (`+ Add Add-On Code`)
