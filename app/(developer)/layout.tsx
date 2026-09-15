import type { Metadata } from "next";
import { DeveloperLayoutClient } from "./DeveloperLayoutClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <DeveloperLayoutClient>{children}</DeveloperLayoutClient>;
}
