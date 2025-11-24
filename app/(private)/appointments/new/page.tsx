import { redirect } from "next/navigation";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { getCurrentUser } from "@/actions/auth";
import { getAllPatients } from "@/actions/patients";
import { getAllUsers } from "@/actions/users";

export default async function NewAppointmentPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const patientsResponse = await getAllPatients({
    page: 1,
    limit: 100,
    fields: ["id", "firstName", "lastName", "email", "phone"],
  });

  const patients =
    patientsResponse?.records?.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
    })) ?? [];

  const doctorsResponse = await getAllUsers({
    page: 1,
    limit: 100,
    role: "DOCTOR",
    fields: ["id", "firstName", "lastName", "role"],
  });

  const doctors =
    doctorsResponse?.records
      ?.filter((u) => u.role?.toUpperCase() === "DOCTOR")
      .map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        specialization: u.role,
      })) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Schedule New Appointment
          </h1>
          <p className="text-gray-600">Book a new appointment for a patient</p>
        </div>

        {/* ✅ Pass fetched lists as props */}
        <AppointmentForm patients={patients} doctors={doctors} />
      </main>
    </div>
  );
}
