/** Single Add-On code row saved at company/entity level. */
export interface AddOnCode {
  spectrum_code: string;
  label: string;
  show_ytd: boolean;
  show_accrued: boolean;
  show_on_check: boolean;
}

/** Add-On Codes block within Earning Statement Template settings. */
export interface AddOnCodesSettings {
  section_title: string;
  codes: AddOnCode[];
}

export const ADDON_CODES_DEFAULTS: AddOnCodesSettings = {
  section_title: 'Accrued Balance Information',
  codes: [],
};

export const ADDON_CODE_LIMITS = {
  maxRows: 20,
  sectionTitleMaxLength: 100,
  labelMaxLength: 50,
} as const;

export function createEmptyAddOnCode(): AddOnCode {
  return {
    spectrum_code: '',
    label: '',
    show_ytd: false,
    show_accrued: false,
    show_on_check: false,
  };
}
