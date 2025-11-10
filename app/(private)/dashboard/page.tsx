import { getAllAppointments } from "@/actions/appointment";
import { getCurrentUser } from "@/actions/auth";
import { getAllPatients } from "@/actions/patients";
import { getAllUsers } from "@/actions/users";
// import { AppointmentsWidget } from "@/components/dashboard/appointment-widget";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import DateAndTime from "@/components/dashboard/date-and-time";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { FIELDS, PATIENTFIELDS } from "@/lib/const";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const users = await getAllUsers({ fields: FIELDS, limit: 20, page: 1 });
  const patients = await getAllPatients({
    fields: PATIENTFIELDS,
    limit: 20,
    page: 1,
  });
  const appointments = await getAllAppointments({
    limit: 1,
    page: 20,
  });

  const stats = {
    totalPatients: patients?.totalRecord ?? 0,
    todayAppointments: appointments?.totalRecord ?? 0,
    pendingNotes: 0,
    activeUsers: users?.totalRecord ?? 0,
  };
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.firstName} {user.lastName}
            </h1>
            {user.role !== "PATIENT" ? (
              <p className="text-gray-600">
                Here&apos;s what&apos;s happening at your practice today.
              </p>
            ) : (
              <p className="text-gray-600">How can we serve you today?</p>
            )}
          </div>
          <DateAndTime />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DashboardStats stats={stats} userRole={user.role} />
            <RecentActivity userRole={user.role} />
            {/* {user.role === "PATIENT" && <AppointmentsWidget />} */}
          </div>

          <div>
            <QuickActions userRole={user.role} />
          </div>
        </div>
      </main>
    </div>
  );
}
