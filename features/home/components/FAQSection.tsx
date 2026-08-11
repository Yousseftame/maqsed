"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I start searching for a property with Urbanouse?",
    answer: "Set your preferences on our platform and explore a wide range of properties. Our team is ready to assist you!",
  },
  {
    question: "What services does Urbanouse offer for first-time homebuyers?",
    answer: "We provide comprehensive guidance including mortgage pre-approval assistance, property tours, and step-by-step closing support.",
  },
  {
    question: "Can Urbanouse help me sell my property?",
    answer: "Yes! We offer a full suite of seller services including professional photography, market analysis, and targeted marketing campaigns.",
  },
  {
    question: "What types of properties does Urbanouse specialize in?",
    answer: "We specialize in luxury residential properties, modern apartments, and premium commercial real estate.",
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-30 w-full bg-[#F5F5F5] py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background Graphic Shape */}
      <div className="absolute top-1/2 left-[60%] lg:left-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] text-black">
        <svg 
          width="700" 
          height="700" 
          viewBox="-60 -60 120 120" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: "pixelated", transformOrigin: "50% 50%" }}
        >
          <defs>
            <path id="quarter" d="M 0,-40 A 40,40 0 0,0 -40,0 L -16,0 A 16,16 0 0,1 0,-16 Z" />
          </defs>
          <use href="#quarter" transform="translate(-7, -7)" />
          <use href="#quarter" transform="rotate(90) translate(-7, -7)" />
          <use href="#quarter" transform="rotate(180) translate(-7, -7)" />
          <use href="#quarter" transform="rotate(270) translate(-7, -7)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* Left Column: FAQ Accordion */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="border-b-2 border-gray-200 last:border-b-0 py-8"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center gap-6 text-left group"
                >
                  <h4 className="text-2xl font-extrabold text-[#0a0f1d] pr-4 transition-colors duration-300">
                    {faq.question}
                  </h4>
                  <div className="flex-shrink-0 text-[#0a0f1d] transition-colors duration-300">
                    {isOpen ? (
                      <ChevronUp className="w-7 h-7 stroke-[3]" />
                    ) : (
                      <ChevronDown className="w-7 h-7 stroke-[3]" />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[#6b7280] text-[1.15rem] font-medium leading-relaxed pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start lg:items-end text-left lg:text-right pt-4">
          <div className="group inline-flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 mb-6 transition-colors duration-300 hover:bg-[#0a0f1d] cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-[#0a0f1d] group-hover:bg-white transition-colors duration-300" />
            <span className="text-sm font-medium text-[#0a0f1d] group-hover:text-white transition-colors duration-300">
              Testimonial
            </span>
          </div>
          
          <h2 className="text-5xl lg:text-[4.5rem] font-bold text-[#0a0f1d] leading-[1.1] tracking-tight mb-6">
            Frequently Asked
            <br />
            Questions
          </h2>
          
          <p className="text-[#8c8c8c] text-[1.15rem] leading-relaxed max-w-lg">
            Have questions about buying, selling, or renting with Urbanouse? We've got the answers to help guide you through the process.
          </p>
        </div>

      </div>
    </section>
  );
}
