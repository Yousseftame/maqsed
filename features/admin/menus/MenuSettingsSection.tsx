"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { MENU_ITEMS, type MenuCategory, type MenuItem } from "./data";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";

const CATEGORIES: MenuCategory[] = [
  "unitFeatures",
  "unitComponents",
  "projectFeatures",
  "services",
  "guarantees",
  "specialOffers",
  "nearbyLocations",
];

export function MenuSettingsSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  
  const [activeTab, setActiveTab] = useState<MenuCategory>("unitFeatures");
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [inputValue, setInputValue] = useState("");

  const activeItems = useMemo(
    () => items.filter((item) => item.category === activeTab),
    [items, activeTab]
  );

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: t("admin.menus.deleteTitle"),
      description: t("admin.menus.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = inputValue.trim();
    if (!value) return;

    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: activeTab,
      name: { en: value, ar: value }, // In a real app, you might want inputs for both languages
    };

    setItems((current) => [...current, newItem]);
    setInputValue("");
  }

  return (
    <div className="flex flex-col gap-6 pt-4 sm:pt-6">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-2 sm:gap-4 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${
              activeTab === category
                ? "bg-[#0a0f1d] text-white"
                : "bg-white text-[#6B7280] hover:bg-gray-50"
            }`}
          >
            {t(`admin.menus.${category}`)}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
        
        {/* Add Input Form */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t("admin.menus.addPlaceholder")}
            className="flex-1 h-12 rounded-xl border border-gray-200 bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d] focus:bg-white placeholder:text-[#8c8c8c]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#161c2d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            {t("admin.menus.addButton")}
          </button>
        </form>

        {/* Items Grid */}
        {activeItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#F9F9F9] p-3 transition-colors hover:border-gray-200 hover:bg-gray-50"
              >
                <span className="text-sm font-semibold text-[#0a0f1d] truncate">
                  {item.name[locale]}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {t("admin.ui.empty")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
