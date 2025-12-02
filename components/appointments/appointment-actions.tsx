"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  approveAppointement,
  cancelAppointment,
  updateAppointment,
} from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface AppointmentActionsProps {
  appointmentId: string;
  status: string;
  role: string | undefined;
  doctors: { id: string; name: string }[];
  assignedDoctorId?: string | null;
}

export function AppointmentActions({
  appointmentId,
  status,
  role,
  doctors,
  assignedDoctorId,
}: AppointmentActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<
    "approve" | "cancel" | "assign" | null
  >(null);

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const doctorAlreadyAssigned = Boolean(assignedDoctorId);

  const canAssign =
    role && ["SUPERADMIN", "ADMIN", "FRONTDESK"].includes(role.toUpperCase());
  const canAct =
    role && ["DOCTOR", "ADMIN", "SUPERADMIN"].includes(role.toUpperCase());

  // ✅ Assign doctor
  const handleAssignDoctor = async () => {
    if (!doctorId) {
      toast.error("Please select a doctor");
      return;
    }
    setLoadingAction("assign");

    startTransition(async () => {
      try {
        const res = await updateAppointment(appointmentId, {
          doctorId,
          status: "PENDING",
        });
        if (res?.success) {
          toast.success("Doctor assigned successfully!");
          setShowAssignDialog(false);
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to assign doctor");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error assigning doctor");
      } finally {
        setLoadingAction(null);
      }
    });
  };

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

  if (!canAct && !canAssign) return null;

  return (
    <div className="flex justify-end gap-3 mt-6">
      {canAssign && (
        <>
          <Button
            onClick={() => setShowAssignDialog(true)}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700">
            Assign Doctor
          </Button>

          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Assign Doctor to Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div className="space-y-2">
                  <Label htmlFor="doctorSelect">Choose Available Doctor</Label>
                  <select
                    id="doctorSelect"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full border rounded-md px-3 py-2">
                    <option value="">Select doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAssignDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignDoctor}
                  disabled={isPending || doctorAlreadyAssigned}
                  className="bg-green-600 hover:bg-green-700">
                  {loadingAction === "assign" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Assigning...
                    </>
                  ) : (
                    "Assign"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      {canAct && status === "PENDING" && (
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

      {canAct && status !== "CANCELLED" && (
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
