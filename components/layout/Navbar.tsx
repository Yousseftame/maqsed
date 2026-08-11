  "use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Properties", href: "/properties", hasDropdown: true },
  { name: "Our Agents", href: "/agents" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/lgoogg.png" 
                alt="Urbanouse Logo" 
                width={120} 
                height={32} 
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-9">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <div key={link.name} className="group flex items-center h-16">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative text-[18px] flex items-center gap-1.5 transition-colors duration-200",
                      isActive 
                        ? "text-[#0a0f1d] font-medium" 
                        : "text-[#6B7280] group-hover:text-[#0a0f1d] font-normal"
                    )}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <ChevronDown className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#0a0f1d] transition-colors mt-0.5" />
                    )}

                    {/* Active Indicator Underline */}
                    {isActive && (
                      <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-[3px] bg-[#0a0f1d] rounded-full" />
                    )}
                    
                    {/* Hover Indicator Underline */}
                    {!isActive && (
                      <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[3px] bg-[#0a0f1d] rounded-full transition-all duration-300 w-0 group-hover:w-full" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              href="/login"
              className="text-[16px] font-medium text-[#0a0f1d] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-all rounded-full px-5 py-2"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="text-[16px] font-medium text-white bg-[#030712] hover:bg-black transition-all rounded-full px-5 py-2 shadow-sm"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-[#0a0f1d] p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Full-Screen Mobile Menu Overlay */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 z-[100] bg-white text-[#0a0f1d] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{
          WebkitClipPath: isMobileMenuOpen ? "circle(150% at calc(100% - 28px) 32px)" : "circle(0% at calc(100% - 28px) 32px)",
          clipPath: isMobileMenuOpen ? "circle(150% at calc(100% - 28px) 32px)" : "circle(0% at calc(100% - 28px) 32px)"
        }}
      >
        {/* Header of Mobile Menu */}
        <div className="flex justify-between items-center h-16 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Image 
              src="/lgoogg.png" 
              alt="Urbanouse Logo" 
              width={120} 
              height={32} 
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-400 hover:text-[#0a0f1d] p-2 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 pb-10">
          <nav className="flex flex-col space-y-5">
            {navLinks.map((link, i) => (
              <div key={link.name} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-end gap-4 text-[42px] sm:text-[56px] font-light tracking-tighter transition-all duration-500",
                    pathname === link.href ? "text-[#0a0f1d]" : "text-gray-400 hover:text-[#0a0f1d]"
                  )}
                  style={{
                    transform: isMobileMenuOpen ? "translateY(0)" : "translateY(100%)",
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${isMobileMenuOpen ? 0.2 + i * 0.1 : 0}s`
                  }}
                >
                  <span className="text-sm font-mono text-gray-300 group-hover:text-gray-400 transition-colors duration-500 mb-3 sm:mb-5">
                    0{i + 1}
                  </span>
                  <span className="relative inline-block leading-none pb-2">
                    {link.name}
                    <span 
                      className={cn(
                        "absolute bottom-0 left-0 h-[3px] bg-[#0a0f1d] transition-all duration-500 ease-out",
                        pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                      )} 
                    />
                  </span>
                </Link>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Footer of Mobile Menu */}
        <div 
          className="px-6 sm:px-10 pb-8 flex flex-col space-y-6"
          style={{
            transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${isMobileMenuOpen ? 0.2 + navLinks.length * 0.1 : 0}s`
          }}
        >
          <div className="flex flex-col space-y-3 pt-6 border-t border-gray-100 w-full">
            <Link 
              href="/login"
              className="w-full text-center text-lg font-medium text-[#0a0f1d] border border-gray-200 hover:border-gray-400 rounded-full px-6 py-4 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="w-full text-center text-lg font-medium text-white bg-[#030712] hover:bg-black rounded-full px-6 py-4 transition-all duration-300 shadow-xl shadow-black/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
          
          <div className="flex justify-between items-center text-[11px] font-mono text-gray-400 uppercase tracking-widest pt-2">
            <span>© 2026 Urbanouse</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </header>
  );
}
