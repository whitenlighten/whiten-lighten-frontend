import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be greater than 8 characters" })
  .regex(/[a-z]/, {
    message: "Password must include at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must include at least one uppercase letter",
  })
  .regex(/\d/, { message: "Password must include at least one number" });

export const DENTAL_SERVICES = [
  "Aesthentic Medicine",
  "Dental & Orthodontics",
  "ENT/Ear Spa",
  "IV Therapy",
  "Wellness & Preventive cares",
  "WL Reach (Outreach & Corporate programs)",
] as const;

export const APPOINTMENT_TIMES = [
  "9:00am - 10:00am  1h",
  "11:00am - 12:00am  1h",
  "02:00pm - 03:00pm  1h",
  "03:00pm - 4:30pm  1h 30min",
] as const;

export const MARITAL_STATUS: MaritalStatus[] = [
  "SINGLE",
  "DIVORCED",
  "MARRIED",
  "SINGLE",
  "WIDOWED",
] as const;

export const RELIGION = ["Christian", "Muslim", "Other"] as const;
export const GENOTYPE = ["AA", "AS", "SS", "AC", "SC"] as const;

export const bookAppointment = z.object({
  firstName: z
    .string()
    .min(2, { message: "Firstname should be greater than two characters" }),
  lastName: z
    .string()
    .min(2, { message: "Lastname should be greater than two characters" }),
  email: z.email(),
  phone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number"),
  date: z.string(),
  timeSlot: z.enum(APPOINTMENT_TIMES, {
    message: "Please select a valid time",
  }),
  services: z.enum(DENTAL_SERVICES, {
    message: "Please select a valid service",
  }),
  marital_status: z.enum(MARITAL_STATUS, {
    message: "Please select a valid status",
  }),
  reason: z.string(),
});

export const sigIn = z.object({
  email: z.email(),
  password: z.string().min(2, { message: "Please enter a valid password" }),
});

export const createUser = z.object({
  email: z.email(),
  firstName: z
    .string()
    .min(2, { message: "Firstname should be greater than two characters" }),
  lastName: z
    .string()
    .min(2, { message: "Lastname should be greater than two characters" }),
  phone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number"),
  role: z.string(),
  password: passwordSchema,
});

export const updateUser = z.object({
  firstName: z
    .string()
    .min(2, { message: "Firstname should be greater than two characters" }),
  lastName: z
    .string()
    .min(2, { message: "Lastname should be greater than two characters" }),
  phone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number"),
  password: passwordSchema,
});

export const createPatient = z.object({
  firstName: z
    .string()
    .min(2, { message: "Firstname should be greater than two characters" }),
  lastName: z
    .string()
    .min(2, { message: "Lastname should be greater than two characters" }),
  email: z.email(),
  phone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number"),

  dob: z.string(),
  gender: z.enum(Gender, {
    message: "Please select a valid gender",
  }),
  age: z.string(),
  address: z
    .string()
    .min(2, { message: "Address should be greater than two characters" }),
  maritalStatus: z.enum(MaritalStatus, {
    message: "Please select a valid marital status",
  }),

  bloodGroup: z.enum(BloodGroup, {
    message: "Please select a valid blood group",
  }),

  registrationType: z.string().optional(),
  registeredById: z.string().optional(),
  registeredBy: z.string().optional(),
});

export const updatePatient = z.object({
  phone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number"),
  email: z.email(),
  firstName: z
    .string()
    .min(2, { message: "Firstname should be greater than two characters" }),
  lastName: z
    .string()
    .min(2, { message: "Lastname should be greater than two characters" }),
  middleName: z.string().optional(),
  gender: z.enum(Gender, {
    message: "Please select a valid gender",
  }),
  dateOfBirth: z.string(),
  age: z.string(),
  maritalStatus: z.enum(MaritalStatus, {
    message: "Please select a valid marital status",
  }),
  occupation: z
    .string()
    .min(2, { message: "Occupation should be greater than two characters" })
    .optional(),
  religion: z.enum(RELIGION, {
    message: "Please select a valid religion",
  }),
  bloodGroup: z.enum(BloodGroup, {
    message: "Please select a valid blood group",
  }),
  genotype: z.enum(GENOTYPE, {
    message: "Please select a valid genotype",
  }),
  alternatePhone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number")
    .optional(),
  address: z
    .string()
    .min(2, { message: "Address should be greater than two characters" }),
  state: z
    .string()
    .min(2, { message: "State should be greater than two characters" })
    .optional(),
  lga: z
    .string()
    .min(2, { message: "LGA should be greater than two characters" })
    .optional(),
  country: z
    .string()
    .min(2, { message: "Country should be greater than two characters" })
    .optional(),
  emergencyName: z
    .string()
    .min(2, {
      message: "Emergency name should be greater than two characters",
    })
    .optional(),
  emergencyPhone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number")
    .optional(),
  emergencyRelation: z
    .string()
    .min(2, {
      message: "Emergency relation should be greater than two characters",
    })
    .optional(),

  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  pastSurgicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  immunizationRecords: z.string().optional(),
  familyHistory: z.string().optional(),

  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  paymentMethod: z.string().optional(),
  // registrationType: z.string().optional(),
  // registeredById: z.string().optional(),
});
