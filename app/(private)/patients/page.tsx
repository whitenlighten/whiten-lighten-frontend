import { getAllPatients } from "@/actions/patients";
import { getCurrentUser } from "@/actions/auth";
import { DataTable } from "@/components/shared/custom-datatable";
import { PaginationComponent } from "@/components/shared/custom-pagination";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { patient_columns } from "@/lib/columns";
import { PATIENTFIELDS } from "@/lib/const";
import { ArchiveRestore, Plus } from "lucide-react";
import Link from "next/link";
import { Role } from "@prisma/client";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PatientsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;
  const limit = searchParams.limit ?? 20;
  const query = searchParams.q;

  const user = await getCurrentUser();

  const isDoctor = user?.role === Role.DOCTOR;
  const isPatient = user?.role === Role.PATIENT;

  const patients = await getAllPatients({
    fields: PATIENTFIELDS,
    limit: Number(limit),
    page: Number(page),
    query,
    ...(isDoctor ? { doctorId: user.id } : {}),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-2 flex-wrap items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Patients ({patients?.totalRecord ?? 0})
            </h1>
            <p className="text-gray-600">
              Manage patient records and information
            </p>
          </div>

          {/* ✅ Hide Add / Archived buttons for Doctors and Patients */}
          {!isDoctor && !isPatient && (
            <div className="flex gap-2">
              <Link href="/patients/archived">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  View Archived
                </Button>
              </Link>
              <Link href="/patients/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex flex-row gap-4">
            <SearchBar
              query={query}
              placeholder="Search with first name, last name or email address"
            />
          </div>

          <DataTable
            showColumnButton={false}
            showSearch={false}
            columns={patient_columns}
            data={patients?.records ?? []}
            rowLinkKey="patientId"
            rowLinkPrefix="/patients/"
          />

          <br />
          {patients?.totalRecord >= 20 && (
            <PaginationComponent
              limit={Number(limit)}
              totalItems={patients?.totalRecord}
              siblingCount={1}
            />
          )}
        </div>
      </main>
    </div>
  );
}
