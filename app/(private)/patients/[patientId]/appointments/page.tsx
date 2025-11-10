import { getAllAppointments } from "@/actions/appointment";
import { getAppointmentsForPatient, getPatientsByID } from "@/actions/patients";
import { DataTable } from "@/components/shared/custom-datatable";
import { PaginationComponent } from "@/components/shared/custom-pagination";
import Filter from "@/components/shared/filter";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { appointment_columns, mini_appointment_columns } from "@/lib/columns";
import { Status } from "@/lib/const";
// import { appointment_columns } from "@/lib/columns";
import { Plus } from "lucide-react";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Params = Promise<{ patientId: string }>;
export default async function Appointment(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;
  const limit = searchParams.limit ?? 20;
  const query = searchParams.q;
  const status = searchParams.status;

  const { patientId } = await props.params;

  const patient = await getPatientsByID(patientId);

  // const appointments = DUMMY_APPOINTMENT;
  const appointments = await getAppointmentsForPatient(patient?.id ?? "", {
    limit: Number(limit),
    page: Number(page),
    query: query,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-2 flex-wrap items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment History ({appointments?.totalRecord ?? 0})
            </h1>
            <p className="text-gray-600">
              Manage apointment records and information
            </p>
          </div>
        </div>

        <div className="">
          {/* <AppointmentCard /> */}
          <div className=" flex flex-row gap-4">
            <SearchBar
              query={query}
              placeholder="Search with first name, last name or email address"
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
            columns={mini_appointment_columns}
            data={appointments?.records ?? []}
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
