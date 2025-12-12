"use client";

import {
  approveAppointement,
  cancelAppointment,
  updateAppointment,
} from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";

interface StaffOption {
  id: string;
  name: string;
}

interface AppointmentActionsProps {
  appointmentId: string;
  status: string;
  role: string | undefined;
  doctors: StaffOption[];
  nurses: StaffOption[];
  assignedDoctorId?: string | null;
  assignedNurseId?: string | null;
}

export function AppointmentActions({
  appointmentId,
  status,
  role,
  doctors,
  nurses,
  assignedDoctorId,
  assignedNurseId,
}: AppointmentActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<
    "approve" | "cancel" | "assignDoctor" | "assignNurse" | null
  >(null);

  const [showAssignDoctorDialog, setShowAssignDoctorDialog] = useState(false);
  const [showAssignNurseDialog, setShowAssignNurseDialog] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [nurseId, setNurseId] = useState("");

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
    setLoadingAction("assignDoctor");

    startTransition(async () => {
      try {
        const res = await updateAppointment(appointmentId, {
          doctorId,
          status: "PENDING",
        });
        if (res?.success) {
          toast.success("Doctor assigned successfully!");
          setShowAssignDoctorDialog(false);
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
  const handleAssignNurse = async () => {
    if (!nurseId) return toast.error("Please select a nurse");

    setLoadingAction("assignNurse");

    startTransition(async () => {
      try {
        const res = await updateAppointment(appointmentId, {
          nurseId,
          status: "PENDING",
        });
        if (res?.success) {
          toast.success("Nurse assigned successfully!");
          setShowAssignNurseDialog(false);
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to assign nurse");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error assigning nurse");
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
            onClick={() => setShowAssignNurseDialog(true)}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700">
            Assign Nurse
          </Button>

          <Dialog
            open={showAssignNurseDialog}
            onOpenChange={setShowAssignNurseDialog}>
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Assign Nurse</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-3">
                <Label>Select Nurse</Label>
                <select
                  value={nurseId}
                  onChange={(e) => setNurseId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2">
                  <option value="">Choose nurse…</option>
                  {nurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAssignNurseDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignNurse}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isPending}>
                  {loadingAction === "assignNurse" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Assigning…
                    </>
                  ) : (
                    "Assign Nurse"
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
