"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesService, type Property, type Building } from "@/features/admin/projects/properties.service";
import toast from "react-hot-toast";

type ManageBuildingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
};

export function ManageBuildingsModal({ isOpen, onClose, property }: ManageBuildingsModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      code: "",
      floorsCount: 1,
      expectedUnitsCount: 1,
    },
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      reset();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, reset]);

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!property) return;
      const building: Building = {
        id: crypto.randomUUID(),
        code: data.code,
        floorsCount: Number(data.floorsCount),
        expectedUnitsCount: Number(data.expectedUnitsCount),
      };
      await propertiesService.addBuilding(property.id, building);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("تم إضافة المبنى بنجاح");
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (building: Building) => {
      if (!property) return;
      await propertiesService.removeBuilding(property.id, building);
    },
    onMutate: (building) => {
      setDeletingId(building.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("تم حذف المبنى بنجاح");
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
      return toast.error(`عذراً، لقد وصلت للحد الأقصى (${maxCount}) للمباني المسموح بها لهذا المشروع.`);
    }
    if (!data.code) return toast.error("يرجى إدخال رمز المبنى");
    
    const isDuplicate = property.buildings?.some(
      (b) => b.code.trim().toLowerCase() === data.code.trim().toLowerCase()
    );
    if (isDuplicate) {
      return toast.error("يوجد مبنى بهذا الرمز مسبقاً، يرجى اختيار رمز آخر");
    }

    addMutation.mutate(data);
  };

  if (!property) return null;

  const currentCount = property.buildings?.length || 0;
  const maxCount = property.buildingsCount || 1;
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
                  إدارة مباني: {property.name}
                </h2>
                <p className="mt-1 text-sm font-bold text-[#8c8c8c]">
                  المباني المضافة: {currentCount} من أصل {maxCount}
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
                <div className="flex flex-col items-end gap-4 sm:flex-row">
                  <div className="w-full">
                    <label className={labelClass}>المبنى (الرمز)</label>
                    <input {...register("code")} placeholder="مثال: A" className={inputClass} disabled={isMaxReached} />
                  </div>
                  <div className="w-full">
                    <label className={labelClass}>الأدوار</label>
                    <input type="number" min="1" {...register("floorsCount")} className={inputClass} disabled={isMaxReached} />
                  </div>
                  <div className="w-full">
                    <label className={labelClass}>الوحدات المتوقعة</label>
                    <input type="number" min="1" {...register("expectedUnitsCount")} className={inputClass} disabled={isMaxReached} />
                  </div>
                  <div className="w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={addMutation.isPending || isMaxReached}
                      className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-[#0a0f1d] border border-[#0a0f1d]/10 transition-colors hover:bg-[#F9F9F9] disabled:opacity-50 sm:w-auto"
                    >
                      {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      {isMaxReached ? "الحد الأقصى" : "إضافة"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Table */}
              <div className="rounded-[20px] border border-[#0a0f1d]/10 bg-white overflow-hidden">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#F4F4F4] text-[#8c8c8c]">
                    <tr>
                      <th className="px-6 py-4 font-bold">رمز المبنى</th>
                      <th className="px-6 py-4 font-bold">الأدوار</th>
                      <th className="px-6 py-4 font-bold">الوحدات المتوقعة</th>
                      <th className="px-6 py-4 font-bold w-24 text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0a0f1d]/5 font-bold text-[#0a0f1d]">
                    {(!property.buildings || property.buildings.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-base text-[#8c8c8c] font-medium">
                          لا توجد مباني مضافة بعد.
                        </td>
                      </tr>
                    )}
                    {property.buildings?.map((building) => (
                      <tr key={building.id} className="transition-colors hover:bg-[#F9F9F9]">
                        <td className="px-6 py-4">{building.code}</td>
                        <td className="px-6 py-4">{building.floorsCount}</td>
                        <td className="px-6 py-4">{building.expectedUnitsCount}</td>
                        <td className="px-6 py-4 text-left">
                          <button
                            onClick={() => deleteMutation.mutate(building)}
                            disabled={deletingId === building.id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === building.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
