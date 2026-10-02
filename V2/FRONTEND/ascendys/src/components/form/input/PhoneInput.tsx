import { useState, useEffect } from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import type { E164Number } from "libphonenumber-js";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  defaultCountry?: string;
  error?: string;
}

export default function PhoneInput({
  value,
  onChange,
  onValidationChange,
  disabled = false,
  required = false,
  placeholder = "Entrez un numéro de téléphone",
  defaultCountry = "TG", // Togo par défaut
  error,
}: PhoneInputProps) {
  const [internalError, setInternalError] = useState<string>("");

  useEffect(() => {
    // Validate phone number when value changes
    if (value && value.length > 0) {
      try {
        // Only validate if the number seems complete enough
        if (value.length >= 8) {
          const isValid = isValidPhoneNumber(value);
          onValidationChange?.(isValid);
          
          if (!isValid) {
            setInternalError("Le numéro de téléphone n'est pas valide");
          } else {
            setInternalError("");
          }
        } else {
          // Number is too short, but don't show error while typing
          setInternalError("");
          onValidationChange?.(false);
        }
      } catch (err) {
        // Ignore parsing errors while user is typing
        setInternalError("");
        onValidationChange?.(false);
      }
    } else if (required && !value) {
      setInternalError("Le numéro de téléphone est requis");
      onValidationChange?.(false);
    } else {
      setInternalError("");
      onValidationChange?.(!required);
    }
  }, [value, required, onValidationChange]);

  const handleChange = (val: E164Number | undefined) => {
    onChange(val || "");
  };

  const displayError = error || internalError;

  // Safely check if phone is valid for display
  const isValidForDisplay = value && value.length >= 8 && !displayError;
  let countryCode = "";
  
  if (isValidForDisplay) {
    try {
      const parsed = parsePhoneNumber(value);
      if (parsed) {
        countryCode = parsed.country || "";
      }
    } catch {
      // Ignore parse errors for display
    }
  }

  return (
    <div className="phone-input-container">
      <PhoneInputWithCountry
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry as any}
        value={value as E164Number | undefined}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`phone-input ${displayError ? "phone-input-error" : ""} ${disabled ? "phone-input-disabled" : ""}`}
      />
      {displayError && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">
          {displayError}
        </p>
      )}
      {isValidForDisplay && (
        <p className="mt-1 text-xs text-success-600 dark:text-success-400">
          ✓ Numéro valide {countryCode && `(${countryCode})`}
        </p>
      )}
    </div>
  );
}
