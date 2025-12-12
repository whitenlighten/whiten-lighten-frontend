"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar,
  FileText,
  Users,
  User,
  Clock,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Role } from "@prisma/client";

interface QuickActionsProps {
  userRole: Role;
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const getActionsForRole = () => {
    // Default shared actions
    const baseActions = [
      {
        title: "View Today's Schedule",
        description: "Check today's appointments",
        href: "/appointments",
        icon: Clock,
        color: "bg-purple-600 hover:bg-purple-700",
        available: true,
      },
    ];

    // ✅ Role-based conditional actions
    if (
      userRole === Role.ADMIN ||
      userRole === Role.SUPERADMIN ||
      userRole === Role.FRONTDESK ||
      userRole === Role.NURSE
    ) {
      // Admin, Superadmin, Frontdesk, and Nurse can schedule appointments
      baseActions.unshift({
        title: "Schedule Appointment",
        description: "Book a new appointment",
        href: "/appointments/new",
        icon: Calendar,
        color: "bg-blue-600 hover:bg-blue-700",
        available: true,
      });
      baseActions.push({
        title: "View Patients",
        description: "See assigned patient records",
        href: "/patients",
        icon: Search,
        color: "bg-orange-600 hover:bg-orange-700",
        available: true,
      });
    }

    // ✅ Doctors can ONLY view patients, not add
    if (userRole === Role.DOCTOR) {
      baseActions.push({
        title: "View Patients",
        description: "See assigned patient records",
        href: "/patients",
        icon: Search,
        color: "bg-orange-600 hover:bg-orange-700",
        available: true,
      });
    } else if (
      userRole === Role.ADMIN ||
      userRole === Role.SUPERADMIN ||
      userRole === Role.FRONTDESK ||
      userRole === Role.NURSE
    ) {
      baseActions.push({
        title: "Add Patient",
        description: "Register a new patient",
        href: "/patients/new",
        icon: Users,
        color: "bg-green-600 hover:bg-green-700",
        available: true,
      });
      // baseActions.push({
      //   title: "Search Patients",
      //   description: "Find patient records",
      //   href: "/patients",
      //   icon: Search,
      //   color: "bg-orange-600 hover:bg-orange-700",
      //   available: true,
      // });
    }

    // ✅ Clinical notes (doctors + nurses + admins)
    if (userRole === Role.DOCTOR) {
      baseActions.push({
        title: "Add Clinical Note",
        description: "Document patient treatment",
        href: "/clinical/new",
        icon: FileText,
        color: "bg-indigo-600 hover:bg-indigo-700",
        available: true,
      });
    }
    if (
      userRole === Role.DOCTOR ||
      userRole === Role.NURSE ||
      userRole === Role.ADMIN ||
      userRole === Role.SUPERADMIN
    ) {
      baseActions.push({
        title: "View Clinical Notes",
        description: "Document patient treatment",
        href: "/clinical",
        icon: FileText,
        color: "bg-indigo-600 hover:bg-indigo-700",
        available: true,
      });
    }

    // ✅ Only admins & superadmins manage users
    if (userRole === Role.ADMIN || userRole === Role.SUPERADMIN) {
      baseActions.push({
        title: "Manage Users",
        description: "Add or edit system users",
        href: "/users",
        icon: User,
        color: "bg-red-600 hover:bg-red-700",
        available: true,
      });
    }

    return baseActions.filter((action) => action.available);
  };

  const actions = getActionsForRole();

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className={`w-full justify-start h-auto p-4 border-2 hover:border-blue-300 transition-all group ${
                  action.color.includes("blue")
                    ? "border-blue-200"
                    : "border-gray-200"
                }`}>
                <div className="flex items-center space-x-3 w-full">
                  <div
                    className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {action.title}
                    </p>
                    <p className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-blue-100 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Practice Hours
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Monday - Saturday :
                <br />
                9:00 AM - 5:00 PM <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
