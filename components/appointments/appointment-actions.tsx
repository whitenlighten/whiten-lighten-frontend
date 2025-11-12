"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { approveAppointement, cancelAppointment } from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AppointmentActionsProps {
  appointmentId: string;
  status: string;
  role: string | undefined;
}

export function AppointmentActions({
  appointmentId,
  status,
  role,
}: AppointmentActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<
    "approve" | "cancel" | null
  >(null);

  // Approve handler
  const handleApprove = async () => {
    setLoadingAction("approve");
    startTransition(async () => {
      try {
        const res = await approveAppointement(appointmentId);
        if (res) {
          toast.success("Appointment approved successfully!");
          router.refresh();
        } else {
          toast.error("Failed to approve appointment");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error approving appointment");
      } finally {
        setLoadingAction(null);
      }
    });
  };

  // Cancel handler
  const handleCancel = async () => {
    setLoadingAction("cancel");
    startTransition(async () => {
      try {
        const res = await cancelAppointment(appointmentId);
        if (res) {
          toast.success("Appointment cancelled successfully!");
          router.refresh();
        } else {
          toast.error("Failed to cancel appointment");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error cancelling appointment");
      } finally {
        setLoadingAction(null);
      }
    });
  };

  // Access control
  const canAct =
    role &&
    ["DOCTOR", "ADMIN", "SUPERADMIN"].includes(role.toUpperCase() ?? "");

  if (!canAct) return null;

  return (
    <div className="flex justify-end gap-3 mt-6">
      {status === "PENDING" && (
        <Button
          onClick={handleApprove}
          disabled={isPending || loadingAction !== null}
          className="bg-green-600 hover:bg-green-700">
          {loadingAction === "approve" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Approving...
            </>
          ) : (
            "Approve Appointment"
          )}
        </Button>
      )}

      {status !== "CANCELLED" && (
        <Button
          variant="destructive"
          onClick={handleCancel}
          disabled={isPending || loadingAction !== null}
          className="bg-red-600 hover:bg-red-700">
          {loadingAction === "cancel" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cancelling...
            </>
          ) : (
            "Cancel Appointment"
          )}
        </Button>
      )}
    </div>
  );
}
