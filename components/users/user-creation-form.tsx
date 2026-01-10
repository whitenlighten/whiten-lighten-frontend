"use client";

import { createUserPost } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { USER_ROLES } from "@/lib/const";
import { createUser } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
// import { createUserAction } from "@/app/actions/users";

export type CreateUserValues = z.infer<typeof createUser>;

export function UserCreationForm({
  currentUserRole,
}: {
  currentUserRole: "SUPERADMIN" | "ADMIN";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const AVAILABLE_ROLES =
    currentUserRole === "SUPERADMIN"
      ? USER_ROLES
      : USER_ROLES.filter((role) => role.value !== "ADMIN");

  const form = useForm<CreateUserValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phone: "",
      role: "",
    },
    resolver: zodResolver(createUser),
    mode: "all",
  });

  const selectedRole = form.watch("role");
  console.log({ selectedRole });

  async function handleSubmit(data: CreateUserValues) {
    setIsLoading(true);

    console.time("createUserPost");
    const response = await createUserPost(data);
    console.timeEnd("createUserPost");
    console.log({ response });
    if (response === null) {
      toast.error("Staff Was Not Created Successfully");
      form.reset();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.success("Staff Created Successfully");
      router.push("/users");
      form.reset();
    }
  }
  const selectedRoleData = AVAILABLE_ROLES.find(
    (role) => role.value === selectedRole
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Basic user details and contact information
            </CardDescription>
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
                      placeholder="Enter first name (e.g., John)"
                      required
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
                      placeholder="Enter last name (e.g., Smith)"
                      required
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email Address *</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="user@whitenlighten.com"
                        required
                        {...field}
                        className="pl-10 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormLabel>Phone Number *</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="08012345678"
                        required
                        {...field}
                        className="pl-10 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                )}
              />
            </div>
            <FormMessage />

            <FormLabel />
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Security Information
            </CardTitle>
            <CardDescription>
              Login credentials and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">Password *</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter secure password"
                      required
                      className="pl-10 pr-12 border-blue-200 focus:border-blue-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long and contain
                    letters and numbers
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Role Assignment */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Role Assignment
            </CardTitle>
            <CardDescription>
              Select the user&apos;s role and permissions level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_ROLES.map((role) => (
                <div
                  key={role.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === role.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  onClick={() =>
                    form.setValue("role", role.value, {
                      shouldValidate: true,
                    })
                  }>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{role.label}</h3>
                    <Badge className={role.color}>{role.value}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {role.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">
                      Key Permissions:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {role.permissions.slice(0, 2).map((permission, index) => (
                        <li key={index} className="flex items-center">
                          <UserCheck className="w-3 h-3 mr-1 text-green-500" />
                          {permission}
                        </li>
                      ))}
                      {role.permissions.length > 2 && (
                        <li className="text-gray-500">
                          +{role.permissions.length - 2} more...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <input type="hidden" {...field} />
                </FormItem>
              )}
            />

            {selectedRoleData && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">
                    Selected Role: {selectedRoleData.label}
                  </h4>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  {selectedRoleData.description}
                </p>
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    Full Permissions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {selectedRoleData.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-blue-700">
                        <UserCheck className="w-3 h-3 mr-2 text-blue-500" />
                        {permission}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-blue-200 text-blue-600 hover:bg-blue-50">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !selectedRole}
            className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Creating" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
