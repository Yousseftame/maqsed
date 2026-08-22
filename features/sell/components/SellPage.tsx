"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { requestsService } from "@/features/admin/customers/requests.service";

const propertyTypes = [
  "apartment",
  "villa",
  "townhouse",
  "penthouse",
  "office",
  "land",
  "other",
];

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label className={`flex flex-col gap-3 ${className}`}>
    <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
      {label}
    </span>
    {children}
  </label>
);

const inputClass =
  "w-full bg-transparent border-b-2 border-[#8c8c8c]/40 pb-3 text-lg font-semibold text-[#0a0f1d] outline-none transition-colors duration-300 placeholder:text-gray-400 focus:border-[#6A2B92]";

const initialForm = {
  role: "Property Owner",
  unitLocation: "Independent (Villa/Building...)",
  city: "",
  neighborhood: "",
  googleMapsLink: "",
  roomsCount: "",
  bathroomsCount: "",
  propertyAge: "",
  additionalFeatures: "",
  fullNameAlt: "",
  mobileNumber: "",
};

export function SellPage() {
  const { t, locale, isRtl } = useLocale();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await requestsService.addSellRequest(form);
      toast.success(t("sellPage.form.success"));
      setForm(initialForm);
    } catch (error) {
      console.error("Error submitting sell request:", error);
      toast.error(t("admin.ui.error") || "Error submitting request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex w-full flex-col bg-white ${isRtl ? "text-right" : "text-left"}`}>
      <section className="relative overflow-hidden bg-[#3E1854] rounded-b-[2.5rem] md:rounded-b-[3.5rem] lg:rounded-b-[4rem] px-6 pb-24 pt-20 md:px-12 lg:px-20 lg:pb-28 lg:pt-28">
        
        {/* Background Pattern */}
        <div 
          className={`absolute inset-0 w-full h-full z-0 opacity-15 mix-blend-overlay pointer-events-none ${!isRtl ? "scale-x-[-1]" : ""}`}
          style={{
            backgroundImage: "url('/Gemini_Generated_Image_kax3jnkax3jnkax3.jpg')",
            backgroundSize: "70%",
            backgroundRepeat: "repeat",
            backgroundPosition: "left top"
          }}
        />

        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start lg:items-center lg:text-center z-10">
          <h1 className="flex max-w-4xl flex-col items-start text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:items-center lg:text-7xl">
            <DiaTextReveal
              key={`sell-title1-${locale}`}
              text={t("sellPage.hero.title1")}
              textColor="#ffffff"
              colors={["#ffffff"]}
              startOnView={false}
            />
            <DiaTextReveal
              key={`sell-title2-${locale}`}
              text={t("sellPage.hero.title2")}
              textColor="#ffffff"
              colors={["#ffffff"]}
              startOnView={false}
              delay={0.15}
            />
          </h1>

          <p className="mt-8 max-w-xl text-lg font-semibold leading-snug tracking-normal text-[#8c8c8c] lg:text-center">
            {t("sellPage.hero.description")}
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-6 pb-24 md:px-12 lg:px-20 lg:pb-32">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white px-6 py-10 shadow-[0_20px_60px_rgba(10,15,29,0.08)] sm:px-10 sm:py-12 lg:px-14">
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#8c8c8c]">
              {t("sellPage.form.pill")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#6A2B92] sm:text-4xl">
              {t("sellPage.form.title")}
            </h2>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-snug text-[#8c8c8c]">
              {t("sellPage.form.description")}
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Field label={t("sellPage.form.role")}>
                <div className="relative">
                  <select
                    required
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    className={`${inputClass} appearance-none pr-8`}
                  >
                    {(isRtl ? ["مالك العقار", "وكيل"] : ["Property Owner", "Agent"]).map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6A2B92]">
                    ▾
                  </span>
                </div>
              </Field>

              <Field label={t("sellPage.form.unitLocation")}>
                <div className="relative">
                  <select
                    required
                    value={form.unitLocation}
                    onChange={(e) => update("unitLocation", e.target.value)}
                    className={`${inputClass} appearance-none pr-8`}
                  >
                    {(isRtl ? ["مستقل (فيلا / عمارة...)", "ضمن مبنى"] : ["Independent (Villa/Building...)", "Within a building"]).map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6A2B92]">
                    ▾
                  </span>
                </div>
              </Field>

              <Field label={t("sellPage.form.city")}>
                <input
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                  placeholder={t("sellPage.form.cityPlaceholder")}
                />
              </Field>

              <Field label={t("sellPage.form.neighborhood")}>
                <input
                  required
                  value={form.neighborhood}
                  onChange={(e) => update("neighborhood", e.target.value)}
                  className={inputClass}
                  placeholder={t("sellPage.form.neighborhoodPlaceholder")}
                />
              </Field>

              <Field label={t("sellPage.form.googleMapsLink")} className="sm:col-span-2">
                <input
                  required
                  type="url"
                  value={form.googleMapsLink}
                  onChange={(e) => update("googleMapsLink", e.target.value)}
                  className={inputClass}
                  placeholder={t("sellPage.form.googleMapsPlaceholder")}
                  dir="ltr"
                />
              </Field>

              <Field label={t("sellPage.form.roomsCount")}>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.roomsCount}
                  onChange={(e) => update("roomsCount", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label={t("sellPage.form.bathroomsCount")}>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.bathroomsCount}
                  onChange={(e) => update("bathroomsCount", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label={t("sellPage.form.propertyAge")}>
                <input
                  required
                  value={form.propertyAge}
                  onChange={(e) => update("propertyAge", e.target.value)}
                  className={inputClass}
                  placeholder={t("sellPage.form.propertyAgePlaceholder")}
                />
              </Field>

              <Field label={t("sellPage.form.additionalFeatures")}>
                <input
                  required
                  value={form.additionalFeatures}
                  onChange={(e) => update("additionalFeatures", e.target.value)}
                  className={inputClass}
                  placeholder={t("sellPage.form.additionalFeaturesPlaceholder")}
                />
              </Field>
            </div>

            <hr className="my-6 border-gray-300" />

            <div className="flex flex-col gap-8">
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-[#3E1854]">{t("sellPage.form.contactInfo")}</h3>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Field label={t("sellPage.form.fullNameAlt")}>
                  <input
                    required
                    value={form.fullNameAlt}
                    onChange={(e) => update("fullNameAlt", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label={t("sellPage.form.mobileNumber")}>
                  <input
                    required
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) => update("mobileNumber", e.target.value.replace(/[^\d+]/g, ""))}
                    className={inputClass}
                    placeholder={t("sellPage.form.mobileNumberPlaceholder")}
                    dir="ltr"
                  />
                </Field>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm font-medium leading-snug text-[#8c8c8c]">
                {t("sellPage.form.agreement")}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#17C3B3] px-7 py-4 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {t("sellPage.form.submit")}
                    <ArrowUpRight className={cn("h-4 w-4 transition-transform duration-300", isRtl ? "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 rotate-[-90deg]" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
