import { getAllAppointments } from "@/actions/appointment";
import { getCurrentUser } from "@/actions/auth"; // ✅ import
import { DataTable } from "@/components/shared/custom-datatable";
import { PaginationComponent } from "@/components/shared/custom-pagination";
import Filter from "@/components/shared/filter";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { appointment_columns } from "@/lib/columns";
import { Status } from "@/lib/const";
import { Plus } from "lucide-react";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Appointments(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;
  const limit = searchParams.limit ?? 20;
  const query = searchParams.q;
  const status = searchParams.status;

  const user = await getCurrentUser();

  let appointments;

  if (user?.role?.toUpperCase() === "DOCTOR") {
    appointments = await getAllAppointments({
      limit: Number(limit),
      page: Number(page),
      doctorId: user.id,
      query,
      status,
    });
  } else {
    appointments = await getAllAppointments({
      limit: Number(limit),
      page: Number(page),
      query: query,
      status: status,
    });
  }

  const canBook =
    user &&
    !["NURSE", "PATIENT", "DOCTOR"].includes(user.role?.toUpperCase() ?? "");

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-2 flex-wrap items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment ({appointments?.totalRecord ?? 0})
            </h1>
            <p className="text-gray-600">
              Manage appointment records and information
            </p>
          </div>

          {/* ✅ Conditionally render Book button */}
          {canBook && (
            <div className="flex gap-2">
              <Link href="/appointments/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Book appointment
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-row gap-4">
            <SearchBar
              query={query}
              placeholder="Search with reason or service"
            />
            <Filter
              searchTerm="status"
              data={Status}
              placeholder="Filter status"
            />
          </div>

          <DataTable
            showColumnButton={false}
            showSearch={false}
            columns={appointment_columns}
            data={appointments?.appointments ?? []}
          />

          <br />
          {appointments?.totalRecord >= 20 && (
            <PaginationComponent
              limit={Number(limit)}
              totalItems={appointments?.totalRecord}
              siblingCount={1}
            />
          )}
        </div>
      </main>
    </div>
  );
}
