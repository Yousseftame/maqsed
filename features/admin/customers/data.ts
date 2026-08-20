import type { StatusTone } from "@/features/admin/ui/StatusBadge";

export type RequestType = "purchase" | "sell" | "complaint";
export type RequestStatus = "new" | "contacted" | "completed" | "cancelled";

export type CustomerRequest = {
  id: string;
  customerName: { en: string; ar: string };
  customerPhone: string;
  unit: string;
  type: RequestType;
  status: RequestStatus;
  date: { en: string; ar: string };
};

export const REQUEST_STATUS_TONE: Record<RequestStatus, StatusTone> = {
  new: "accent",
  contacted: "warning",
  completed: "success",
  cancelled: "danger",
};

export const REQUEST_TYPE_TONE: Record<RequestType, StatusTone> = {
  purchase: "default",
  sell: "default",
  complaint: "danger",
};

export const CUSTOMER_REQUESTS: CustomerRequest[] = [
  {
    id: "1",
    customerName: { en: "Abdulrahman Al-Majed", ar: "عبدالرحمن الماجد" },
    customerPhone: "0555555555",
    unit: "A-101",
    type: "purchase",
    status: "new",
    date: { en: "15 Aug 2026", ar: "١٥ أغسطس ٢٠٢٦" },
  },
  {
    id: "2",
    customerName: { en: "Sarah Al-Abdullah", ar: "سارة العبدالله" },
    customerPhone: "0500000000",
    unit: "V-22",
    type: "sell",
    status: "contacted",
    date: { en: "14 Aug 2026", ar: "١٤ أغسطس ٢٠٢٦" },
  },
  {
    id: "3",
    customerName: { en: "Fahad Al-Tamimi", ar: "فهد التميمي" },
    customerPhone: "0533333333",
    unit: "B-305",
    type: "complaint",
    status: "new",
    date: { en: "13 Aug 2026", ar: "١٣ أغسطس ٢٠٢٦" },
  },
  {
    id: "4",
    customerName: { en: "Noura Al-Dawsari", ar: "نورة الدوسري" },
    customerPhone: "0599999999",
    unit: "C-12",
    type: "purchase",
    status: "completed",
    date: { en: "10 Aug 2026", ar: "١٠ أغسطس ٢٠٢٦" },
  },
  {
    id: "5",
    customerName: { en: "Khalid Al-Rashed", ar: "خالد الراشد" },
    customerPhone: "0566666666",
    unit: "D-401",
    type: "sell",
    status: "cancelled",
    date: { en: "05 Aug 2026", ar: "٠٥ أغسطس ٢٠٢٦" },
  },
  {
    id: "6",
    customerName: { en: "Mohammed Al-Saud", ar: "محمد السعود" },
    customerPhone: "0544444444",
    unit: "A-01",
    type: "purchase",
    status: "new",
    date: { en: "02 Aug 2026", ar: "٠٢ أغسطس ٢٠٢٦" },
  },
];
