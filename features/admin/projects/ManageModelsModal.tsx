"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, UploadCloud, Trash2, Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesService, type Property, type PropertyModel } from "@/features/admin/projects/properties.service";
import toast from "react-hot-toast";

type ManageModelsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
};

export function ManageModelsModal({ isOpen, onClose, property }: ManageModelsModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      propertyType: "",
      defaultPrice: "",
      roomsCount: 1,
      bathroomsCount: 1,
    },
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{ file: File; preview: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      reset();
      setImageFile(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 700 * 1024) {
        return toast.error("حجم الصورة يتجاوز 700 كيلوبايت");
      }
      setImageFile({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!property) return;
      
      let blueprintImage = "";
      if (imageFile) {
        blueprintImage = await propertiesService.uploadImage(imageFile.file, `properties/${property.id}/models`);
      }

      const model: PropertyModel = {
        id: crypto.randomUUID(),
        name: data.name,
        propertyType: data.propertyType,
        defaultPrice: Number(data.defaultPrice) || 0,
        roomsCount: Number(data.roomsCount),
        bathroomsCount: Number(data.bathroomsCount),
        blueprintImage,
      };

      await propertiesService.addModel(property.id, model);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("تم إضافة النموذج بنجاح");
      reset();
      setImageFile(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (model: PropertyModel) => {
      if (!property) return;
      await propertiesService.removeModel(property.id, model);
    },
    onMutate: (model) => {
      setDeletingId(model.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("تم حذف النموذج بنجاح");
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ");
      setDeletingId(null);
    },
  });

  const onSubmit = (data: any) => {
    if (!property) return;
    if (currentCount >= maxCount) {
      return toast.error(`عذراً، لقد وصلت للحد الأقصى (${maxCount}) للنماذج المسموح بها لهذا المشروع.`);
    }
    if (!data.name) return toast.error("يرجى إدخال اسم النموذج");
    addMutation.mutate(data);
  };

  if (!property) return null;

  const currentCount = property.models?.length || 0;
  const maxCount = property.modelsCount || 1;
  const isMaxReached = currentCount >= maxCount;

  const inputClass = "h-12 w-full rounded-[12px] bg-white px-4 text-sm font-medium text-[#0a0f1d] outline-none border border-[#0a0f1d]/10 focus:border-[#0a0f1d]/30 transition-colors disabled:opacity-50 disabled:bg-gray-100";
  const labelClass = "mb-2 block text-sm font-bold text-[#0a0f1d]";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-[#F4F4F4] shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                  قوالب النماذج: {property.name}
                </h2>
                <p className="mt-1 text-sm font-bold text-[#8c8c8c]">
                  النماذج المضافة: {currentCount} من أصل {maxCount}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar sm:px-8">
              
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="mb-8 rounded-[20px] bg-[#EAEAEA]/60 p-6">
                <h3 className="mb-5 text-base font-bold text-[#0a0f1d]">بيانات النموذج (القالب)</h3>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className={labelClass}>اسم النموذج</label>
                    <input {...register("name")} placeholder="مثال: نموذج A" className={inputClass} disabled={isMaxReached} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClass}>نوع العقار</label>
                    <input {...register("propertyType")} placeholder="شقة سكنية" className={inputClass} disabled={isMaxReached} />
                  </div>
                  
                  <div>
                    <label className={labelClass}>الغرف</label>
                    <input type="number" min="1" {...register("roomsCount")} className={inputClass} disabled={isMaxReached} />
                  </div>
                  <div>
                    <label className={labelClass}>دورات المياه</label>
                    <input type="number" min="1" {...register("bathroomsCount")} className={inputClass} disabled={isMaxReached} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>السعر الافتراضي</label>
                    <input type="number" min="0" {...register("defaultPrice")} placeholder="السعر بالريال" className={inputClass} disabled={isMaxReached} />
                  </div>

                  <div className="sm:col-span-2 mt-2">
                    <label className={labelClass}>صورة المخطط للنموذج</label>
                    {!imageFile ? (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#0a0f1d]/20 bg-white py-8 transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#F9F9F9]">
                        <UploadCloud className="mb-2 h-8 w-8 text-[#8c8c8c]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">رفع الصورة</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={addMutation.isPending || isMaxReached}
                        />
                      </label>
                    ) : (
                      <div className="group relative h-32 w-48 overflow-hidden rounded-[12px] bg-white border border-[#0a0f1d]/10">
                        <img src={imageFile.preview} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageFile(null)}
                          className="absolute inset-0 flex items-center justify-center bg-white/60 text-red-500 opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100"
                        >
                          <Trash2 className="h-6 w-6" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={addMutation.isPending || isMaxReached}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-[#0a0f1d] border border-[#0a0f1d]/10 transition-colors hover:bg-[#F9F9F9] disabled:opacity-50"
                  >
                    {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isMaxReached ? "الحد الأقصى للنماذج" : "حفظ كنموذج جديد"}
                  </button>
                </div>
              </form>

              {/* Table */}
              <div className="rounded-[20px] border border-[#0a0f1d]/10 bg-white overflow-hidden">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#F4F4F4] text-[#8c8c8c]">
                    <tr>
                      <th className="px-6 py-4 font-bold">النموذج</th>
                      <th className="px-6 py-4 font-bold">التفاصيل</th>
                      <th className="px-6 py-4 font-bold">السعر الافتراضي</th>
                      <th className="px-6 py-4 font-bold w-24 text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0a0f1d]/5 font-bold text-[#0a0f1d]">
                    {(!property.models || property.models.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-base text-[#8c8c8c] font-medium">
                          لا توجد نماذج مضافة بعد.
                        </td>
                      </tr>
                    )}
                    {property.models?.map((model) => (
                      <tr key={model.id} className="transition-colors hover:bg-[#F9F9F9]">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-[#8c8c8c]">{model.propertyType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#8c8c8c] text-xs">
                            {model.roomsCount} غرف • {model.bathroomsCount} حمام
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {model.defaultPrice ? `${model.defaultPrice.toLocaleString()} ريال` : "غير محدد"}
                        </td>
                        <td className="px-6 py-4 text-left">
                          <button
                            onClick={() => deleteMutation.mutate(model)}
                            disabled={deletingId === model.id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === model.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
