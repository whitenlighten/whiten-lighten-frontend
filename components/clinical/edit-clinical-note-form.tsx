"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateClinicalNoteAction } from "@/actions/clinical-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export default function EditClinicalNoteForm({
  note,
  patientId,
  noteId,
}: {
  note: any;
  patientId: string;
  noteId: string;
}) {
  const router = useRouter();
  const ext = note.extendedData ?? {};

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    const result = await updateClinicalNoteAction(patientId, noteId, formData);

    if (!result.success) {
      toast.error(result.error || "Update failed");
      setIsLoading(false);
      return;
    }

    toast.success("Clinical note updated successfully!");
    router.push(`/clinical/${patientId}/${noteId}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-10">
      {" "}
      {/* SUBJECTIVE */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-blue-700">S — Subjective</h2>

        {/* <Textarea
          name="chiefComplaint"
          defaultValue={note.chiefComplaint}
          placeholder="Chief Complaint"
        /> */}

        <Textarea
          name="presentComplaint"
          defaultValue={ext.presentComplaint}
          placeholder="Present Complaint"
        />

        <Textarea
          name="historyOfPresentComplaint"
          defaultValue={ext.historyOfPresentComplaint}
          placeholder="History of Present Complaint"
        />

        <Textarea
          name="dentalHistory"
          defaultValue={ext.dentalHistory}
          placeholder="Dental History"
        />

        <Textarea
          name="medicalHistory"
          defaultValue={ext.medicalHistory}
          placeholder="Medical History"
        />
      </section>
      {/* OBJECTIVE */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-green-700">O — Objective</h2>

        <Textarea name="eoe" defaultValue={ext.eoe} placeholder="EOE" />

        <Textarea name="ioe" defaultValue={ext.ioe} placeholder="IOE" />

        <Textarea
          name="observations"
          defaultValue={note.observations}
          placeholder="Observations"
        />

        <Textarea
          name="investigation"
          defaultValue={ext.investigation}
          placeholder="Investigation"
        />
      </section>
      {/* VITALS */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="bloodPressure"
          defaultValue={note.vitals?.bloodPressure}
          placeholder="Blood Pressure"
        />

        <Input
          name="pulse"
          defaultValue={note.vitals?.pulse}
          placeholder="Pulse"
        />

        <Input
          name="temperature"
          defaultValue={note.vitals?.temperature}
          placeholder="Temperature"
        />
      </div> */}
      {/* ASSESSMENT */}
      <section>
        <h2 className="text-2xl font-bold text-orange-700">A — Assessment</h2>

        {/* <Input
          name="diagnosis"
          defaultValue={note.diagnosis}
          placeholder="Diagnosis"
        /> */}

        <Textarea
          name="doctorNotes"
          defaultValue={note.doctorNotes}
          placeholder="Doctor Notes"
        />
      </section>
      {/* PLAN */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-red-700">P — Plan</h2>

        <Textarea
          name="treatmentDone"
          defaultValue={ext.treatmentDone}
          placeholder="Treatment Done"
        />

        <Textarea
          name="treatmentPlan"
          defaultValue={note.treatmentPlan}
          placeholder="Treatment Plan"
        />

        <Textarea
          name="recommendedTreatments"
          defaultValue={(ext.recommendedTreatments ?? []).join(", ")}
          placeholder="Recommended Treatments"
        />

        <Input
          name="estimatedDuration"
          defaultValue={ext.estimatedDuration}
          placeholder="Estimated Duration"
        />
      </section>
      {/* ACTIONS */}
      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline" onClick={() => router.back()} type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
