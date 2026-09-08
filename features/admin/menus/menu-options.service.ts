import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";
import {
  DEFAULT_MENU_OPTIONS,
  PROJECT_CATEGORIES,
  UNIT_CATEGORIES,
  type MenuCategoryKey,
  type MenuOption,
  type MenuOptionInput,
  type MenuScope,
} from "./data";

const COLLECTION = "menuOptions";
const META_ID = "_meta";
const CATEGORY_KEYS = new Set<string>([...PROJECT_CATEGORIES, ...UNIT_CATEGORIES]);

function pick(value: string, fallback: string): string {
  return value.trim() || fallback.trim();
}

function sortItems(items: MenuOption[]): MenuOption[] {
  return [...items].sort((a, b) => {
    if (a.scope !== b.scope) return a.scope.localeCompare(b.scope);
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.order !== b.order) return a.order - b.order;
    return a.labelAr.localeCompare(b.labelAr, "ar");
  });
}

function mapItem(id: string, data: Record<string, unknown>, fallbackOrder: number): MenuOption | null {
  if (id === META_ID) return null;
  const scope = data.scope === "unit" ? "unit" : data.scope === "project" ? "project" : null;
  const category = String(data.category || "") as MenuCategoryKey;
  if (!scope || !CATEGORY_KEYS.has(category)) return null;

  const labelAr = String(data.labelAr || "").trim();
  const labelEn = String(data.labelEn || "").trim();
  const value = String(data.value || id).trim() || id;

  return {
    id,
    scope,
    category,
    value,
    labelAr,
    labelEn,
    order: typeof data.order === "number" ? data.order : fallbackOrder,
  };
}

export function resolveMenuLabel(value: string, locale: Locale, items: MenuOption[]): string {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const match =
    items.find((item) => item.value === raw) ||
    items.find((item) => item.id === raw) ||
    items.find((item) => item.labelAr === raw || item.labelEn === raw);

  if (!match) return raw;
  const isAr = locale === "ar";
  return pick(isAr ? match.labelAr : match.labelEn, isAr ? match.labelEn : match.labelAr) || raw;
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => asStringArray(entry));
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function looksLikeDocId(value: string) {
  return /^[A-Za-z0-9]{16,}$/.test(value);
}

export function menuOptionAliases(item: MenuOption): string[] {
  return [item.id, item.value, item.labelAr, item.labelEn]
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);
}

export function findMenuOption(raw: string, items: MenuOption[]): MenuOption | undefined {
  const value = String(raw || "").trim();
  if (!value) return undefined;
  const lower = value.toLowerCase();
  return (
    items.find((item) => item.value === value) ||
    items.find((item) => item.id === value) ||
    items.find((item) => item.labelAr === value || item.labelEn === value) ||
    items.find((item) => menuOptionAliases(item).some((alias) => alias.toLowerCase() === lower))
  );
}

export function canonicalizeMenuValue(item: MenuOption): string {
  return String(item.value || item.id).trim();
}

export function isMenuValueSelected(item: MenuOption, values: unknown): boolean {
  const selected = new Set(asStringArray(values).map((entry) => entry.toLowerCase()));
  return menuOptionAliases(item).some((alias) => selected.has(alias.toLowerCase()));
}

function sharesMenuAlias(left: MenuOption, right: MenuOption) {
  const aliases = new Set(menuOptionAliases(left).map((alias) => alias.toLowerCase()));
  return menuOptionAliases(right).some((alias) => aliases.has(alias.toLowerCase()));
}

export function toggleMenuValue(item: MenuOption, values: unknown, catalog: MenuOption[] = []): string[] {
  const related = [item, ...catalog.filter((candidate) => candidate.id !== item.id && sharesMenuAlias(item, candidate))];
  const aliases = new Set(related.flatMap((entry) => menuOptionAliases(entry)).map((alias) => alias.toLowerCase()));
  const selected = asStringArray(values).some((entry) => aliases.has(entry.toLowerCase()));
  const next = asStringArray(values).filter((entry) => !aliases.has(entry.toLowerCase()));
  if (!selected) next.push(canonicalizeMenuValue(item));
  return next;
}

export function normalizeMenuValues(values: unknown, items: MenuOption[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of asStringArray(values)) {
    const match = findMenuOption(raw, items);
    if (match) {
      const canonical = canonicalizeMenuValue(match);
      const dedupeKey = (match.labelAr || match.labelEn || canonical).trim().toLowerCase();
      if (!canonical || seen.has(canonical) || seen.has(dedupeKey)) continue;
      seen.add(canonical);
      seen.add(dedupeKey);
      result.push(canonical);
      continue;
    }
    if (looksLikeDocId(raw)) continue;
    if (seen.has(raw) || seen.has(raw.toLowerCase())) continue;
    seen.add(raw);
    seen.add(raw.toLowerCase());
    result.push(raw);
  }

  return result;
}

async function seedDefaults(): Promise<void> {
  const batch = writeBatch(db);
  const counts: Partial<Record<MenuCategoryKey, number>> = {};

  DEFAULT_MENU_OPTIONS.forEach((item) => {
    const order = counts[item.category] ?? 0;
    counts[item.category] = order + 1;
    batch.set(doc(db, COLLECTION, item.id), {
      scope: item.scope,
      category: item.category,
      value: item.value,
      labelAr: item.labelAr,
      labelEn: item.labelEn,
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  batch.set(doc(db, COLLECTION, META_ID), {
    seeded: true,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

export const menuOptionsService = {
  async getItems(): Promise<MenuOption[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    const items = snap.docs
      .map((item, index) => mapItem(item.id, item.data() as Record<string, unknown>, index))
      .filter((item): item is MenuOption => Boolean(item));

    const hasMeta = snap.docs.some((item) => item.id === META_ID);
    if (!hasMeta && items.length === 0) {
      try {
        await seedDefaults();
        const seeded = await getDocs(collection(db, COLLECTION));
        return sortItems(
          seeded.docs
            .map((item, index) => mapItem(item.id, item.data() as Record<string, unknown>, index))
            .filter((item): item is MenuOption => Boolean(item))
        );
      } catch (error) {
        console.error("Error seeding menu options:", error);
        return items;
      }
    }

    return sortItems(items);
  },

  async addItem(scope: MenuScope, category: MenuCategoryKey, order: number, input: MenuOptionInput): Promise<string> {
    const docRef = doc(collection(db, COLLECTION));
    await setDoc(docRef, {
      scope,
      category,
      labelAr: input.labelAr.trim(),
      labelEn: input.labelEn.trim(),
      value: docRef.id,
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async deleteItem(id: string): Promise<void> {
    if (id === META_ID) return;
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
