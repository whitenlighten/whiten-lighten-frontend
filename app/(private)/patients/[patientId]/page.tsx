import { getPatientsByID } from "@/actions/patients";
import ApprovePatient from "@/components/shared/approve-patient";
import {
  ArchivePatientButton,
  UnarchivePatientButton,
} from "@/components/shared/archive-patient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPatientStatusColor, getRoleBadgeColor } from "@/lib/utils";
import { format } from "date-fns";
import {
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ patientId: string }>;

export default async function PatientDetailPage({
  params,
}: {
  params: Params;
}) {
  const { patientId } = await params;
  const patient = await getPatientsByID(patientId);

  if (!patient) {
    return notFound();
  }

  return (
    <div className="bg-[#f9fafb]">
      <div className="max-w-6xl  mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-black">
                {patient?.firstName} {patient?.middleName} {patient?.lastName}
              </h1>
              <div className=" flex  items-center  gap-2 text-muted-foreground">
                <p>Patient ID:</p>
                <p className=" font-mono text-[14px]">{patient?.patientId}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={getPatientStatusColor(patient?.status || "ACTIVE")}
                >
                  {patient?.status}
                </Badge>
                <Badge variant="outline">{patient?.gender}</Badge>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>
              Last Updated: {format(patient?.updatedAt ?? new Date(), "PPPP")}
            </p>
            <p>
              Registered: {format(patient?.createdAt ?? new Date(), "PPPP")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demographics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-black" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p className="text-base">{patient?.age || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="text-base">
                    {" "}
                    {format(patient?.dateOfBirth ?? new Date(), "d/M/uu")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Marital Status
                  </p>
                  <p className="text-base">
                    {patient?.maritalStatus || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Occupation
                  </p>
                  <p className="text-base">
                    {patient?.occupation || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Religion
                  </p>
                  <p className="text-base">
                    {patient?.religion || "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-black" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Primary Phone</p>
                    <p className="text-base">{patient?.phone}</p>
                  </div>
                </div>
                {patient?.alternatePhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Alternate Phone</p>
                      <p className="text-base">{patient?.alternatePhone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-base">{patient?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-base">{patient?.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient?.lga && `${patient?.lga}, `}
                      {patient?.state}, {patient?.country}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-black" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Blood Group
                  </p>
                  <p className="text-base font-semibold text-red-600">
                    {patient?.bloodGroup || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Genotype
                  </p>
                  <p className="text-base font-semibold text-red-600">
                    {patient?.genotype || "Not provided"}
                  </p>
                </div>
              </div>
              {patient?.allergies && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-red-800">
                      Allergies
                    </p>
                  </div>
                  <p className="text-sm text-red-700">{patient?.allergies}</p>
                </div>
              )}
              {patient?.chronicConditions && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Chronic Conditions
                  </p>
                  <p className="text-sm text-yellow-700">
                    {patient?.chronicConditions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-black" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient?.emergencyName ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Name
                    </p>
                    <p className="text-base">{patient?.emergencyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <p className="text-base">{patient?.emergencyPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Relationship
                    </p>
                    <p className="text-base">{patient?.emergencyRelation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No emergency contact provided
                </p>
              )}
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-black" />
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient?.insuranceProvider ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Provider
                    </p>
                    <p className="text-base">{patient?.insuranceProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Insurance Number
                    </p>
                    <p className="text-base font-mono">
                      {patient?.insuranceNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="text-base">{patient?.paymentMethod}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No insurance information provided
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-black" />
              Medical History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary mb-2">
                    Past Medical History
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {patient?.pastMedicalHistory ||
                      "No past medical history recorded"}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-primary mb-2">
                    Past Surgical History
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {patient?.pastSurgicalHistory ||
                      "No past surgical history recorded"}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-primary mb-2">
                    Current Medications
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {patient?.currentMedications ||
                      "No current medications recorded"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary mb-2">
                    Immunization Records
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {patient?.immunizationRecords ||
                      "No immunization records available"}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-primary mb-2">
                    Family History
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {patient?.familyHistory || "No family history recorded"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Administrative Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-black" />
                Administrative Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Registration Type
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${getRoleBadgeColor(
                      patient?.registrationType ?? "FRONTDESK"
                    )}`}
                  >
                    {patient?.registrationType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>
                  <p className="text-sm">
                    {format(patient?.createdAt ?? new Date(), "PPPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="text-sm">
                    {format(patient?.updatedAt ?? new Date(), "PPPP")}
                  </p>
                </div>
                {patient?.approvedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Approved
                    </p>
                    <p className="text-sm">
                      {patient.approvedAt
                        ? format(patient?.approvedAt ?? new Date(), "PPPP")
                        : "No date"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-black" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className=" flex flex-col gap-2 w-full">
              {patient.status === "ARCHIVED" ? (
                <div className="">
                  <UnarchivePatientButton id={patient.id} />
                </div>
              ) : (
                <>
                  <Button asChild className=" w-full">
                    <Link href={`/patients/${patient.patientId}/edit`}>
                      Update Patient
                    </Link>
                  </Button>
                  {patient?.status != "ACTIVE" && (
                    <ApprovePatient patientId={patient.patientId} />
                  )}
                  {/* {patient?.status === "ACTIVE" && (
                <PatientInformationDownload patientId={patientId} />
              )} */}
                  <Button asChild className=" w-full">
                    <Link href={`/patients/${patientId}/appointments`}>
                      View Appointment History
                    </Link>
                  </Button>
                  <ArchivePatientButton id={patient.id} />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
