import { getAllArchivedPatients } from "@/actions/patients";
import { DataTable } from "@/components/shared/custom-datatable";
import { PaginationComponent } from "@/components/shared/custom-pagination";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { patient_columns } from "@/lib/columns";
import { PATIENTFIELDS } from "@/lib/const";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function Archived(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;
  const limit = searchParams.limit ?? 20;
  const query = searchParams.q;

  const patients = await getAllArchivedPatients({
    fields: PATIENTFIELDS,
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
              Archived Patients ({patients?.totalRecord ?? 0})
            </h1>
            <p className="text-gray-600">
              Manage patient records and information
            </p>
          </div>
          <div className=" flex gap-2">
            <Link href="/patients">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Patients
              </Button>
            </Link>
          </div>
        </div>

        <div className=" w-full">
          <div className=" flex flex-row gap-4">
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
