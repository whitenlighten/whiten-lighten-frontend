import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ClinicalNotesForm } from "@/components/clinical/clinical-notes-form";
import { getCurrentUser } from "@/actions/auth";

export default async function NewClinicalNotePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  // Only admin and doctor can create clinical notes
  if (
    user.role !== "ADMIN" &&
    user.role !== "DOCTOR" &&
    user.role !== "SUPERADMIN"
  ) {
    redirect("/clinical");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Clinical Note
          </h1>
          <p className="text-gray-600">
            You will be able to add notes soon
            {/* Document patient treatment and clinical observations */}
          </p>
        </div>

        {/* <ClinicalNotesForm /> */}
      </main>
    </div>
  );
}
