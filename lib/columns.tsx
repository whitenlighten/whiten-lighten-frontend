"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AppointmentStatus, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisVertical, Eye, SquarePen } from "lucide-react";
import Link from "next/link";
import { AppointmentProps, PatientProps, UserProps } from "./types";
import {
  getActiveBadgeColor,
  getAppointmentStatusColor,
  getPatientStatusColor,
  getRoleBadgeColor,
} from "./utils";

export const user_columns: ColumnDef<UserProps>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => {
      return <div className=" ">{row.original.firstName}</div>;
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "phone",
    header: "Phone Address",
    cell: ({ row }) => {
      return <div className="">{row.original.phone ?? "- - "}</div>;
    },
  },
  {
    accessorKey: "staffCode",
    header: "Staff Code",
  },
  {
    accessorKey: "role",
    header: () => <div className=" text-center">Role</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold py-[7px] text-[12px]  text-center cursor-default rounded-full ${getRoleBadgeColor(
              row.original.role as Role
            )}`}>
            {row.original.role}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className=" text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getActiveBadgeColor(
              row.original.isActive
            )}`}>
            {row.original.isActive ? "ACTIVE" : "INACTIVE"}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      return (
        <div className="">
          {format(row.original.lastLogin ?? new Date(), "PPPP")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className=" cursor-pointer">
            <EllipsisVertical className=" w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" flex flex-col gap-3 py-[10px] px-[20px]">
            <Link
              href={`/users/${row.original.id}`}
              className=" flex gap-3 items-center">
              <Eye className=" w-4 h-4" />
              <p>View user</p>
            </Link>
            {row.original.isActive && (
              <Link
                href={`/users/${row.original.id}/edit`}
                className=" flex gap-3 items-center">
                <SquarePen className=" w-4 h-4" />
                <p>Edit user</p>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const patient_columns: ColumnDef<PatientProps>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => {
      return <div className=" ">{row.original.firstName}</div>;
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "phone",
    header: "Phone Address",
  },

  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      return (
        <div className="">
          <p className=" capitalize">
            {row.original.gender?.toLowerCase() ?? "No Information"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => {
      return (
        <p className=" text-[12px] pl-[10px] bg-gray-300/30 rounded-[6px] py-[5px]  font-mono">
          {row.original.patientId}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className=" text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getPatientStatusColor(
              row.original.status
            )}`}>
            {row.original.status}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "registeredBy",
    header: () => <div className=" text-center">Registered By</div>,
    cell: ({ row }) => {
      const registeredBy = row.original.registeredBy;
      if (!registeredBy)
        return <div className="text-center text-gray-400">-</div>;

      return (
        <>
          <div
            className={` font-bold py-[7px] text-[12px]  text-center cursor-default rounded-full ${getRoleBadgeColor(
              registeredBy.role as Role
            )}`}>
            {registeredBy.role}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "registrationType",
    header: () => <div className=" text-center">Registeration Method</div>,
    cell: ({ row }) => {
      const registeredMethod = row.original.registrationType;
      if (!registeredMethod)
        return <div className="text-center text-gray-400">-</div>;

      return (
        <>
          <div
            className={` font-bold py-[7px] text-[12px]  text-center cursor-default rounded-full ${getRoleBadgeColor(
              registeredMethod
            )}`}>
            {registeredMethod}
          </div>
        </>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className=" cursor-pointer">
            <EllipsisVertical className=" w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" flex flex-col gap-3 py-[10px] px-[20px]">
            <Link
              href={`/patients/${row.original.patientId}`}
              className=" flex gap-3 items-center">
              <Eye className=" w-4 h-4" />
              <p>View patient</p>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const clinical_notes_columns: ColumnDef<any>[] = [
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => (
      <p className="text-[12px] pl-[10px] ">{row.original.patientId}</p>
    ),
  },
  {
    accessorKey: "presentComplaint",
    header: "Present Complaint",
    cell: ({ row }) => row.original.extendedData?.presentComplaint ?? "—",
  },
  {
    accessorKey: "treatmentPlan",
    header: "Treatment Plan",
    cell: ({ row }) => row.original.treatmentPlan ?? "—",
  },
  {
    accessorKey: "observations",
    header: "Observations",
    cell: ({ row }) => row.original.observations ?? "—",
  },
  {
    accessorKey: "dentistName",
    header: "Doctor",
    cell: ({ row }) => row.original.extendedData?.dentistName ?? "—",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => row.original.extendedData?.date,
  },

  // {
  //   accessorKey: "status",
  //   header: () => <div className="text-center">Status</div>,
  //   cell: ({ row }) => (
  //     <div className="font-bold cursor-default py-[7px] px-[15px] text-[12px] text-center rounded-full bg-blue-100 text-blue-700">
  //       {row.original.status}
  //     </div>
  //   ),
  // },
];
export const appointment_columns: ColumnDef<AppointmentProps>[] = [
  {
    accessorKey: "patientId",
    header: " Patient ID",
    cell: ({ row }) => {
      return (
        <p className=" text-[12px] pl-[10px] bg-gray-300/30 rounded-[6px] py-[5px]  font-mono">
          {row.original.patient?.patientId}
        </p>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => {
      return <div className=" ">{row.original.patient?.firstName}</div>;
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => {
      return <div className=" ">{row.original.patient?.lastName}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => {
      return <div className=" ">{row.original.patient?.email}</div>;
    },
  },
  {
    accessorKey: "service",
    header: "Service Type",
    cell: ({ row }) => {
      return <div className=" w-[150px] truncate ">{row.original.service}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Appointment Time",
    cell: ({ row }) => {
      // return <div className=" ">{row.original.patient.}</div>;
      return <div className=" ">{row.original.timeslot}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Appointment Date",
    cell: ({ row }) => {
      return (
        <div className="">
          {format(row.original.date ?? new Date(), "PPPP")}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => {
      return <div className=" ">{row.original.patient?.phone}</div>;
    },
  },

  {
    accessorKey: "status",
    header: () => <div className=" text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getAppointmentStatusColor(
              row.original.status as AppointmentStatus
            )}`}>
            {row.original.status}
          </div>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className=" cursor-pointer">
            <EllipsisVertical className=" w-4 h-4" />
          </DropdownMenuTrigger>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuContent className=" cursor-pointer flex flex-col gap-3 py-[10px] px-[20px]">
                <div className=" flex gap-3 items-center">
                  <Eye className=" w-4 h-4" />
                  <p>View Information</p>
                </div>
              </DropdownMenuContent>
            </DialogTrigger>
            <DialogContent>
              <ScrollArea className=" h-[500px] md:h-full">
                <DialogTitle>Appointment Information</DialogTitle>

                <div className=" flex flex-col gap-6 mt-[20px]">
                  <div className=" flex items-center gap-2 justify-between">
                    <span className=" flex items-center gap-2">
                      <p className=" font-medium">Assigned Patient ID:</p>
                      <p className=" text-[12px] px-[10px] bg-gray-300/30 rounded-[6px] py-[5px]  font-mono">
                        {row.original.patient?.patientId}
                      </p>
                    </span>
                    <div
                      className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getAppointmentStatusColor(
                        row.original.status as AppointmentStatus
                      )}`}>
                      {row.original.status}
                    </div>
                  </div>

                  <div className=" grid grid-cols-1 md:grid-cols-2  ">
                    <div className="">
                      <span>
                        <p className=" font-medium">Name:</p>
                        {row.original.patient?.firstName}{" "}
                        {row.original.patient?.lastName}
                      </span>
                      <p>
                        <span className=" font-medium">Phone Number:</span>
                        <br />
                        {row.original.patient?.phone}
                      </p>
                    </div>
                    <div className="">
                      <span>
                        <p className=" font-medium">Time:</p>

                        {row.original.timeslot}
                      </span>
                      <span>
                        <p className=" font-medium">Date:</p>
                        {format(row.original.date ?? new Date(), "PPPP")}
                      </span>
                    </div>
                  </div>

                  <div className=" bg-gray-400/20 py-[10px] px-[15px] rounded-[20px]">
                    <p className=" font-medium">Service Type:</p>
                    <div className="">
                      <p>{row.original.service}</p>
                    </div>
                  </div>

                  <div className=" bg-gray-400/20 py-[10px] px-[15px] rounded-[20px]">
                    <p className=" font-medium">Reason:</p>
                    <div className="">
                      <p>{row.original.reason}</p>
                    </div>
                  </div>

                  <Button>
                    <Link href={`appointments/${row.original.id}/details`}>
                      Expand Details
                    </Link>
                  </Button>

                  {/* <DialogFooter className=" grid md:grid-cols-4 grid-cols-1">
                    {row.original.status === "COMPLETED" ? null : row.original
                        .status === "CONFIRMED" ? (
                      <>
                        <CompleteAppointment appointmentId={row.original.id} />
                        <CancelAppointment appointmentId={row.original.id} />
                      </>
                    ) : row.original.status === "PENDING" ? (
                      <ApproveAppointment appointmentId={row.original.id} />
                    ) : null}

                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter> */}
                </div>

                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      );
    },
  },
];

export const mini_appointment_columns: ColumnDef<AppointmentProps>[] = [
  {
    accessorKey: "service",
    header: "Service Type",
    cell: ({ row }) => {
      return <div className=" w-[150px] truncate ">{row.original.service}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Appointment Time",
    cell: ({ row }) => {
      // return <div className=" ">{row.original.patient.}</div>;
      return <div className=" ">{row.original.timeslot}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Appointment Date",
    cell: ({ row }) => {
      return (
        <div className="">
          {format(row.original.date ?? new Date(), "PPPP")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className=" text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getAppointmentStatusColor(
              row.original.status as AppointmentStatus
            )}`}>
            {row.original.status}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="">
          {format(row.original.createdAt ?? new Date(), "PPPP")}
        </div>
      );
    },
  },
];
