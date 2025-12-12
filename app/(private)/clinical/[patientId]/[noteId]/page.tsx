import { getClinicalNoteById } from "@/actions/clinical-notes";
import { getCurrentUser } from "@/actions/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ClinicalNoteDetailPage({
  params,
}: {
  params: Promise<{ patientId: string; noteId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const { patientId, noteId } = await params;

  const note = await getClinicalNoteById(patientId, noteId);
  if (!note) return notFound();

  const ext = note.extendedData ?? {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-8 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clinical Note Details</h1>
            <p className="text-gray-600">Note ID: {note.id}</p>
          </div>

          {user.role === "DOCTOR" && (
            <Link href={`/clinical/${patientId}/${noteId}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Edit Note
              </Button>
            </Link>
          )}
        </div>

        <hr />

        {/* GENERAL INFO */}
        <section>
          <h2 className="text-xl font-semibold mb-2">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <p>
              <strong>Patient ID:</strong> {note.patientId}
            </p>
            <p>
              <strong>Status:</strong> {note.status}
            </p>
            <p>
              <strong>Date:</strong> {ext.date}
            </p>

            <p>
              <strong>Dentist:</strong> {ext.dentistName}
            </p>
            <p>
              <strong>Signature:</strong> {ext.dentistSignature}
            </p>

            <p>
              <strong>Created At:</strong> {note.createdAt}
            </p>
            <p>
              <strong>Last Updated:</strong> {note.updatedAt}
            </p>
          </div>
        </section>

        <hr />

        {/* SOAP FORMAT */}
        <section className="space-y-8">
          {/* S — SUBJECTIVE */}
          <div>
            <h2 className="text-2xl font-bold text-blue-700">S — Subjective</h2>
            <div className="mt-3 space-y-2 text-gray-700">
              <p>
                {/* <strong>Chief Complaint:</strong> {note.chiefComplaint} */}
              </p>
              <p>
                <strong>Present Complaint:</strong> {ext.presentComplaint}
              </p>
              <p>
                <strong>History of Present Complaint:</strong>{" "}
                {ext.historyOfPresentComplaint}
              </p>
              <p>
                <strong>Dental History:</strong> {ext.dentalHistory}
              </p>
              <p>
                <strong>Medical History:</strong> {ext.medicalHistory}
              </p>
            </div>
          </div>

          {/* O — OBJECTIVE */}
          <div>
            <h2 className="text-2xl font-bold text-green-700">O — Objective</h2>
            <div className="mt-3 space-y-2 text-gray-700">
              <p>
                <strong>EOE:</strong> {ext.eoe}
              </p>
              <p>
                <strong>IOE:</strong> {ext.ioe}
              </p>
              <p>
                <strong>Observations:</strong> {note.observations}
              </p>
              <p>
                <strong>Investigation:</strong> {ext.investigation}
              </p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <p>
                <strong>Blood Pressure:</strong> {note.vitals?.bloodPressure}
              </p>
              <p>
                <strong>Pulse:</strong> {note.vitals?.pulse}
              </p>
              <p>
                <strong>Temperature:</strong> {note.vitals?.temperature}
              </p>
            </div> */}
          </div>

          {/* A — ASSESSMENT */}
          <div>
            <h2 className="text-2xl font-bold text-orange-700">
              A — Assessment
            </h2>

            <p className="mt-3">
              {/* <strong>Diagnosis:</strong> {note.diagnosis} */}
            </p>
            <p>
              <strong>Impression:</strong> {(ext.impression ?? []).join(", ")}
            </p>
            <p>
              <strong>Doctor Notes:</strong> {note.doctorNotes}
            </p>
          </div>

          {/* P — PLAN */}
          <div>
            <h2 className="text-2xl font-bold text-red-700">P — Plan</h2>

            <div className="space-y-2 mt-3 text-gray-700">
              <p>
                <strong>Treatment Done:</strong> {ext.treatmentDone}
              </p>
              <p>
                <strong>Treatment Plan:</strong> {note.treatmentPlan}
              </p>
              <p>
                <strong>Recommended Treatments:</strong>{" "}
                {(ext.recommendedTreatments ?? []).join(", ")}
              </p>
              <p>{/* <strong>Medications:</strong> {note.medications} */}</p>
              {/* <p>
                <strong>Dosage Instructions:</strong> {note.dosageInstructions}
              </p> */}
              <p>
                <strong>Estimated Duration:</strong> {ext.estimatedDuration}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
