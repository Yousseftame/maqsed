"use client";

import { Trash2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import type { ProjectGalleryImage } from "./ProjectImageGallery";
import { revokeGalleryPreviews } from "./ProjectImageGallery";

type PartyLogoFieldProps = {
  label: string;
  logo: ProjectGalleryImage | null;
  onChange: (logo: ProjectGalleryImage | null) => void;
  disabled?: boolean;
};

const MAX_SIZE = 700 * 1024;

export function PartyLogoField({ label, logo, onChange, disabled }: PartyLogoFieldProps) {
  const handleFile = (fileList: FileList | null, input?: HTMLInputElement) => {
    if (!fileList?.[0] || disabled) return;
    const file = fileList[0];
    if (file.size > MAX_SIZE) {
      toast.error(`حجم الصورة ${file.name} يتجاوز 700 كيلوبايت`);
      if (input) input.value = "";
      return;
    }
    if (logo?.preview.startsWith("blob:")) {
      URL.revokeObjectURL(logo.preview);
    }
    onChange({ file, preview: URL.createObjectURL(file) });
    if (input) input.value = "";
  };

  const removeLogo = () => {
    if (logo?.preview.startsWith("blob:")) {
      URL.revokeObjectURL(logo.preview);
    }
    onChange(null);
  };

  return (
    <div>
      <span className="mb-2.5 block text-sm font-bold text-[#8c8c8c]">{label}</span>
      {!logo ? (
        <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#0a0f1d]/20 bg-[#F4F4F4] transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#EAEAEA]">
          <UploadCloud className="mb-1 h-6 w-6 text-[#8c8c8c]" />
          <span className="text-xs font-bold text-[#0a0f1d]">رفع الشعار</span>
          <span className="mt-0.5 text-[10px] font-medium text-[#8c8c8c]">الحد الأقصى: 700KB</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={(e) => handleFile(e.target.files, e.target)}
          />
        </label>
      ) : (
        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-[16px] border border-[#0a0f1d]/10 bg-white p-3">
          <img src={logo.preview} alt="" className="max-h-full max-w-full object-contain" />
          <button
            type="button"
            onClick={removeLogo}
            disabled={disabled}
            className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow backdrop-blur transition-colors hover:bg-white hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function logoFromUrl(url?: string | null): ProjectGalleryImage | null {
  if (!url) return null;
  return { file: null, preview: url };
}

export function revokeLogoPreview(logo: ProjectGalleryImage | null) {
  if (logo) revokeGalleryPreviews([logo]);
}

export async function resolveLogoUpload(
  logo: ProjectGalleryImage | null,
  folder: string,
  previousUrl: string | undefined,
  upload: (file: File, folder: string) => Promise<string>
): Promise<{ url: string; toDelete: string[] }> {
  if (logo?.file) {
    const url = await upload(logo.file, folder);
    return { url, toDelete: previousUrl ? [previousUrl] : [] };
  }
  if (logo?.preview) {
    return { url: logo.preview, toDelete: [] };
  }
  return { url: "", toDelete: previousUrl ? [previousUrl] : [] };
}
