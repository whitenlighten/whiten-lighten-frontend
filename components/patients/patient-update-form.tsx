"use client";

import { createPatientPost, updatePatientPatch } from "@/actions/patients";
import { BLOODGROUP, GENDER, GENOTYPE, MARITAL_STATUS } from "@/lib/const";
import { RELIGION, updatePatient } from "@/lib/schema";
import { PatientProps } from "@/lib/types";
import { calculateAge } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon, Mail, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export type UpdatePatientValues = z.infer<typeof updatePatient>;
export default function PatientUpdateForm({
  patient,
}: {
  patient: PatientProps | null | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const session = useSession();

  const router = useRouter();

  const form = useForm<UpdatePatientValues>({
    mode: "onChange",
    // resolver: zodResolver(updatePatient),
    defaultValues: {
      address: patient?.address ?? "",
      age: patient?.age?.toString() ?? age,
      alternatePhone: patient?.alternatePhone ?? "",
      bloodGroup: patient?.bloodGroup ?? "A_POS",
      country: patient?.country ?? "",
      dateOfBirth: patient?.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString()
        : "",
      email: patient?.email ?? "",
      emergencyName: patient?.emergencyName ?? "",
      emergencyPhone: patient?.emergencyPhone ?? "",
      emergencyRelation: patient?.emergencyRelation ?? "",
      firstName: patient?.firstName ?? "",
      gender: patient?.gender ?? "FEMALE",
      genotype: patient?.genotype ?? "AA",
      lastName: patient?.lastName ?? "",
      lga: patient?.lga ?? "",
      maritalStatus: patient?.maritalStatus ?? "SINGLE",
      middleName: patient?.middleName ?? "",
      occupation: patient?.occupation ?? "",
      phone: patient?.phone ?? "",
      religion: patient?.religion ?? "Christian",
      state: patient?.state ?? "",
      // registeredById: session.data?.user?.id,
      // registrationType: session.data?.user?.role,
    },
  });

  const calcAge = calculateAge(form.watch("dateOfBirth"));

  useEffect(() => {
    if (calcAge.toString() !== "") {
      setAge(calcAge.toString());
    }
  }, [calcAge]);

  // console.log({ patient });

  const handleSubmit = async (data: UpdatePatientValues) => {
    if (!isEditing) return;

    setIsLoading(true);
    console.log({ data });
    const res = await updatePatientPatch(data, patient?.id ?? "");

    if (res !== null) {
      toast.success("Patient updated successfully");
      router.push(`/patients/${patient?.patientId}`);
      setIsLoading(false);
    } else {
      toast.error("Patient was not updated");
      router.refresh();
      form.reset();
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form.getValues());
        }}
      >
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>Basic user information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>First Name *</FormLabel>
                    <Input
                      placeholder={"No information provided"}
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Last Name *</FormLabel>
                    <Input
                      placeholder={"No information provided"}
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Middle Name</FormLabel>
                    <Input
                      placeholder={"No information provided"}
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={!isEditing}
                          id="date"
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "No information provided"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date?.toISOString());
                            setOpen(false);

                            if (date) {
                              form.setValue(
                                "age",
                                calculateAge(date.toISOString()).toString()
                              );
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Age</FormLabel>
                    <Input
                      placeholder="No information provided"
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                      readOnly
                      disabled
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditing === false && patient?.gender === null ? (
                <div className=" flex flex-col gap-4">
                  <FormLabel>Gender</FormLabel>
                  <Input disabled placeholder="No information provided" />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          patient?.gender ? patient.gender : field.value
                        }
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={!isEditing}
                            className=" w-full"
                          >
                            <SelectValue placeholder="Select gentder"></SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER.map((gender, k) => (
                            <SelectItem className="" value={gender} key={k}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isEditing === false && patient?.maritalStatus === null ? (
                <div className=" flex flex-col gap-4">
                  <FormLabel>Marital Status</FormLabel>
                  <Input disabled placeholder="No information provided" />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={!isEditing}
                            className=" w-full"
                          >
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MARITAL_STATUS.map((marital_status, k) => (
                            <SelectItem
                              className=""
                              value={marital_status}
                              key={k}
                            >
                              {marital_status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isEditing === false && patient?.religion === null ? (
                <div className=" flex flex-col gap-4">
                  <FormLabel>Religion</FormLabel>
                  <Input disabled placeholder="No information provided" />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={!isEditing}
                            className=" w-full"
                          >
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RELIGION.map((religion, k) => (
                            <SelectItem className="" value={religion} key={k}>
                              {religion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Occupation *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEditing && patient?.bloodGroup === null ? (
                <div className=" flex flex-col gap-4">
                  <FormLabel>Blood Group</FormLabel>
                  <Input disabled placeholder="No information provided" />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={!isEditing}
                            className=" w-full"
                          >
                            <SelectValue placeholder="Select a blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BLOODGROUP.map((bloodgroup, k) => (
                            <SelectItem
                              className=""
                              value={bloodgroup.value}
                              key={k}
                            >
                              {bloodgroup.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!isEditing && patient?.genotype === null ? (
                <div className=" flex flex-col gap-4">
                  <FormLabel>Genotype</FormLabel>
                  <Input disabled placeholder="No information provided" />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="genotype"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genotype</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={!isEditing}
                            className=" w-full"
                          >
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENOTYPE.map((genotype, k) => (
                            <SelectItem className="" value={genotype} key={k}>
                              {genotype}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 mt-[30px]">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
            <CardDescription>Basic contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Phone Number *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alternatePhone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Alternate Phone Number *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email Address *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>State *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lga"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>L.G.A. *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Country *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Address *</FormLabel>
                  <Textarea
                    placeholder="No information provided"
                    disabled={!isEditing}
                    {...field}
                    className="border-blue-200 focus:border-blue-400"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-blue-100 mt-[30px]">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Emergency Contact Information
            </CardTitle>
            <CardDescription>
              Basic emergency contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Emergency Name *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Emergency Phone *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyRelation"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Emergency Relationship *</FormLabel>
                    <Input
                      placeholder="No information provided"
                      disabled={!isEditing}
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex mt-[20px] justify-end space-x-4">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
          )}
          {!isEditing && (
            <Button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsEditing(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Patient
            </Button>
          )}
          {isEditing && (
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Saving" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
