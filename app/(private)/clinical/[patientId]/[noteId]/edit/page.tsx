import { getCurrentUser } from "@/actions/auth";
import { getClinicalNoteById } from "@/actions/clinical-notes";
import EditClinicalNoteForm from "@/components/clinical/edit-clinical-note-form";
import { notFound, redirect } from "next/navigation";

export default async function EditClinicalNotePage({
  params,
}: {
  params: Promise<{ patientId: string; noteId: string }>;
}) {
  const { patientId, noteId } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const note = await getClinicalNoteById(patientId, noteId);
  if (!note) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Edit Clinical Note</h1>
        <p className="text-gray-600 mb-6">
          Patient ID: {note.patientId} • Note ID: {note.id}
        </p>

        <EditClinicalNoteForm
          note={note}
          patientId={patientId}
          noteId={noteId}
        />
      </div>
    </div>
  );
}
