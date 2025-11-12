"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { APPOINTMENT_TIMES } from "@/lib/schema"; // ✅ import your constant

export function AppointmentForm({
  patients,
  doctors,
}: {
  patients: { id: string; name: string }[];
  doctors: { id: string; name: string; specialization?: string }[];
}) {
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    maritalStatus: "SINGLE",
    reason: "",
    service: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: form.date, // ISO format yyyy-mm-dd
        timeSlot: form.timeSlot.split("  ")[0], // ✅ strip the duration part e.g. "9:00am - 10:00am"
        maritalStatus: form.maritalStatus,
        reason: form.reason,
        service: form.service,
      };

      const res = await createAppointment(payload);
      if (res?.success) {
        toast.success("Appointment created successfully");
        router.push("/appointments");
      } else {
        toast.error(res?.message || "Failed to create appointment");
      }
    } catch (error) {
      toast.error("Error scheduling appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Patient</Label>
          <select
            required
            value={form.patientId}
            onChange={(e) => handleChange("patientId", e.target.value)}
            className="w-full border rounded-md px-3 py-2">
            <option value="">Select patient...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Doctor */}
      <Card>
        <CardHeader>
          <CardTitle>Select Doctor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Doctor</Label>
          <select
            required
            value={form.doctorId}
            onChange={(e) => handleChange("doctorId", e.target.value)}
            className="w-full border rounded-md px-3 py-2">
            <option value="">Select doctor...</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.specialization ? `– ${d.specialization}` : ""}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle>Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              required
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Time Slot</Label>
            <select
              required
              value={form.timeSlot}
              onChange={(e) => handleChange("timeSlot", e.target.value)}
              className="w-full border rounded-md px-3 py-2">
              <option value="">Select time...</option>
              {APPOINTMENT_TIMES.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Service</Label>
            <Input
              placeholder="General Consultation"
              value={form.service}
              onChange={(e) => handleChange("service", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Enter reason for visit..."
              value={form.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Marital Status</Label>
            <select
              value={form.maritalStatus}
              onChange={(e) => handleChange("maritalStatus", e.target.value)}
              className="w-full border rounded-md px-3 py-2">
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? "Submitting..." : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
}
