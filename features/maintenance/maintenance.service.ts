import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";

const COLLECTION = "maintenance";
const DOC_ID = "settings";

export type MaintenanceSettings = {
  enabled: boolean;
  messageTitleAr: string;
  messageTitleEn: string;
  messageTextAr: string;
  messageTextEn: string;
};

export const DEFAULT_MAINTENANCE: MaintenanceSettings = {
  enabled: false,
  messageTitleAr: "",
  messageTitleEn: "",
  messageTextAr: "",
  messageTextEn: "",
};

function pick(value: string, fallback: string): string {
  return value.trim() || fallback.trim();
}

function mapSettings(data: Record<string, unknown> | undefined): MaintenanceSettings {
  const legacyTitle = String(data?.messageTitle || "").trim();
  const legacyText = String(data?.messageText || "").trim();
  return {
    enabled: data?.enabled === true,
    messageTitleAr: String(data?.messageTitleAr || "").trim() || legacyTitle,
    messageTitleEn: String(data?.messageTitleEn || "").trim(),
    messageTextAr: String(data?.messageTextAr || "").trim() || legacyText,
    messageTextEn: String(data?.messageTextEn || "").trim(),
  };
}

export function resolveMaintenanceCopy(
  settings: MaintenanceSettings,
  locale: Locale,
  fallbacks: { title: string; text: string }
): { title: string; text: string } {
  const isAr = locale === "ar";
  const title = pick(
    isAr ? settings.messageTitleAr : settings.messageTitleEn,
    isAr ? settings.messageTitleEn : settings.messageTitleAr
  );
  const text = pick(
    isAr ? settings.messageTextAr : settings.messageTextEn,
    isAr ? settings.messageTextEn : settings.messageTextAr
  );
  return {
    title: title || fallbacks.title,
    text: text || fallbacks.text,
  };
}

export const maintenanceService = {
  async getSettings(): Promise<MaintenanceSettings> {
    const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!snap.exists()) return DEFAULT_MAINTENANCE;
    return mapSettings(snap.data() as Record<string, unknown>);
  },

  async saveSettings(input: MaintenanceSettings): Promise<void> {
    await setDoc(
      doc(db, COLLECTION, DOC_ID),
      {
        enabled: input.enabled,
        messageTitleAr: input.messageTitleAr.trim(),
        messageTitleEn: input.messageTitleEn.trim(),
        messageTextAr: input.messageTextAr.trim(),
        messageTextEn: input.messageTextEn.trim(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  subscribe(onNext: (settings: MaintenanceSettings) => void): () => void {
    return onSnapshot(
      doc(db, COLLECTION, DOC_ID),
      (snap) => {
        onNext(snap.exists() ? mapSettings(snap.data() as Record<string, unknown>) : DEFAULT_MAINTENANCE);
      }
    );
  },
};
