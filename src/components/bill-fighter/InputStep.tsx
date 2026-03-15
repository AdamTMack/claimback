"use client";

import { useState } from "react";
import type { InputNode, InputField } from "@/types/decision-tree";

interface InputStepProps {
  node: InputNode;
  existingData: Record<string, unknown>;
  onAdvance: (formData: Record<string, unknown>) => void;
  onBack?: () => void;
  canGoBack: boolean;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export function InputStep({
  node,
  existingData,
  onAdvance,
  onBack,
  canGoBack,
}: InputStepProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of node.fields) {
      initial[field.key] = (existingData[field.key] as string) ?? "";
    }
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: InputField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message;
      }
    }
    if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
      return field.validation.message;
    }
    if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
      return field.validation.message;
    }
    return null;
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    for (const field of node.fields) {
      const error = validateField(field, formData[field.key] || "");
      if (error) {
        newErrors[field.key] = error;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert numeric fields
    const processedData: Record<string, unknown> = {};
    for (const field of node.fields) {
      const value = formData[field.key];
      if (field.inputType === "currency" || field.inputType === "number") {
        processedData[field.key] = Number(value.replace(/[^0-9.]/g, ""));
      } else {
        processedData[field.key] = value;
      }
    }

    onAdvance(processedData);
  };

  const renderField = (field: InputField) => {
    const hasError = !!errors[field.key];
    const commonProps = {
      id: field.key,
      value: formData[field.key] || "",
      "aria-required": field.required || undefined,
      "aria-invalid": hasError || undefined,
      "aria-describedby": hasError ? `error-${field.key}` : undefined,
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        setFormData((prev) => ({ ...prev, [field.key]: e.target.value }));
        if (errors[field.key]) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next[field.key];
            return next;
          });
        }
      },
      className: `
        w-full px-4 py-3 rounded-[10px] border-2 transition-colors text-[#1f2a24]
        ${
          hasError
            ? "border-[#b04a3c] focus:border-[#b04a3c] focus:ring-[#b04a3c]/20"
            : "border-[#e2ddd3] focus:border-[#3868a8] focus:ring-[#3868a8]/20"
        }
        focus:outline-none focus:ring-2
      `,
      placeholder: field.placeholder,
    };

    switch (field.inputType) {
      case "textarea":
        return <textarea {...commonProps} rows={4} />;

      case "state-select":
        return (
          <select {...commonProps}>
            <option value="">Select your state</option>
            {US_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        );

      case "currency":
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8a80]" aria-hidden="true">
              $
            </span>
            <input
              {...commonProps}
              type="text"
              inputMode="decimal"
              className={`${commonProps.className} pl-8`}
            />
          </div>
        );

      case "date":
        return <input {...commonProps} type="date" />;

      case "email":
        return <input {...commonProps} type="email" />;

      case "phone":
        return <input {...commonProps} type="tel" />;

      case "number":
        return <input {...commonProps} type="number" />;

      default:
        return <input {...commonProps} type="text" />;
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24]">{node.prompt}</h2>
        {node.subtext && (
          <p className="mt-2 font-light text-[#5c6b62]">{node.subtext}</p>
        )}
      </div>

      {node.meta?.helpText && (
        <div className="bg-[#eef3fa] border border-[#c8d8ec] rounded-[14px] p-4 text-sm text-[#2d5590]">
          {node.meta.helpText}
        </div>
      )}

      <div className="space-y-4">
        {node.fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-[#5c6b62] mb-1"
            >
              {field.label}
              {field.required && (
                <>
                  <span className="text-[#b04a3c] ml-1" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </>
              )}
            </label>
            {renderField(field)}
            {errors[field.key] && (
              <p id={`error-${field.key}`} className="mt-1 text-sm text-[#b04a3c]" role="alert">
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        {canGoBack ? (
          <button
            onClick={onBack}
            className="px-6 py-3 text-[#5c6b62] hover:text-[#1f2a24] font-medium transition-colors"
            aria-label="Go back to previous step"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-[#3868a8] text-white rounded-[10px] font-medium hover:bg-[#2d5590] shadow-sm transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
