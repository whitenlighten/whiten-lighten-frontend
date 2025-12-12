"use server";

import { getCurrentUser } from "@/actions/auth";
import { auth } from "@/auth";
import { API, URLS } from "@/lib/const";

export async function createClinicalNoteAction(formData: FormData) {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  if (!BEARER_TOKEN) {
    return { success: false, error: "Unauthorized" };
  }

  const getString = (fd: FormData, key: string): string | null => {
    const v = fd.get(key);
    return typeof v === "string" ? v : null;
  };

  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const patientId = formData.get("patientId") as string;

  const payload = {
    // SUBJECTIVE
    chiefComplaint: formData.get("chiefComplaint"),
    presentComplaint: formData.get("presentComplaint"),
    historyOfPresentComplaint: formData.get("historyOfPresentComplaint"),
    dentalHistory: formData.get("dentalHistory"),
    medicalHistory: formData.get("medicalHistory"),

    // OBJECTIVE
    eoe: formData.get("eoe"),
    ioe: formData.get("ioe"),
    observations: formData.get("observations"),
    investigation: formData.get("investigation"),
    vitals: {
      bloodPressure: Number(formData.get("bloodPressure") || 0),
      pulse: Number(formData.get("pulse") || 0),
      temperature: Number(formData.get("temperature") || 0),
    },

    // ASSESSMENT
    diagnosis: formData.get("diagnosis"),
    impression:
      getString(formData, "impression")
        ?.split(",")
        .map((i) => i.trim())
        .filter(Boolean) || [],
    doctorNotes: formData.get("doctorNotes"),

    // PLAN
    treatmentDone: formData.get("treatmentDone"),
    treatmentPlan: formData.get("treatmentPlan"),
    recommendedTreatments:
      getString(formData, "recommendedTreatments")
        ?.split(",")
        .map((i) => i.trim())
        .filter(Boolean) || [],

    medications: formData.get("medications"),
    dosageInstructions: formData.get("dosageInstructions"),
    estimatedDuration: formData.get("estimatedDuration"),
    requiresFollowUp: formData.get("requiresFollowUp") === "on",
    followUpDate: formData.get("followUpDate"),
    followUpInstructions: formData.get("followUpInstructions"),

    // META
    dentistName: `${user.firstName} ${user.lastName}`,
    dentistSignature: `${user.firstName![0]}${user.lastName![0]}`,
    date: new Date().toISOString().split("T")[0],
    extra: {},
  };

  const url = URLS.clinical_notes.add.replace("{patientId}", patientId);

  try {
    const res = await fetch(`${API}${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || "Failed to create note",
      };
    }
    console.log("RESPONSE", { res });

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const getAllClinicalNotes = async ({
  page,
  limit,
  query,
}: {
  page?: number;
  limit?: number;
  query?: string | string[] | null;
}) => {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) return null;

  const url = new URL(`${API}${URLS.clinical_notes.all}`);
  url.searchParams.set("page", page?.toString() ?? "1");
  url.searchParams.set("limit", limit?.toString() ?? "20");
  if (query) url.searchParams.set("q", query as string);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok) return null;

    const notes = result.data.data;
    const meta = result.data.meta;

    const records = notes.map((n: any) => ({
      ...n,
      fullLink: `/clinical/${n.patientId}/${n.id}`, // <— THIS IS THE FIX
    }));

    return {
      records,
      totalPage: meta.pages,
      currentPage: meta.page,
      totalRecord: meta.total,
      setLimit: meta.limit,
    };
  } catch (err) {
    console.log("Error fetching clinical notes:", err);
    return null;
  }
};
export async function getClinicalNoteById(patientId: string, noteId: string) {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) return null;

  const url = `${API}${URLS.clinical_notes.one.replace(
    "{patientId}",
    patientId
  )}?noteId=${noteId}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) return null;

    const noteArray = json?.data?.data;
    if (!Array.isArray(noteArray) || noteArray.length === 0) return null;
    return noteArray[0];
  } catch (err) {
    console.log("Error fetching clinical note", err);
    return null;
  }
}
export async function updateClinicalNoteAction(
  patientId: string,
  noteId: string,
  formData: FormData
) {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) return { success: false, error: "Unauthorized" };

  const getString = (key: string, fallback: any = null) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : fallback;
  };

  const parseList = (value: string | null) =>
    value ? value.split(",").map((v) => v.trim()) : [];

  const payload = {
    // SUBJECTIVE
    presentComplaint: getString("presentComplaint"),
    historyOfPresentComplaint: getString("historyOfPresentComplaint"),
    dentalHistory: getString("dentalHistory"),
    medicalHistory: getString("medicalHistory"),

    // OBJECTIVE
    eoe: getString("eoe"),
    ioe: getString("ioe"),
    observations: getString("observations"),
    investigation: getString("investigation"),

    // ASSESSMENT
    doctorNotes: getString("doctorNotes"),

    // PLAN
    treatmentDone: getString("treatmentDone"),
    treatmentPlan: getString("treatmentPlan"),
    recommendedTreatments: parseList(getString("recommendedTreatments")),
    estimatedDuration: getString("estimatedDuration"),
  };

  const url = `${API}${URLS.clinical_notes.update
    .replace("{patientId}", patientId)
    .replace("{noteId}", noteId)}`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok)
      return { success: false, error: data.message || "Update failed" };

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
