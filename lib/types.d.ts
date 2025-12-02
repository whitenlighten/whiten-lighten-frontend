import Appointment from "@/app/(private)/appointments/page";
import {
  AppointmentStatus,
  BloodGroup,
  Gender,
  MaritalStatus,
  Patient,
  PatientStatus,
  Role,
  User,
} from "@prisma/client";

interface IAuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: Session["user"] | undefined;
  isLoggedIn: boolean;
  error?: string;
}

type DecodedToken = {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  role: string;
};

interface DetailedAppointment extends Appointment {
  patient: Patient;
  doctor: User;
}

interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  staffCode: string;
  phone: string;
  role: string;
  password: string;
  specialization?: string;
  isActive: boolean;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface FetchUserProps {
  page?: number;
  limit?: number;
  doctorId?: string;
  patientId?: string;
  role?: string | string[] | undefined;
  query?: string | string[] | undefined;
  fields?: string[];
}

type GenotypeProps = "AA" | "AS" | "SS" | "AC" | "SC";
interface RegisteredByUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
interface PatientProps {
  id: string;
  patientId: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  gender: Gender;
  dateOfBirth: Date | null;
  age: number | null;
  maritalStatus: MaritalStatus | null;
  occupation: string | null;
  religion: "Christian" | "Muslim" | "Other" | null;
  bloodGroup: BloodGroup | null;
  genotype: GenotypeProps | null;
  phone: string;
  alternatePhone: string | null;
  email: string;
  address: string;
  state: string | null;
  lga: string | null;
  country: string;
  emergencyName: string | null;
  emergencyPhone: string | null;
  emergencyRelation: string | null;
  allergies: string | null;
  chronicConditions: string | null;
  pastMedicalHistory: string | null;
  pastSurgicalHistory: string | null;
  currentMedications: string | null;
  immunizationRecords: string | null;
  familyHistory: string | null;
  registrationType: Role;
  registeredById: string | null;
  registeredBy: RegisteredByUser | null;
  insuranceProvider: string | null;
  insuranceNumber: string | null;
  paymentMethod: string | null;
  primaryDoctorId: string | null;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date | null;
  deletedAt: Date | null;
  createdById: string | null;
  userId: string | null;
}

interface AppointmentProps {
  id: string;
  patientId?: string;
  doctorId?: string;
  date?: Date;
  timeslot: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt?: Date;
  reason?: string;
  service?: string;
  patient?: PatientProps;
}

interface DummyAppointmentProps {
  id: string;
  firstName: string;
  lastName: string;
  patientId: string;
  time: string;
  date: Date;
  email: string;
  phone: string;
  status: string;
  service: string;
  createdAt: Date;
}

interface FetchAppointmentProps
  extends Pick<
    FetchUserProps,
    "limit" | "page" | "query" | "doctorId" | "patientId"
  > {
  status?: string | string[] | undefined;
}
