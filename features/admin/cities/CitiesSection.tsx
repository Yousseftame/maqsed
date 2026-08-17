"use client";

import { useMemo, useState } from "react";
import { Layers, Map, Plus } from "lucide-react";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { TableAction } from "@/features/admin/ui/DataTable";
import { CITIES, type City } from "@/features/admin/cities/data";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function CitiesSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const [cities, setCities] = useState(CITIES);
  const [selectedCityId, setSelectedCityId] = useState(CITIES[0]?.id ?? "");
  const [cityName, setCityName] = useState("");
  const [neighborhoodName, setNeighborhoodName] = useState("");

  const label = (name: { en: string; ar: string }) => name[locale];
  const selectedCity = useMemo(
    () => cities.find((city) => city.id === selectedCityId) ?? null,
    [cities, selectedCityId]
  );
  const neighborhoodCount = cities.reduce(
    (sum, city) => sum + city.neighborhoods.length,
    0
  );

  function addCity() {
    const value = cityName.trim();
    if (!value) return;

    const id = `${value.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const next: City = {
      id,
      name: { en: value, ar: value },
      neighborhoods: [],
    };

    setCities((current) => [next, ...current]);
    setSelectedCityId(id);
    setCityName("");
  }

  function addNeighborhood() {
    const value = neighborhoodName.trim();
    if (!value || !selectedCityId) return;

    const id = `${value.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    setCities((current) =>
      current.map((city) =>
        city.id === selectedCityId
          ? {
              ...city,
              neighborhoods: [
                ...city.neighborhoods,
                { id, name: { en: value, ar: value } },
              ],
            }
          : city
      )
    );
    setNeighborhoodName("");
  }

  async function deleteCity(city: City) {
    const ok = await confirm({
      title: t("admin.cities.deleteTitle"),
      description: t("admin.cities.deleteDescription"),
      confirmLabel: t("admin.cities.deleteCity"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;

    setCities((current) => {
      const next = current.filter((item) => item.id !== city.id);
      setSelectedCityId((selected) =>
        selected === city.id ? (next[0]?.id ?? "") : selected
      );
      return next;
    });
  }

  function removeNeighborhood(neighborhoodId: string) {
    if (!selectedCityId) return;
    setCities((current) =>
      current.map((city) =>
        city.id === selectedCityId
          ? {
              ...city,
              neighborhoods: city.neighborhoods.filter(
                (item) => item.id !== neighborhoodId
              ),
            }
          : city
      )
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <StatGrid className="grid-cols-2 xl:grid-cols-2">
        <StatCard
          icon={Map}
          label={t("admin.nav.cities")}
          value={cities.length}
          className="p-4 sm:p-6"
        />
        <StatCard
          icon={Layers}
          label={t("admin.cities.neighborhoods")}
          value={neighborhoodCount}
          className="p-4 sm:p-6"
        />
      </StatGrid>

      <section className="min-w-0 overflow-hidden rounded-[24px] bg-white">
        <div className="grid lg:grid-cols-[minmax(240px,34%)_1fr]">
          <aside className="border-b border-[#0a0f1d]/8 p-4 lg:border-e lg:border-b-0 sm:p-6">
            <form
              className="mb-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                addCity();
              }}
            >
              <input
                value={cityName}
                onChange={(event) => setCityName(event.target.value)}
                placeholder={t("admin.cities.cityPlaceholder")}
                className="h-12 min-w-0 flex-1 rounded-full bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c] sm:px-5"
              />
              <button
                type="submit"
                disabled={!cityName.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0a0f1d] text-white transition-colors hover:bg-[#161c2d] disabled:opacity-40"
                aria-label={t("admin.cities.addCity")}
              >
                <Plus className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </form>

            {cities.length === 0 ? (
              <p className="px-2 py-8 text-sm font-medium text-[#8c8c8c]">
                {t("admin.cities.emptyCities")}
              </p>
            ) : (
              <nav className="flex max-h-56 flex-col gap-1 overflow-y-auto no-scrollbar lg:max-h-[min(32rem,calc(100vh-22rem))]">
                {cities.map((city) => {
                  const active = city.id === selectedCityId;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => setSelectedCityId(city.id)}
                      className={cn(
                        "w-full rounded-[16px] px-4 py-3 text-start transition-colors duration-200 lg:rounded-[20px] lg:p-4",
                        active
                          ? "bg-[#0a0f1d] text-white"
                          : "text-[#0a0f1d] hover:bg-[#F4F4F4]"
                      )}
                    >
                      <span className="block text-base font-bold tracking-tight lg:text-2xl">
                        {label(city.name)}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-xs font-medium lg:mt-1 lg:text-sm",
                          active ? "text-white/50" : "text-[#8c8c8c]"
                        )}
                      >
                        {city.neighborhoods.length} {t("admin.cities.neighborhoods")}
                      </span>
                    </button>
                  );
                })}
              </nav>
            )}
          </aside>

          <div className="flex min-h-0 flex-col p-4 sm:p-8 lg:min-h-[28rem]">
            {selectedCity ? (
              <>
                <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-semibold tracking-wide text-[#8c8c8c] sm:mb-2 sm:text-sm">
                      {t("admin.cities.neighborhoods")}
                    </p>
                    <h2 className="truncate text-2xl font-bold tracking-tight text-[#0a0f1d] sm:text-4xl lg:text-5xl">
                      {label(selectedCity.name)}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCity(selectedCity)}
                    className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-[#FFE8E4] px-4 text-sm font-bold text-[#FF6A55] transition-colors hover:bg-[#ffd7d1] sm:w-auto"
                  >
                    {t("admin.cities.deleteCity")}
                  </button>
                </div>

                <form
                  className="mb-5 flex gap-2 sm:mb-8"
                  onSubmit={(event) => {
                    event.preventDefault();
                    addNeighborhood();
                  }}
                >
                  <input
                    value={neighborhoodName}
                    onChange={(event) => setNeighborhoodName(event.target.value)}
                    placeholder={t("admin.cities.neighborhoodPlaceholder")}
                    className="h-12 min-w-0 flex-1 rounded-full bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c] sm:px-5"
                  />
                  <button
                    type="submit"
                    disabled={!neighborhoodName.trim()}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0a0f1d] text-white transition-colors hover:bg-[#161c2d] disabled:opacity-40 sm:w-auto sm:px-6"
                    aria-label={t("admin.cities.addNeighborhood")}
                  >
                    <Plus className="h-5 w-5 sm:hidden" strokeWidth={2.2} />
                    <span className="hidden text-sm font-bold sm:inline">
                      {t("admin.cities.addNeighborhood")}
                    </span>
                  </button>
                </form>

                {selectedCity.neighborhoods.length === 0 ? (
                  <div className="flex min-h-32 flex-1 items-center justify-center rounded-[20px] bg-[#F4F4F4] px-4 text-center text-sm font-medium text-[#8c8c8c]">
                    {t("admin.cities.emptyNeighborhoods")}
                  </div>
                ) : (
                  <ul>
                    {selectedCity.neighborhoods.map((neighborhood) => (
                      <li
                        key={neighborhood.id}
                        className="flex items-center justify-between gap-3 border-b border-[#0a0f1d]/8 py-4 last:border-b-0 sm:gap-4 sm:py-5"
                      >
                        <span className="min-w-0 truncate text-base font-semibold text-[#0a0f1d] sm:text-lg">
                          {label(neighborhood.name)}
                        </span>
                        <TableAction
                          label={t("admin.ui.delete")}
                          tone="danger"
                          onClick={() => removeNeighborhood(neighborhood.id)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="flex min-h-32 flex-1 items-center justify-center text-sm font-medium text-[#8c8c8c]">
                {t("admin.cities.emptyCities")}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
