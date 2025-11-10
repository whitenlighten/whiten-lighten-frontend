"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { approveAppointement } from "@/actions/appointment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ApproveAppointment({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const handleApproveAppointment = () => {
    const approve = approveAppointement(appointmentId);

    if (approve === null) {
      setLoading(false);
      router.refresh();
      toast.error("Something went wrong", {
        description: "Something went wrong with approving this appointment",
      });
    } else {
      setLoading(false);
      router.refresh();
      toast.success("Appointment approved", {
        description: "This appointment was approved successfully",
      });
    }
  };

  return (
    <Button disabled={loading} onClick={handleApproveAppointment} className="">
      {loading ? "Approving" : "Approve"}
    </Button>
  );
}
