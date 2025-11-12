"use client";

import { getUserById, updateUserInfo } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/schema";
import { UserProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Label } from "../ui/label";

export type UpdateUserValues = z.infer<typeof updateUser>;

export function UserEditForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<UserProps | null | undefined>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await getUserById(id);
      setUser(user);
    };
    fetchUserInfo();
  }, [id]);

  const form = useForm<UpdateUserValues>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
      password: user?.password ?? "",
    },
    resolver: zodResolver(updateUser),
    mode: "all",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        password: user.password ?? "",
      });
    }
  }, [form, user]);

  const handleSubmit = async (data: UpdateUserValues) => {
    setIsLoading(true);
    try {
      const userInfo = await updateUserInfo(id, data);

      if (!userInfo) {
        toast.error("Something went wrong", {
          description: "Something went wrong with updating user information",
        });
        router.refresh();
        setIsDisabled(true);
      } else {
        toast.success("User Updated", {
          description: "User information was updated successfully",
        });
        router.push(`/users/${user?.id}`);
      }
    } catch (error) {
      toast.error("Update failed", {
        description: "Unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <div className="space-y-2">
                  <label>Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="user@whitenlighten.com"
                      disabled
                      defaultValue={user?.email}
                      required
                      className="pl-10 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <FormMessage />
                </div>
              </div>

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
                        disabled={isDisabled}
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
            <div>
              <div className="space-y-2">
                <Label className=" text-gray-400">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter secure password"
                    type={showPassword ? "text" : "password"}
                    defaultValue={user?.password}
                    required
                    className="pl-10 pr-12 border-blue-200 focus:border-blue-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}>
                    <EyeOff />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long and contain
                  letters and numbers
                </p>
                <FormMessage />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {!isDisabled ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDisabled(true)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Cancel
            </Button>
          )}
          {isDisabled ? (
            <Button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDisabled(false);
              }}
              className="bg-blue-600 hover:bg-blue-700">
              Edit User
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Saving Changes" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
