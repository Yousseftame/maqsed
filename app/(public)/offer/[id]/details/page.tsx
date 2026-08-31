"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function OfferDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [offer, setOffer] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If not logged in, they must enter OTP again
        router.replace(`/offer/${params.id}`);
        return;
      }

      try {
        const docRef = doc(db, "offers", params.id);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
          const data = snapshot.data();
          // If already accepted/rejected, redirect to dashboard or show message
          if (data.status === "accepted") {
            toast.success("Offer already accepted. Redirecting to your dashboard...");
            router.push("/developer/dashboard");
            return;
          }
          setOffer(data);
        } else {
          toast.error("Offer not found");
        }
      } catch (err: any) {
        console.error("Error fetching offer:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [params.id, router]);

  const handleAction = async (status: "accepted" | "rejected") => {
    if (!auth.currentUser) return;
    setActionLoading(true);

    try {
      const docRef = doc(db, "offers", params.id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      if (status === "accepted") {
        toast.success("Offer Accepted! Setting up your workspace...");
        // Wait a brief moment for Cloud Function to provision the contract and role
        setTimeout(() => {
          // Hard reload or push to dashboard which will trigger RequireAuth check
          window.location.href = "/developer/dashboard";
        }, 3000);
      } else {
        toast.error("Offer Rejected.");
        // Redirect to a generic thank you or home page
        router.push("/");
      }
    } catch (err: any) {
      toast.error("Failed to process your response.");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#17C3B3] border-t-transparent"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F4]">
        <div className="text-xl font-bold text-[#0a0f1d]">Offer not found or access denied.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="bg-[#3E1854] px-8 py-8 text-white">
          <h1 className="text-2xl font-bold md:text-3xl">{offer.title}</h1>
          <p className="mt-2 text-white/80">Project: {offer.projectName}</p>
        </div>

        <div className="p-8">
          <div className="mb-8 space-y-6">
            <h2 className="text-lg font-bold text-[#0a0f1d] border-b pb-2">Offer Details</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{offer.details}</p>
            </div>
          </div>

          <div className="mb-10 rounded-2xl bg-[#F4F4F4] p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-600">Financial Amount</span>
              <span className="text-3xl font-bold text-[#17C3B3]">{offer.price} SAR</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              onClick={() => handleAction("rejected")}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-500 px-8 py-4 font-bold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
              Reject Offer
            </button>
            <button
              onClick={() => handleAction("accepted")}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#17C3B3] px-8 py-4 font-bold text-white transition-colors hover:bg-[#15b0a2] disabled:opacity-50"
            >
              <Check className="h-5 w-5" />
              Accept Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
