import { PaymentsSection } from "@/features/admin/payments/PaymentsSection";

export const metadata = {
  title: "Payments | Admin Panel",
  description: "All received payments",
};

export default function PaymentsPage() {
  return <PaymentsSection />;
}
