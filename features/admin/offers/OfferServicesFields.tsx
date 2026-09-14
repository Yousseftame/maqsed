"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import {
  OFFER_SERVICE_KIND_OPTIONS,
  serviceKind,
  type OfferServiceItem,
  type OfferServiceKind,
} from "./offer-services";

const fieldClass =
  "h-12 w-full rounded-[12px] border border-transparent bg-[#F4F4F4] text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d]/10 focus:bg-white placeholder:font-medium placeholder:text-[#8c8c8c]";

type Props = {
  services: OfferServiceItem[];
  isRtl: boolean;
  onUpdate: (index: number, patch: Partial<OfferServiceItem>) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
};

function KindSelect({
  value,
  isRtl,
  onChange,
}: {
  value: OfferServiceKind;
  isRtl: boolean;
  onChange: (kind: OfferServiceKind) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = OFFER_SERVICE_KIND_OPTIONS.find((opt) => opt.id === value) ?? OFFER_SERVICE_KIND_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${fieldClass} flex items-center gap-1.5 px-3`}
        aria-label={isRtl ? "النوع" : "Type"}
      >
        <span className="min-w-0 truncate">{isRtl ? current.labelAr : current.labelEn}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#8c8c8c] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute z-30 mt-1 w-max min-w-full overflow-hidden rounded-[12px] border border-[#0a0f1d]/10 bg-white py-1 shadow-lg">
          {OFFER_SERVICE_KIND_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              className={`flex w-full px-3 py-2.5 text-sm font-bold transition-colors hover:bg-[#F4F4F4] ${
                opt.id === value ? "text-[#0a0f1d]" : "text-[#6b7280]"
              }`}
            >
              {isRtl ? opt.labelAr : opt.labelEn}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function parseAmount(raw: string) {
  if (raw.trim() === "") return 0;
  if (!/^\d*\.?\d*$/.test(raw)) return null;
  return Number(raw) || 0;
}

export function OfferServicesFields({ services, isRtl, onUpdate, onRemove, onAdd }: Props) {
  return (
    <div className="space-y-2">
      <div
        className="hidden sm:grid items-center gap-2 px-1 text-[11px] font-bold text-[#8c8c8c]"
        style={{ gridTemplateColumns: "minmax(0,1fr) 136px 168px 40px" }}
      >
        <span>{isRtl ? "الخدمة" : "Service"}</span>
        <span>{isRtl ? "النوع" : "Type"}</span>
        <span>{isRtl ? "القيمة" : "Value"}</span>
        <span />
      </div>

      {services.map((service, idx) => {
        const kind = serviceKind(service);
        const amountValue = kind === "percent" ? service.percent || "" : service.price || "";
        const suffix = kind === "percent" ? "%" : isRtl ? "ريال" : "SAR";

        return (
          <div
            key={idx}
            className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_136px_168px_40px]"
          >
            <input
              required
              type="text"
              value={service.description}
              onChange={(e) => onUpdate(idx, { description: e.target.value })}
              placeholder={isRtl ? "اكتب الخدمة كما ستظهر..." : "Write the service as it should appear"}
              className={`${fieldClass} px-4`}
            />

            <KindSelect
              value={kind}
              isRtl={isRtl}
              onChange={(nextKind) => onUpdate(idx, { kind: nextKind })}
            />

            {kind === "free" ? (
              <div className="flex h-12 items-center justify-center rounded-[12px] bg-[#F4F4F4] px-3 text-xs font-bold text-[#8c8c8c]">
                {isRtl ? "بدون تكلفة" : "No cost"}
              </div>
            ) : (
              <div className={`${fieldClass} flex items-center gap-2 px-3`} dir="ltr">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountValue}
                  onChange={(e) => {
                    const parsed = parseAmount(e.target.value);
                    if (parsed === null) return;
                    onUpdate(idx, kind === "percent" ? { percent: parsed } : { price: parsed });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAdd();
                    }
                  }}
                  placeholder="0"
                  className="h-full min-w-0 flex-1 bg-transparent text-start text-sm font-bold tabular-nums outline-none placeholder:text-[#8c8c8c]"
                  aria-label={kind === "percent" ? (isRtl ? "النسبة" : "Percent") : isRtl ? "السعر" : "Price"}
                />
                <span className="shrink-0 text-[11px] font-bold text-[#8c8c8c]">{suffix}</span>
              </div>
            )}

            {services.length > 1 ? (
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="flex h-12 w-10 items-center justify-center rounded-full text-[#c4c4c4] transition-colors hover:bg-red-50 hover:text-red-500"
                title={isRtl ? "إزالة" : "Remove"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}
