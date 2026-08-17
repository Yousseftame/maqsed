"use client";

import { useState, type FormEvent } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import toast from "react-hot-toast";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const subjects = ["General Inquiry", "Buy a Unit", "Sell a Unit", "Partnership", "Support"];

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

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "marketing@maqsed.com",
    href: "mailto:marketing@maqsed.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(+34) 123-456-789",
    href: "tel:+34123456789",
  },
  {
    icon: MapPin,
    label: "Office",
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
  const [subject, setSubject] = useState(subjects[0]);
  const [form, setForm] = useState(initialForm);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    toast.success("Message sent");
    setForm(initialForm);
    setSubject(subjects[0]);
  };

  return (
    <div className="flex w-full flex-col bg-white">
      <section className="relative overflow-hidden bg-[#0a0f1d] px-6 pb-28 pt-20 md:px-12 lg:px-20 lg:pb-32 lg:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(5rem,18vw,15rem)] font-bold leading-none tracking-tighter text-white/[0.04]"
        >
          HELLO
        </div>

        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="flex flex-col items-start text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              <DiaTextReveal
                text="Let's start a"
                textColor="#ffffff"
                colors={["#ffffff"]}
                startOnView={false}
              />
              <DiaTextReveal
                text="conversation."
                textColor="#ffffff"
                colors={["#ffffff"]}
                startOnView={false}
                delay={0.15}
              />
            </h1>
            <p className="mt-8 max-w-lg text-lg font-semibold leading-snug tracking-normal text-[#8c8c8c]">
              Questions, opportunities, or next steps — send us a message and the
              MAQSED team will get back to you promptly.
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            {contactDetails.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    <span className="text-sm font-medium tracking-wide">{label}</span>
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
              Contact Form
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#0a0f1d] sm:text-4xl">
              Send us a message
            </h2>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-snug text-[#8c8c8c]">
              Choose a topic, leave your details, and tell us how we can help.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
                Subject
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
                          ? "border-[#0a0f1d] bg-[#0a0f1d] text-white"
                          : "border-gray-200 bg-white text-[#0a0f1d] hover:border-[#0a0f1d]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

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
              <Field label="Phone" className="sm:col-span-2">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+966 ..."
                />
              </Field>
              <Field label="Message" className="sm:col-span-2">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${inputClass} resize-none leading-relaxed`}
                  placeholder="How can we help you?"
                />
              </Field>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm font-medium leading-snug text-[#8c8c8c]">
                We typically respond within one business day.
              </p>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0a0f1d] px-7 py-4 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#0a0f1d] hover:ring-1 hover:ring-[#0a0f1d]/15 active:scale-[0.98]"
              >
                Send Message
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
