"use client";

import { Plus, Trash2 } from "lucide-react";
import type { NearbyPlace } from "@/features/admin/projects/properties.service";

export type NearbyPlaceInput = {
  name: string;
  minutes: string;
};

type NearbyPlacesEditorProps = {
  places: NearbyPlaceInput[];
  onChange: (places: NearbyPlaceInput[]) => void;
  disabled?: boolean;
};

export function NearbyPlacesEditor({ places, onChange, disabled }: NearbyPlacesEditorProps) {
  const addPlace = () => {
    onChange([...places, { name: "", minutes: "" }]);
  };

  const updatePlace = (index: number, field: keyof NearbyPlaceInput, value: string) => {
    onChange(places.map((place, i) => (i === index ? { ...place, [field]: value } : place)));
  };

  const removePlace = (index: number) => {
    onChange(places.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="mb-2 text-lg font-bold tracking-tight text-[#0a0f1d]">الأماكن القريبة</h3>
      <p className="mb-5 text-sm font-medium text-[#8c8c8c]">
        اختياري — أضف اسم المكان وعدد الدقائق، مثل: المطار / 10
      </p>

      {places.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {places.map((place, index) => (
            <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px_auto]">
              <input
                type="text"
                value={place.name}
                onChange={(e) => updatePlace(index, "name", e.target.value)}
                placeholder="اسم المكان (مثال: المطار)"
                disabled={disabled}
                className="h-12 w-full rounded-[16px] bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors placeholder:text-[#8c8c8c] focus:bg-[#EAEAEA] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={place.minutes}
                  onChange={(e) => updatePlace(index, "minutes", e.target.value)}
                  placeholder="10"
                  disabled={disabled}
                  className="h-12 w-full rounded-[16px] bg-[#F4F4F4] pe-16 ps-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors placeholder:text-[#8c8c8c] focus:bg-[#EAEAEA] disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8c8c8c]">
                  دقيقة
                </span>
              </div>
              <button
                type="button"
                onClick={() => removePlace(index)}
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
        onClick={addPlace}
        disabled={disabled}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#EAEAEA] disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        إضافة مكان
      </button>
    </div>
  );
}

export function sanitizeNearbyPlaces(places: NearbyPlaceInput[]): NearbyPlace[] {
  return places
    .map((place) => {
      const name = place.name.trim();
      const minutesRaw = String(place.minutes ?? "").trim();
      const minutes = Number(minutesRaw);
      return { name, minutesRaw, minutes };
    })
    .filter((place) => place.name.length > 0 && place.minutesRaw !== "" && Number.isFinite(place.minutes) && place.minutes >= 0)
    .map((place) => ({ name: place.name, minutes: place.minutes }));
}
