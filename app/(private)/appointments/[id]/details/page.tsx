import { getAppointmentById } from "@/actions/appointment";
import { getCurrentUser } from "@/actions/auth";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { AppointmentActions } from "@/components/appointments/appointment-actions";

type AppointmentDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AppointmentDetailsPage({
  params,
}: AppointmentDetailsPageProps) {
  const user = await getCurrentUser();
  const appointment = await getAppointmentById((await params).id);

  if (!appointment) return notFound();

  const {
    id,
    patient,
    doctor,
    date,
    status,
    reason,
    service,
    timeslot,
    maritalStatus,
  } = appointment;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment Details
            </h1>
            <p className="text-gray-600">
              View full details for this appointment
            </p>
          </div>
          <Link href="/appointments">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Appointment Info */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Calendar className="w-5 h-5 mr-2" /> Appointment Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {new Date(date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Slot</p>
                <p className="font-medium">{timeslot}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-medium">{service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge
                  className={
                    status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }>
                  {status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reason</p>
              <p className="font-medium">{reason}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Marital Status</p>
              <p className="font-medium">{maritalStatus}</p>
            </div>
          </CardContent>
        </Card>

        {/* Patient Info */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <User className="w-5 h-5 mr-2" /> Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{patient.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-500" /> {patient.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-500" /> {patient.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Info */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Stethoscope className="w-5 h-5 mr-2" /> Assigned Doctor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Doctor Name</p>
                <p className="font-medium">
                  Dr. {doctor?.firstName} {doctor?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-500" /> {doctor?.email}
                </p>
              </div>
              {doctor?.specialization && (
                <div>
                  <p className="text-sm text-gray-600">Specialization</p>
                  <p className="font-medium">{doctor?.specialization}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optional actions (only for Doctor/Admin/Superadmin) */}
        <AppointmentActions
          appointmentId={appointment.id}
          status={appointment.status}
          role={user?.role}
        />
      </main>
    </div>
  );
}
