"use client";

import { Plus, Trash2 } from "lucide-react";

type AdvertisementInfoEditorProps = {
  lines: string[];
  onChange: (lines: string[]) => void;
  disabled?: boolean;
};

export function AdvertisementInfoEditor({ lines, onChange, disabled }: AdvertisementInfoEditorProps) {
  const addLine = () => {
    onChange([...lines, ""]);
  };

  const updateLine = (index: number, value: string) => {
    onChange(lines.map((line, i) => (i === index ? value : line)));
  };

  const removeLine = (index: number) => {
    onChange(lines.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="mb-2 text-lg font-bold tracking-tight text-[#0a0f1d]">معلومات الاعلان</h3>
      <p className="mb-5 text-sm font-medium text-[#8c8c8c]">
        اختياري — سطر واحد في كل حقل، مثل: رقم الاعلان (من الهيئة العامة للعقار) 7201110799
      </p>

      {lines.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {lines.map((line, index) => (
            <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={line}
                onChange={(event) => updateLine(index, event.target.value)}
                placeholder="مثال: رقم الرخصة (من الهيئة العامة للعقار) 1200017618"
                disabled={disabled}
                className="h-12 w-full rounded-[16px] bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors placeholder:text-[#8c8c8c] focus:bg-[#EAEAEA] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => removeLine(index)}
                disabled={disabled}
                className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#F4F4F4] text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addLine}
        disabled={disabled}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#EAEAEA] disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        إضافة سطر
      </button>
    </div>
  );
}
