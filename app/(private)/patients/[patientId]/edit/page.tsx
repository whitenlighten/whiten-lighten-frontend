import { getPatientsByPatientID } from "@/actions/patients";
import PatientUpdateForm from "@/components/patients/patient-update-form";

type Params = Promise<{ patientId: string }>;
export default async function EditPatient(props: { params: Params }) {
  const { patientId } = await props.params;

  //   console.log({ patientId });
  const patient = await getPatientsByPatientID(patientId);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Update Patient Details
          </h1>
          <p className="text-gray-600">
            Update patient information in the system
          </p>
        </div>

        <PatientUpdateForm patient={patient} />
      </main>
    </div>
  );
}
