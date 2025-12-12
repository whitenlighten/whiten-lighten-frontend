"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClinicalNoteAction } from "@/actions/clinical-notes";
import { Spinner } from "../ui/spinner";

export function ClinicalNotesForm({ patients }: { patients: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [requiresFollowUp, setRequiresFollowUp] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    setIsLoading(true);
    formData.set("patientId", selectedPatient);

    try {
      const result = await createClinicalNoteAction(formData);

      if (result.success) {
        toast.success("Clinical note created successfully!");
        router.push("/clinical");
      } else {
        toast.error(result.error || "Failed to create clinical note");
      }
    } catch (err) {
      toast.error("Error creating clinical note");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-10">
      {/* ====================================================
          SECTION: PATIENT INFO
      ==================================================== */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
        <p className="text-gray-600 mb-3">Select the patient for this note</p>

        <select
          name="patientId"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          required
          className="w-full border p-2 rounded">
          <option value="">Select a patient...</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} ({p.patientId})
            </option>
          ))}
        </select>
      </div>

      {/* ====================================================
          S — SUBJECTIVE
      ==================================================== */}
      <div>
        <h2 className="text-xl font-bold text-blue-700">S — Subjective</h2>
        <p className="text-gray-600 mb-3">
          Patient-reported symptoms and history
        </p>

        <div className="space-y-4">
          {/* <Textarea
            name="chiefComplaint"
            required
            placeholder="Chief Complaint *"
          /> */}
          <Textarea name="presentComplaint" placeholder="Present Complaint" />
          <Textarea
            name="historyOfPresentComplaint"
            placeholder="History of Present Complaint"
          />
          <Textarea name="dentalHistory" placeholder="Dental History" />
          <Textarea name="medicalHistory" placeholder="Medical History" />
        </div>
      </div>

      {/* ====================================================
          O — OBJECTIVE
      ==================================================== */}
      <div>
        <h2 className="text-xl font-bold text-green-700">O — Objective</h2>
        <p className="text-gray-600 mb-3">Clinical findings and observations</p>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="bloodPressure"
            placeholder="Blood Pressure (e.g. 120/80)"
          />
          <Input name="pulse" type="number" placeholder="Pulse (bpm)" />
          <Input
            name="temperature"
            type="number"
            step="0.1"
            placeholder="Temperature (°C)"
          />
        </div> */}

        <div className="space-y-4 mt-4">
          <Textarea name="eoe" placeholder="Extra Oral Examination (EOE)" />
          <Textarea name="ioe" placeholder="Intra Oral Examination (IOE)" />
          <Textarea name="observations" placeholder="Observations" />
          <Textarea name="investigation" placeholder="Investigation" />
        </div>
      </div>

      {/* ====================================================
          A — ASSESSMENT
      ==================================================== */}
      <div>
        <h2 className="text-xl font-bold text-orange-700">A — Assessment</h2>
        <p className="text-gray-600 mb-3">
          Diagnosis, impressions, and clinical judgment
        </p>

        {/* <Input name="diagnosis" required placeholder="Diagnosis *" /> */}

        <Textarea
          name="impression"
          placeholder="Impression (comma separated, e.g. gingivitis, pulpitis)"
          className="mt-4"
        />

        <Textarea
          name="doctorNotes"
          placeholder="Doctor Notes"
          className="mt-4"
        />
      </div>

      {/* ====================================================
          P — PLAN
      ==================================================== */}
      <div className="">
        <h2 className="text-xl font-bold text-red-700">P — Plan</h2>
        <p className="text-gray-600 mb-3">Treatment performed & future plan</p>
        <div className="space-y-3">
          <Textarea name="treatmentDone" placeholder="Treatment Done" />
          <Textarea name="treatmentPlan" placeholder="Treatment Plan" />
        </div>
        <Textarea
          name="recommendedTreatments"
          placeholder="Recommended Treatments (comma separated)"
          className="mt-4"
        />

        {/* <Textarea
          name="medications"
          placeholder="Medications"
          className="mt-4"
        /> */}

        <Textarea
          name="dosageInstructions"
          placeholder="Dosage Instructions"
          className="mt-4"
        />

        <Input
          name="estimatedDuration"
          placeholder="Estimated Treatment Duration (e.g. 2 weeks)"
          className="mt-4"
        />

        {/* Follow up */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="requiresFollowUp"
            onChange={(e) => setRequiresFollowUp(e.target.checked)}
          />
          <Label>Requires follow-up?</Label>
        </div>

        {requiresFollowUp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <Input name="followUpDate" type="date" />
            <Input
              name="followUpInstructions"
              placeholder="Follow-up Instructions"
            />
          </div>
        )}
      </div>

      {/* ====================================================
          META (AUTO-FILLED)
      ==================================================== */}
      <input
        type="hidden"
        name="date"
        value={new Date().toISOString().split("T")[0]}
      />

      {/* FORM ACTIONS */}
      <div className="flex justify-end gap-4 pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
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
            "Save Clinical Note"
          )}
        </Button>
      </div>
    </form>
  );
}
