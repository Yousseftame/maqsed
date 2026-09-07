"use client";

import { Plus, Trash2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

export type ProjectGalleryImage = {
  file: File | null;
  preview: string;
};

type ProjectImageGalleryProps = {
  images: ProjectGalleryImage[];
  onChange: (images: ProjectGalleryImage[]) => void;
  disabled?: boolean;
  variant?: "photos" | "logos";
};

const MAX_SIZE = 700 * 1024;

export function ProjectImageGallery({ images, onChange, disabled, variant = "photos" }: ProjectImageGalleryProps) {
  const isLogos = variant === "logos";
  const handleFiles = (fileList: FileList | null, input?: HTMLInputElement) => {
    if (!fileList || disabled) return;

    const validFiles = Array.from(fileList).filter((file) => {
      if (file.size > MAX_SIZE) {
        toast.error(`حجم الصورة ${file.name} يتجاوز 700 كيلوبايت`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onChange([
        ...images,
        ...validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ]);
    }

    if (input) input.value = "";
  };

  const removeImage = (index: number) => {
    const image = images[index];
    if (image.preview.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }
    onChange(images.filter((_, i) => i !== index));
  };

  const setAsThumbnail = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <div>
      <p className="mb-4 text-sm font-medium text-[#8c8c8c]">
        {isLogos
          ? "اختياري — يمكنك رفع أكثر من شعار لشركاء النجاح."
          : "يمكنك رفع أكثر من صورة. الصورة الأولى ستكون صورة الغلاف (Thumbnail) في القائمة."}
      </p>

      {images.length === 0 ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#0a0f1d]/20 bg-[#F4F4F4] py-14 transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#EAEAEA]">
          <UploadCloud className="mb-4 h-10 w-10 text-[#8c8c8c]" />
          <p className="mb-1 text-base font-bold text-[#0a0f1d]">
            {isLogos ? "اضغط هنا لرفع شعارات الشركاء" : "اضغط هنا لرفع صور المعرض"}
          </p>
          <p className="text-sm font-medium text-[#8c8c8c]">
            {isLogos
              ? "يفضّل شعار بخلفية شفافة أو بيضاء | الحد الأقصى: 700KB | يمكن اختيار أكثر من صورة"
              : "المقاس: 1200x800 بكسل (نسبة 3:2) | الحد الأقصى: 700KB | يمكن اختيار أكثر من صورة"}
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(e) => handleFiles(e.target.files, e.target)}
          />
        </label>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.preview}
              className={`group relative overflow-hidden rounded-[16px] bg-white ring-1 ring-[#0a0f1d]/10 ${isLogos ? "aspect-square" : "aspect-[3/2] bg-[#F4F4F4]"}`}
            >
              <img
                src={img.preview}
                alt=""
                className={`h-full w-full ${isLogos ? "object-contain p-3" : "object-cover"}`}
              />

              {!isLogos && index === 0 && (
                <span className="absolute bottom-2 start-2 rounded-full bg-[#0a0f1d] px-2.5 py-1 text-[10px] font-bold text-white">
                  الغلاف
                </span>
              )}

              {!isLogos && index !== 0 && (
                <button
                  type="button"
                  onClick={() => setAsThumbnail(index)}
                  disabled={disabled}
                  className="absolute bottom-2 start-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0a0f1d] shadow backdrop-blur transition-colors hover:bg-white disabled:opacity-50"
                >
                  تعيين كغلاف
                </button>
              )}

              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow backdrop-blur transition-colors hover:bg-white hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <label className={`flex cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#0a0f1d]/20 bg-[#F4F4F4] text-[#8c8c8c] transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#EAEAEA] hover:text-[#0a0f1d] ${isLogos ? "aspect-square" : "aspect-[3/2]"}`}>
            <Plus className="mb-1 h-6 w-6" />
            <span className="text-xs font-bold">{isLogos ? "إضافة شعار" : "إضافة صور"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={disabled}
              onChange={(e) => handleFiles(e.target.files, e.target)}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export function revokeGalleryPreviews(images: ProjectGalleryImage[]) {
  images.forEach((img) => {
    if (img.preview.startsWith("blob:")) {
      URL.revokeObjectURL(img.preview);
    }
  });
}
