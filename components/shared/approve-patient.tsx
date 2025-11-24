"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { approvePatient, getPatientsByPatientID } from "@/actions/patients";
import { toast } from "sonner"; // or any other toast system
import { useRouter } from "next/navigation";

export default function ApprovePatient({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    const patient = await getPatientsByPatientID(patientId);
    const result = await approvePatient(patient?.id ?? "");
    setLoading(false);

    if (result) {
      router.refresh();
      toast.success("Patient admitted successfully!");
    } else {
      router.refresh();
      toast.error(result.error || "Failed to admit patient");
    }
  };

  return (
    <Button onClick={handleApprove} disabled={loading} className="w-full">
      {loading ? "Admitting..." : "Admit Patient"}
    </Button>
  );
}
