import { getAllAppointments } from "@/actions/appointment";
import { getRecentActivities } from "@/actions/audit";
import { getCurrentUser } from "@/actions/auth";
import { getAllPatients } from "@/actions/patients";
import { getAllUsers } from "@/actions/users";
// import { AppointmentsWidget } from "@/components/dashboard/appointment-widget";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import DateAndTime from "@/components/dashboard/date-and-time";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { FIELDS, PATIENTFIELDS } from "@/lib/const";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }
  const basePagination = { limit: 20, page: 1 };

  let stats = {
    totalPatients: 0,
    todayAppointments: 0,
    pendingNotes: 0,
    activeUsers: 0,
  };

  let activities = [];
  // Shared query defaults

  if (user.role === Role.DOCTOR) {
    const [patients, appointments, auditLogs] = await Promise.all([
      getAllPatients({
        ...basePagination,
        query: undefined,
        fields: PATIENTFIELDS,
        doctorId: user.id,
      }),
      getAllAppointments({
        ...basePagination,
        doctorId: user.id,
      }),
      getRecentActivities({ limit: 10 }),
    ]);

    stats = {
      totalPatients: patients?.totalRecord ?? 0,
      todayAppointments: appointments?.totalRecord ?? 0,
      pendingNotes: 0, // could later be count of clinical notes by doctorId
      activeUsers: 0, // not applicable to doctors
    };
    activities = auditLogs.activities.filter(
      (a: any) => a.type === "appointment" || a.type === "patient"
    );
  } else if (user.role === Role.ADMIN || user.role === Role.SUPERADMIN) {
    // ✅ Admin view (global)
    const [users, patients, appointments, auditLogs] = await Promise.all([
      getAllUsers({ fields: FIELDS, ...basePagination }),
      getAllPatients({ fields: PATIENTFIELDS, ...basePagination }),
      getAllAppointments({ ...basePagination }),
      getRecentActivities({ limit: 10 }),
    ]);

    stats = {
      totalPatients: patients?.totalRecord ?? 0,
      todayAppointments: appointments?.totalRecord ?? 0,
      pendingNotes: 0,
      activeUsers: users?.totalRecord ?? 0,
    };
    activities = auditLogs.activities;
  } else if (user.role === Role.NURSE) {
    const [appointments, patients, auditLogs] = await Promise.all([
      getAllAppointments({ ...basePagination }),
      getAllPatients({ fields: PATIENTFIELDS, ...basePagination }),
      getRecentActivities({ limit: 10 }),
    ]);
    stats = {
      totalPatients: patients?.totalRecord ?? 0,
      todayAppointments: appointments?.totalRecord ?? 0,
      pendingNotes: 0,
      activeUsers: 0,
    };
    activities = auditLogs.activities.filter((a: any) => a.type !== "user");
  } else if (user.role === Role.FRONTDESK) {
    const [appointments, patients, auditLogs] = await Promise.all([
      getAllAppointments({ ...basePagination }),
      getAllPatients({ fields: PATIENTFIELDS, ...basePagination }),
      getRecentActivities({ limit: 10 }),
    ]);
    stats = {
      totalPatients: patients?.totalRecord ?? 0,
      todayAppointments: appointments?.totalRecord ?? 0,
      pendingNotes: 0,
      activeUsers: 0,
    };
    activities = auditLogs.activities.filter((a: any) => a.type !== "user");
  } else if (user.role === Role.PATIENT) {
    stats = {
      totalPatients: 0,
      todayAppointments: 0,
      pendingNotes: 0,
      activeUsers: 0,
    };
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
            <RecentActivity userRole={user.role} activities={activities} />
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
