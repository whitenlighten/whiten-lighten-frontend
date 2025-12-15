import { getPatientsByID } from "@/actions/patients";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

type Params = Promise<{ patientId: string }>;

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: Params;
  }
) => {
  const { patientId } = await params;

  const patient = await getPatientsByID(patientId);

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const rawHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Patient Information</title>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
    </head>
    <body>
      <div class="bg-gray-50">
        <div class="max-w-6xl mx-auto p-6 space-y-6">
        <p class=" text-3xl font-extrabold text-center" >Patient Details<p/>
        <p class=" text-[20px] text-center">Whiten Lighten Clinic Practice</p>
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-black">
                {{firstName}} {{middleName}} {{lastName}}
              </h1>
              <div class="flex gap-2 text-gray-500">
                <span>Patient ID:</span>
                <span class="font-mono">{{patientId}}</span>
              </div>
              <div class="flex gap-2 mt-2">
                <span class="border rounded px-2 py-1 text-sm">{{status}}</span>
                <span class="border rounded px-2 py-1 text-sm">{{gender}}</span>
              </div>
            </div>
            <div class="text-right text-sm text-gray-500">
              <p>Last Updated: {{lastUpdated}}</p>
              <p>Registered: {{createdAt}}</p>
            </div>
          </div>

          <!-- Demographics -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="border rounded-lg bg-white shadow">
              <div class="p-4 border-b font-bold text-black">Demographics</div>
              <div class="p-4 grid grid-cols-2 gap-4">
                <div><p class="text-sm font-medium text-gray-500">Age</p><p>{{age}}</p></div>
                <div><p class="text-sm font-medium text-gray-500">Date of Birth</p><p>{{dateOfBirth}}</p></div>
                <div><p class="text-sm font-medium text-gray-500">Marital Status</p><p>{{maritalStatus}}</p></div>
                <div><p class="text-sm font-medium text-gray-500">Occupation</p><p>{{occupation}}</p></div>
                <div><p class="text-sm font-medium text-gray-500">Religion</p><p>{{religion}}</p></div>
              </div>
            </div>

            <!-- Contact -->
            <div class="border rounded-lg bg-white shadow">
              <div class="p-4 border-b font-bold text-black">Contact Information</div>
              <div class="p-4 space-y-3">
                <div><p class="text-sm text-gray-500 font-medium">Primary Phone</p><p>{{primaryPhone}}</p></div>
                <div><p class="text-sm text-gray-500 font-medium">Alternate Phone</p><p>{{alternatePhone}}</p></div>
                <div><p class="text-sm text-gray-500 font-medium">Email</p><p>{{email}}</p></div>
                <div><p class="text-sm  text-gray-500 font-medium">Address</p><p>{{address}}</p><p class="text-sm text-gray-500">{{state}}, {{country}}</p></div>
              </div>
            </div>

            <!-- Medical -->
            <div class="border rounded-lg bg-white shadow">
              <div class="p-4 border-b font-bold text-black">Medical Information</div>
              <div class="p-4 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div><p class="text-sm font-medium text-gray-500">Blood Group</p><p class="font-semibold text-red-600">{{bloodGroup}}</p></div>
                  <div><p class="text-sm font-medium text-gray-500">Genotype</p><p class="font-semibold text-red-600">{{genotype}}</p></div>
                </div>
                <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm font-medium text-red-800 mb-1">Allergies</p>
                  <p class="text-sm text-red-700">{{allergies}}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency + Insurance -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="border rounded-lg bg-white shadow">
              <div class="p-4 border-b font-bold text-black">Emergency Contact</div>
              <div class="p-4">
                <p>{{emergencyName}}</p>
                <p>{{emergencyPhone}}</p>
                <p>{{emergencyRelation}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  // Replace placeholders with actual patient values
  const html = rawHtml
    .replace(/{{patientId}}/g, patient.patientId || "No information provided")
    .replace(/{{firstName}}/g, patient.firstName || "No information provided")
    .replace(/{{middleName}}/g, patient.middleName || "")
    .replace(/{{lastName}}/g, patient.lastName || "No information provided")
    .replace(/{{gender}}/g, patient.gender || "No information provided")
    .replace(
      /{{dateOfBirth}}/g,
      patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toDateString()
        : "No information provided"
    )
    .replace(/{{age}}/g, patient.age?.toString() || "No information provided")
    .replace(/{{bloodGroup}}/g, patient.bloodGroup || "No information provided")
    .replace(/{{genotype}}/g, patient.genotype || "No information provided")
    .replace(/{{allergies}}/g, patient.allergies || "No information provided")
    .replace(
      /{{maritalStatus}}/g,
      patient.maritalStatus || "No information provided"
    )
    .replace(/{{occupation}}/g, patient.occupation || "No information provided")
    .replace(/{{religion}}/g, patient.religion || "No information provided")
    .replace(/{{status}}/g, patient.status || "No information provided")
    .replace(/{{primaryPhone}}/g, patient.phone || "No information provided")
    .replace(
      /{{alternatePhone}}/g,
      patient.alternatePhone || "No information provided"
    )
    .replace(/{{email}}/g, patient.email || "No information provided")
    .replace(/{{address}}/g, patient.address || "No information provided")
    .replace(/{{state}}/g, patient.state || "")
    .replace(/{{country}}/g, patient.country || "")
    .replace(
      /{{emergencyName}}/g,
      patient.emergencyName || "No information provided"
    )
    .replace(/{{emergencyPhone}}/g, patient.emergencyPhone || "")
    .replace(/{{emergencyRelation}}/g, patient.emergencyRelation || "")
    .replace(
      /{{createdAt}}/g,
      patient.createdAt
        ? new Date(patient.createdAt).toDateString()
        : "No information provided"
    )
    .replace(
      /{{lastUpdated}}/g,
      patient.updatedAt
        ? new Date(patient.updatedAt).toDateString()
        : "No information provided"
    )
    .replace(
      /{{approvedAt}}/g,
      patient.approvedAt
        ? new Date(patient.approvedAt).toDateString()
        : "No information provided"
    );

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${patient.patientId}-PATIENT-DETAILS.pdf"`,
    },
  });
};
