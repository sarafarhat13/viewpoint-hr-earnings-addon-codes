import { useCallback, useId, useMemo } from 'react';
import {
  ModusWcButton,
  ModusWcCheckbox,
  ModusWcIcon,
  ModusWcTextInput,
  ModusWcTooltip,
} from '@trimble-oss/moduswebcomponents-react';
import {
  ADDON_CODE_LIMITS,
  createEmptyAddOnCode,
  type AddOnCode,
  type AddOnCodesSettings,
} from '../../types/addonCodes.types';
import './AddOnCodesSection.css';

const TOOLTIP_TEXT =
  'Configure specific Add-On codes from Spectrum to display as monetary balances on employee paystubs.';

export interface AddOnCodesSectionProps {
  value: AddOnCodesSettings;
  onChange: (next: AddOnCodesSettings) => void;
  disabled?: boolean;
}

function readInputValue(event: CustomEvent): string {
  const target = event.target as HTMLElement & { value?: string };
  return target?.value ?? '';
}

function readCheckboxValue(event: CustomEvent): boolean {
  const target = event.target as HTMLElement & { value?: boolean };
  return Boolean(target?.value);
}

export function AddOnCodesSection({
  value,
  onChange,
  disabled = false,
}: AddOnCodesSectionProps) {
  const baseId = useId();
  const { maxRows, sectionTitleMaxLength, labelMaxLength } = ADDON_CODE_LIMITS;
  const canAddMore = value.codes.length < maxRows;

  const updateSettings = useCallback(
    (patch: Partial<AddOnCodesSettings>) => {
      onChange({ ...value, ...patch });
    },
    [onChange, value],
  );

  const updateCode = useCallback(
    (index: number, patch: Partial<AddOnCode>) => {
      const codes = value.codes.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      );
      onChange({ ...value, codes });
    },
    [onChange, value],
  );

  const handleSectionTitleChange = useCallback(
    (event: CustomEvent) => {
      const next = readInputValue(event).slice(0, sectionTitleMaxLength);
      updateSettings({ section_title: next });
    },
    [sectionTitleMaxLength, updateSettings],
  );

  const handleAddRow = useCallback(() => {
    if (!canAddMore) return;
    onChange({
      ...value,
      codes: [...value.codes, createEmptyAddOnCode()],
    });
  }, [canAddMore, onChange, value]);

  const handleRemoveRow = useCallback(
    (index: number) => {
      onChange({
        ...value,
        codes: value.codes.filter((_, i) => i !== index),
      });
    },
    [onChange, value],
  );

  const rowIds = useMemo(
    () => value.codes.map((_, index) => `${baseId}-row-${index}`),
    [baseId, value.codes],
  );

  return (
    <section
      className="addon-codes-section"
      aria-labelledby={`${baseId}-legend`}
    >
      <h3 id={`${baseId}-legend`} className="visually-hidden">
        Add-On Codes
      </h3>

      <div className="addon-codes-section__heading-row">
        <div className="addon-codes-section__section-label">
          <span>Add-On Codes</span>
          <ModusWcTooltip content={TOOLTIP_TEXT} position="top">
            <button
              type="button"
              className="addon-codes-section__info-trigger"
              aria-label="About Add-On codes"
            >
              <ModusWcIcon decorative name="info" size="sm" />
            </button>
          </ModusWcTooltip>
        </div>

        <div className="addon-codes-section__title-field">
          <ModusWcTextInput
            inputId={`${baseId}-section-title`}
            label="Section Title"
            maxLength={sectionTitleMaxLength}
            value={value.section_title}
            disabled={disabled}
            onInputChange={handleSectionTitleChange}
          />
        </div>
      </div>

      <p className="addon-codes-section__helper">
        Map Spectrum Add-On codes to labels and choose which monetary balances
        appear on employee paystubs.
      </p>

      <div className="addon-codes-section__grid-wrap">
        <table className="addon-codes-section__grid">
          <thead>
            <tr>
              <th scope="col" className="col-spectrum">
                Spectrum Code
              </th>
              <th scope="col" className="col-label">
                Label
              </th>
              <th scope="col" className="col-toggle">
                Display YTD
              </th>
              <th scope="col" className="col-toggle">
                Display Accrued
              </th>
              <th scope="col" className="col-toggle">
                Display On Check
              </th>
              <th scope="col" className="col-actions">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {value.codes.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <p className="addon-codes-section__empty">
                    No Add-On codes configured. Use the button below to add one.
                  </p>
                </td>
              </tr>
            ) : (
              value.codes.map((row, index) => (
                <tr key={rowIds[index]}>
                  <td className="col-spectrum">
                    <ModusWcTextInput
                      aria-label={`Spectrum code row ${index + 1}`}
                      customClass="addon-codes-section__spectrum-input"
                      inputId={`${baseId}-spectrum-${index}`}
                      maxLength={32}
                      value={row.spectrum_code}
                      disabled={disabled}
                      onInputChange={(event) => {
                        const raw = readInputValue(event);
                        updateCode(index, {
                          spectrum_code: raw.toUpperCase(),
                        });
                      }}
                    />
                  </td>
                  <td className="col-label">
                    <ModusWcTextInput
                      aria-label={`Label row ${index + 1}`}
                      inputId={`${baseId}-label-${index}`}
                      maxLength={labelMaxLength}
                      value={row.label}
                      disabled={disabled}
                      onInputChange={(event) => {
                        updateCode(index, {
                          label: readInputValue(event).slice(
                            0,
                            labelMaxLength,
                          ),
                        });
                      }}
                    />
                  </td>
                  <td className="col-toggle">
                    <div className="addon-codes-section__toggle-cell">
                      <ModusWcCheckbox
                        aria-label={`Display YTD for row ${index + 1}`}
                        inputId={`${baseId}-ytd-${index}`}
                        value={row.show_ytd}
                        disabled={disabled}
                        onInputChange={(event) => {
                          updateCode(index, {
                            show_ytd: readCheckboxValue(event),
                          });
                        }}
                      />
                    </div>
                  </td>
                  <td className="col-toggle">
                    <div className="addon-codes-section__toggle-cell">
                      <ModusWcCheckbox
                        aria-label={`Display accrued for row ${index + 1}`}
                        inputId={`${baseId}-accrued-${index}`}
                        value={row.show_accrued}
                        disabled={disabled}
                        onInputChange={(event) => {
                          updateCode(index, {
                            show_accrued: readCheckboxValue(event),
                          });
                        }}
                      />
                    </div>
                  </td>
                  <td className="col-toggle">
                    <div className="addon-codes-section__toggle-cell">
                      <ModusWcCheckbox
                        aria-label={`Display on check for row ${index + 1}`}
                        inputId={`${baseId}-on-check-${index}`}
                        value={row.show_on_check}
                        disabled={disabled}
                        onInputChange={(event) => {
                          updateCode(index, {
                            show_on_check: readCheckboxValue(event),
                          });
                        }}
                      />
                    </div>
                  </td>
                  <td className="col-actions">
                    <ModusWcButton
                      aria-label={`Remove Add-On code row ${index + 1}`}
                      color="tertiary"
                      variant="borderless"
                      size="sm"
                      shape="square"
                      disabled={disabled}
                      onButtonClick={() => handleRemoveRow(index)}
                    >
                      <ModusWcIcon decorative name="delete" size="sm" />
                    </ModusWcButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="addon-codes-section__actions">
        <ModusWcButton
          color="primary"
          variant="outlined"
          size="md"
          disabled={disabled || !canAddMore}
          onButtonClick={handleAddRow}
        >
          <ModusWcIcon decorative name="add" size="sm" />
          + Add Add-On Code
        </ModusWcButton>
        {!canAddMore && (
          <p className="addon-codes-section__limit-note" role="status">
            Maximum of {maxRows} Add-On codes reached.
          </p>
        )}
      </div>
    </section>
  );
}
