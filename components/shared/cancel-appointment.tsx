"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cancelAppointment } from "@/actions/appointment";
import { toast } from "sonner";

export default function CancelAppointment({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCancelAppointment = () => {
    const complete = cancelAppointment(appointmentId);

    if (complete === null) {
      setLoading(false);
      router.refresh();
      toast.error("Something went wrong", {
        description: "Something went wrong with cancelling this appointment",
      });
    } else {
      setLoading(false);
      router.refresh();
      toast.success("Appointment cancelled", {
        description: "This appointment was cancelled successfully",
      });
    }
  };
  return (
    <Button
      onClick={handleCancelAppointment}
      className="hover:bg-red-800 bg-[#f93e3e]"
    >
      {loading ? "Cancelling" : "Cancel"}
    </Button>
  );
}
