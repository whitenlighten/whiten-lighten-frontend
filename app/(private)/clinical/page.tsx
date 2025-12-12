import { getCurrentUser } from "@/actions/auth";
import { getAllClinicalNotes } from "@/actions/clinical-notes";
import { ClinicalNotesTable } from "@/components/shared/clinical-table";
import { PaginationComponent } from "@/components/shared/custom-pagination";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { clinical_notes_columns } from "@/lib/columns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ClinicalPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;
  const limit = searchParams.limit ?? 20;
  const query = searchParams.q;

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const notes = await getAllClinicalNotes({
    page: Number(page),
    limit: Number(limit),
    query,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-2 flex-wrap items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Clinical Notes ({notes?.totalRecord ?? 0})
            </h1>
            <p className="text-gray-600">All patient clinical documentation</p>
          </div>

          {user.role === "DOCTOR" && (
            <Link href="/clinical/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Clinical Note
              </Button>
            </Link>
          )}
        </div>

        <div className="w-full space-y-5">
          <div className="flex flex-row gap-4 ">
            <SearchBar
              query={query}
              placeholder="Search diagnosis, doctor, or patient ID"
            />
          </div>
          <div className="">
            <ClinicalNotesTable
              columns={clinical_notes_columns}
              data={notes?.records ?? []}
            />
          </div>
          <br />

          {notes?.totalRecord >= 20 && (
            <PaginationComponent
              limit={Number(limit)}
              totalItems={notes?.totalRecord}
              siblingCount={1}
            />
          )}
        </div>
      </main>
    </div>
  );
}
