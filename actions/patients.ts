"use server";

import { auth } from "@/auth";
import { CreatePatientValues } from "@/components/patients/patient-registration-form";
import { UpdatePatientValues } from "@/components/patients/patient-update-form";
import { API, URLS } from "@/lib/const";
import { AppointmentProps, FetchUserProps, PatientProps } from "@/lib/types";

export const getAllPatients = async ({
  fields,
  limit,
  page,
  query,
}: FetchUserProps) => {
  const stringFields = fields?.join(",");
  const url = new URL(`${API}${URLS.patients.all}`);
  url.searchParams.set("page", page?.toString() ?? "");
  url.searchParams.set("limit", limit?.toString() ?? "");
  query &&
    url.searchParams.set("q", Array.isArray(query) ? query.join(",") : query);
  url.searchParams.set("fields", stringFields ?? "");

  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  // console.log(url.toString());

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(data.data.data);
    const success = data.success;
    const meta = data.data.meta;
    const records: PatientProps[] = data.data.data;

    const totalPage = meta.pages;
    const currentPage = meta.page;
    const totalRecord = meta.total;
    const setLimit = meta.limit;

    if (success) {
      return {
        records: records,
        totalPage: totalPage,
        currentPage: currentPage,
        totalRecord: totalRecord,
        setLimit: setLimit,
      };
    }
    return null;
  } catch (e: any) {
    console.log("Error fetching patients", e);
  }
};

export const getPatientsByID = async (id: string) => {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;
  const url = `${API}${URLS.patients.oneByPatientId.replace(
    "{patientId}",
    id
  )}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    const patient: PatientProps = data.data;

    if (res.ok) {
      return patient;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log("Unable to fetch patient by patient ID", e);
  }
};

export const createPatientPost = async (value: CreatePatientValues) => {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;
  const url = `${API}${URLS.patients.create}`;

  try {
    const payload = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone,
      dateOfBirth: value.dob,
      age: value.age,
      gender: value.gender,
      address: value.address,
      maritalStatus: value.maritalStatus,
      bloodGroup: value.bloodGroup,
      registeredById: value.registeredById,
      registrationType: value.registrationType,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // console.log({ res });

    // console.log("Data", data);

    if (res.ok) {
      return data.data;
    } else return null;
  } catch (e: any) {
    console.log("Unable to create patient ", e);
  }
};

export const updatePatientPatch = async (
  value: UpdatePatientValues,
  id: string
) => {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;
  const url = `${API}${URLS.patients.update.replace("{id}", id)}`;

  try {
    const payload = {
      address: value.address,
      age: value.age,
      alternatePhone: value.alternatePhone,
      bloodGroup: value.bloodGroup,
      country: value.country,
      dateOfBirth: value.dateOfBirth,
      email: value.email,
      emergencyName: value.emergencyName,
      emergencyPhone: value.emergencyPhone,
      emergencyRelation: value.emergencyRelation,
      firstName: value.firstName,
      gender: value.gender,
      genotype: value.genotype,
      lastName: value.lastName,
      lga: value.lga,
      maritalStatus: value.maritalStatus,
      occupation: value.occupation,
      phone: value.phone,
      religion: value.religion,
      state: value.state,
      middleName: value.middleName,
    };

    const fixedPayload = Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, v === "" ? null : v])
    );

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fixedPayload),
    });

    const data = await res.json();

    // console.log({ res });
    // console.log({ fixedPayload });

    // console.log("Data", data);

    if (res.ok) {
      return data.data;
    } else return null;
  } catch (e: any) {
    console.log("Unable to update patient ", e);
  }
};

export const getPatientsByPatientID = async (patientId: string) => {
  const url = `${API}${URLS.patients.oneByPatientId.replace(
    "{patientId}",
    patientId
  )}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    const patient: PatientProps = data.data;
    if (res.ok) {
      return patient;
    }
    return null;
  } catch (e: any) {
    console.log("Unable to fetch patient by ID", e);
  }
};

export const approvePatient = async (id: string) => {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  const url = `${API}${URLS.patients.approve.replace("{patientId}", id)}`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok) {
      return data.data;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log("Unable to approve patient", e);
  }
};

export const archivePatient = async (id: string) => {
  const url = `${API}${URLS.patients.archive.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data.data;
    }
    return null;
  } catch (e: any) {
    console.log("Unable to archive patient", e);
    return null;
  }
};

export const unarchivePatient = async (id: string) => {
  const url = `${API}${URLS.patients.unarchive.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data.data;
    }
    return null;
  } catch (e: any) {
    console.log("Unable to UNarchive patient", e);
    return null;
  }
};

export const getAllArchivedPatients = async ({
  fields,
  limit,
  page,
  query,
}: FetchUserProps) => {
  const stringFields = fields?.join(",");
  const url = new URL(`${API}${URLS.patients.allArchived}`);
  url.searchParams.set("page", page?.toString() ?? "");
  url.searchParams.set("limit", limit?.toString() ?? "");
  query &&
    url.searchParams.set("q", Array.isArray(query) ? query.join(",") : query);
  url.searchParams.set("fields", stringFields ?? "");

  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  // console.log(url.toString());

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(data.data.data);
    const success = data.success;
    const meta = data.data.meta;
    const records: PatientProps[] = data.data.data;

    const totalPage = meta.pages;
    const currentPage = meta.page;
    const totalRecord = meta.total;
    const setLimit = meta.limit;

    if (success) {
      return {
        records: records,
        totalPage: totalPage,
        currentPage: currentPage,
        totalRecord: totalRecord,
        setLimit: setLimit,
      };
    }
    return null;
  } catch (e: any) {
    console.log("Error fetching patients", e);
  }
};

export const getAppointmentsForPatient = async (
  id: string,
  { fields, limit, page, query }: FetchUserProps
) => {
  const url = new URL(
    `${API}${URLS.patients.appointmentHistory.replace("{id}", id)}`
  );
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  const stringFields = fields?.join(",");

  url.searchParams.set("page", page?.toString() ?? "");
  url.searchParams.set("limit", limit?.toString() ?? "");
  query &&
    url.searchParams.set("q", Array.isArray(query) ? query.join(",") : query);
  url.searchParams.set("fields", stringFields ?? "");

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const data = await res.json();
    // console.log(data.data.data);
    const success = data.success;
    const meta = data.data.meta;
    const records: AppointmentProps[] = data.data.data;

    const totalPage = meta.pages;
    const currentPage = meta.page;
    const totalRecord = meta.total;
    const setLimit = meta.limit;

    if (res.ok) {
      return {
        records: records,
        totalPage: totalPage,
        currentPage: currentPage,
        totalRecord: totalRecord,
        setLimit: setLimit,
      };
    }
    return null;
  } catch (e: any) {
    console.log("Unable to fetch appointment history", e);
  }
};
