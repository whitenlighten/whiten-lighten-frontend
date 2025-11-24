"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { completeAppointment } from "@/actions/appointment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CompleteAppointment({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleApproveAppointment = () => {
    const complete = completeAppointment(appointmentId);

    if (complete === null) {
      setLoading(false);
      router.refresh();
      toast.error("Something went wrong", {
        description: "Something went wrong with completing this appointment",
      });
    } else {
      setLoading(false);
      router.refresh();
      toast.success("Appointment completed", {
        description: "This appointment was completed successfully",
      });
    }
  };

  return (
    <Button
      onClick={handleApproveAppointment}
      disabled={loading}
      className=" bg-emerald-800 hover:bg-emerald-600"
    >
      {loading ? "Completing" : "Complete"}
    </Button>
  );
}
