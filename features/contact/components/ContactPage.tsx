"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { ArrowUpRight, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { requestsService } from "@/features/admin/customers/requests.service";

const subjects = ["general", "buy", "sell", "partnership", "support"];

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

const contactDetails = [
  {
    icon: Mail,
    label: "email",
    value: "marketing@maqsed.com",
    href: "mailto:marketing@maqsed.com",
  },
  {
    icon: Phone,
    label: "phone",
    value: "(+34) 123-456-789",
    href: "tel:+34123456789",
  },
  {
    icon: MapPin,
    label: "office",
    value: "2223 Calle De Alcalá, Madrid",
    href: undefined,
  },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactPage() {
  const { t, locale, isRtl } = useLocale();
  const [subject, setSubject] = useState(subjects[0]);
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
      await requestsService.addContactRequest({
        ...form,
        subject,
      });
      toast.success(t("contactPage.form.success"));
      setForm(initialForm);
      setSubject(subjects[0]);
    } catch (error) {
      console.error("Error submitting contact request:", error);
      toast.error(t("admin.ui.error") || "Error submitting request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex w-full flex-col bg-white ${isRtl ? "text-right" : "text-left"}`}>
      <section className="relative overflow-hidden bg-[#3E1854] rounded-b-[2.5rem] md:rounded-b-[3.5rem] lg:rounded-b-[4rem] px-6 pb-28 pt-20 md:px-12 lg:px-20 lg:pb-32 lg:pt-28">
        
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

        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-14 lg:flex-row lg:items-end lg:justify-between z-10">
          <div className="max-w-3xl">
            <h1 className="flex flex-col items-start text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              <DiaTextReveal
                key={`contact-title1-${locale}`}
                text={t("contactPage.hero.title1")}
                textColor="#ffffff"
                colors={["#ffffff"]}
                startOnView={false}
              />
              <DiaTextReveal
                key={`contact-title2-${locale}`}
                text={t("contactPage.hero.title2")}
                textColor="#ffffff"
                colors={["#ffffff"]}
                startOnView={false}
                delay={0.15}
              />
            </h1>
            <p className="mt-8 max-w-lg text-lg font-semibold leading-snug tracking-normal text-[#8c8c8c]">
              {t("contactPage.hero.description")}
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            {contactDetails.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Icon className="h-4 w-4 text-[#17C3B3]" strokeWidth={2} />
                    <span className="text-sm font-medium tracking-wide">
                      {t(`contactPage.contactDetails.${label}`)}
                    </span>
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    {value}
                  </span>
                </>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  className="flex flex-col gap-1.5 transition-opacity duration-300 hover:opacity-70 lg:items-end"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="flex flex-col gap-1.5 lg:items-end">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-6 pb-24 md:px-12 lg:px-20 lg:pb-32">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white px-6 py-10 shadow-[0_20px_60px_rgba(10,15,29,0.08)] sm:px-10 sm:py-12 lg:px-14">
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#8c8c8c]">
              {t("contactPage.form.pill")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#6A2B92] sm:text-4xl">
              {t("contactPage.form.title")}
            </h2>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-snug text-[#8c8c8c]">
              {t("contactPage.form.description")}
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
                {t("contactPage.form.subject")}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {subjects.map((item) => {
                  const active = subject === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSubject(item)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                        active
                          ? "border-[#6A2B92] bg-[#6A2B92] text-white"
                          : "border-gray-200 bg-white text-[#6A2B92] hover:border-[#6A2B92]"
                      }`}
                    >
                      {t(`contactPage.subjects.${item}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Field label={t("contactPage.form.fullName")}>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={inputClass}
                  placeholder={t("contactPage.form.fullNamePlaceholder")}
                />
              </Field>
              <Field label={t("contactPage.form.email")}>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder={t("contactPage.form.emailPlaceholder")}
                />
              </Field>
              <Field label={t("contactPage.form.phone")} className="sm:col-span-2">
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value.replace(/[^\d+]/g, ""))}
                  className={inputClass}
                  placeholder={t("contactPage.form.phonePlaceholder")}
                  dir="ltr"
                />
              </Field>
              <Field label={t("contactPage.form.message")} className="sm:col-span-2">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${inputClass} resize-none leading-relaxed`}
                  placeholder={t("contactPage.form.messagePlaceholder")}
                />
              </Field>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm font-medium leading-snug text-[#8c8c8c]">
                {t("contactPage.form.agreement")}
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
                    {t("contactPage.form.submit")}
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
