"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, functions } from "@/lib/firebase/firebase";
import { httpsCallable } from "firebase/functions";
import { signInWithCustomToken } from "firebase/auth";
import Image from "next/image";
import toast from "react-hot-toast";

export default function OfferOTPPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call the Cloud Function to verify OTP
      const verifyOfferOtp = httpsCallable(functions, "verifyOfferOtp");
      const result = await verifyOfferOtp({ offerId: params.id, otp });
      
      const { success, token } = result.data as { success: boolean; token: string };

      if (success && token) {
        // 2. Log them in using the returned Custom Token
        await signInWithCustomToken(auth, token);
        
        toast.success("Successfully authenticated!");
        // 3. Redirect to the details page where they can Accept/Reject
        router.push(`/offer/${params.id}/details`);
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid Secret Code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F4F4] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="bg-[#3E1854] px-8 py-10 text-center">
          <Image
            src="/icon-removebg-preview.png"
            alt="Maqsed"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Technical Offer</h1>
          <p className="mt-2 text-white/80 text-sm">
            Enter the 6-digit secret code sent to your email to view the offer details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-10">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#0a0f1d]">Secret Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="XXXXXX"
                className="w-full rounded-xl border border-[#0a0f1d]/10 bg-[#F4F4F4] px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-colors focus:border-[#17C3B3] focus:ring-1 focus:ring-[#17C3B3]"
                style={{ letterSpacing: "1em", paddingLeft: "1.5em" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-xl bg-[#17C3B3] px-4 py-4 text-sm font-bold text-white transition-all hover:bg-[#15b0a2] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "View Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
