/**
 * Integration example — place <AddOnCodesSection /> inside the
 * "Earning Statement Template" accordion, directly after Time off fields.
 *
 * ```tsx
 * <EarningStatementTemplateAccordion>
 *   <CompanyLogoUpload ... />
 *   <TimeOffFields ... />
 *   <AddOnCodesSection value={addonCodes} onChange={setAddonCodes} />
 *   <EmployerSecondaryAddress ... />
 *   ...
 * </EarningStatementTemplateAccordion>
 * ```
 */

import { useCallback, useState } from 'react';
import { AddOnCodesSection } from '../components/AddOnCodesSection';
import {
  ADDON_CODES_DEFAULTS,
  type AddOnCodesSettings,
} from '../types/addonCodes.types';

/** Extend your existing company/entity earning settings payload. */
export interface CompanyEarningSettings {
  earning_statement_template: {
    company_logo?: unknown;
    time_off_fields?: string[];
    addon_codes_section_title: string;
    addon_codes: AddOnCodesSettings['codes'];
    employer_secondary_address?: unknown;
    // ...other template fields
  };
}

function mapSettingsToApi(
  addon: AddOnCodesSettings,
): Pick<
  CompanyEarningSettings['earning_statement_template'],
  'addon_codes_section_title' | 'addon_codes'
> {
  return {
    addon_codes_section_title: addon.section_title.trim(),
    addon_codes: addon.codes.map((row) => ({
      spectrum_code: row.spectrum_code.trim().toUpperCase(),
      label: row.label.trim(),
      show_ytd: row.show_ytd,
      show_accrued: row.show_accrued,
      show_on_check: row.show_on_check,
    })),
  };
}

function mapApiToSettings(
  template: CompanyEarningSettings['earning_statement_template'],
): AddOnCodesSettings {
  return {
    section_title:
      template.addon_codes_section_title ??
      ADDON_CODES_DEFAULTS.section_title,
    codes: (template.addon_codes ?? []).map((row) => ({
      ...row,
      show_on_check: row.show_on_check ?? false,
    })),
  };
}

export function EarningStatementTemplateExample({
  initialTemplate,
  onSave,
}: {
  initialTemplate: CompanyEarningSettings['earning_statement_template'];
  onSave: (payload: CompanyEarningSettings['earning_statement_template']) => void;
}) {
  const [addonCodes, setAddonCodes] = useState<AddOnCodesSettings>(() =>
    mapApiToSettings(initialTemplate),
  );

  const handleSave = useCallback(() => {
    onSave({
      ...initialTemplate,
      ...mapSettingsToApi(addonCodes),
    });
  }, [addonCodes, initialTemplate, onSave]);

  return (
    <div>
      {/* ...CompanyLogoUpload, TimeOffFields above */}

      <AddOnCodesSection value={addonCodes} onChange={setAddonCodes} />

      {/* ...EmployerSecondaryAddress and remaining sections below */}

      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
