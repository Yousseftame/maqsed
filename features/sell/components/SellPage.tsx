"use client";

import { useState, type FormEvent } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useToast } from "@/components/providers/ToastProvider";
import { ArrowUpRight } from "lucide-react";

const propertyTypes = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Office",
  "Land",
  "Other",
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
  "w-full bg-transparent border-b-2 border-[#8c8c8c]/40 pb-3 text-lg font-semibold text-[#0a0f1d] outline-none transition-colors duration-300 placeholder:text-[#0a0f1d]/30 focus:border-[#0a0f1d]";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  propertyType: "Apartment",
  city: "",
  address: "",
  bedrooms: "",
  size: "",
  price: "",
  notes: "",
};

export function SellPage() {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    toast({
      title: "Request received",
      description: "A MAQSED specialist will contact you about marketing your unit.",
    });
    setForm(initialForm);
  };

  return (
    <div className="flex w-full flex-col bg-white">
      <section className="relative overflow-hidden bg-[#0a0f1d] px-6 pb-24 pt-20 md:px-12 lg:px-20 lg:pb-28 lg:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(5rem,16vw,14rem)] font-bold leading-none tracking-tighter text-white/[0.04]"
        >
          SELL
        </div>

        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start lg:items-center lg:text-center">
          <h1 className="flex max-w-4xl flex-col items-start text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:items-center lg:text-7xl">
            <DiaTextReveal
              text="Market your property"
              textColor="#ffffff"
              colors={["#ffffff"]}
              startOnView={false}
            />
            <DiaTextReveal
              text="with confidence."
              textColor="#ffffff"
              colors={["#ffffff"]}
              startOnView={false}
              delay={0.15}
            />
          </h1>

          <p className="mt-8 max-w-xl text-lg font-semibold leading-snug tracking-normal text-[#8c8c8c] lg:text-center">
            Submit your unit details and let MAQSED handle professional marketing,
            qualified buyers, and a clear path to closing.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-6 pb-24 md:px-12 lg:px-20 lg:pb-32">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white px-6 py-10 shadow-[0_20px_60px_rgba(10,15,29,0.08)] sm:px-10 sm:py-12 lg:px-14">
          <div className="mb-10 border-b border-gray-100 pb-8">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#8c8c8c]">
              Request Form
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#0a0f1d] sm:text-4xl">
              Property Marketing / Sale Request
            </h2>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-snug text-[#8c8c8c]">
              Share a few details about your unit. Our team will review your request
              and follow up with the next steps.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Field label="Full Name">
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={inputClass}
                  placeholder="Your full name"
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+966 ..."
                />
              </Field>
              <Field label="Property Type">
                <div className="relative">
                  <select
                    required
                    value={form.propertyType}
                    onChange={(e) => update("propertyType", e.target.value)}
                    className={`${inputClass} appearance-none pr-8`}
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#0a0f1d]">
                    ▾
                  </span>
                </div>
              </Field>
              <Field label="City">
                <input
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                  placeholder="Riyadh"
                />
              </Field>
              <Field label="Property Address">
                <input
                  required
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className={inputClass}
                  placeholder="Street, district, building"
                />
              </Field>
              <Field label="Bedrooms">
                <input
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 3"
                />
              </Field>
              <Field label="Size (sq ft)">
                <input
                  value={form.size}
                  onChange={(e) => update("size", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 1,850"
                />
              </Field>
              <Field label="Expected Price" className="sm:col-span-2">
                <input
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className={inputClass}
                  placeholder="SAR 1,000,000"
                />
              </Field>
              <Field label="Additional Notes" className="sm:col-span-2">
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className={`${inputClass} resize-none leading-relaxed`}
                  placeholder="Tell us anything that helps market your unit..."
                />
              </Field>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm font-medium leading-snug text-[#8c8c8c]">
                By submitting, you agree to be contacted by MAQSED about your
                sale request.
              </p>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0a0f1d] px-7 py-4 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#0a0f1d] hover:ring-1 hover:ring-[#0a0f1d]/15 active:scale-[0.98]"
              >
                Submit Request
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
