"use client";

import { Card } from "@/components/ui/card";
import { Role } from "@prisma/client";
import { Users, Calendar, FileText, Activity } from "lucide-react";

interface DashboardStatsProps {
  userRole: Role;
  stats: {
    totalPatients: number;
    todayAppointments: number;
    clinicalNotes: number;
    activeUsers: number;
  };
}

export function DashboardStats({ userRole, stats }: DashboardStatsProps) {
  // Patient role doesn't see stats
  if (userRole === Role.PATIENT) {
    return null;
  }

  const getStatsForRole = () => {
    const baseStats = [
      {
        title: "Total Patients",
        value: stats.totalPatients,
        icon: Users,
        color: "text-blue-600",
      },
      {
        title: "Today's Appointments",
        value: stats.todayAppointments,
        icon: Calendar,
        color: "text-green-600",
      },
    ];

    // Add clinical notes stat for roles that can create notes
    if (["DOCTOR", "NURSE", "ADMIN", "SUPERADMIN"].includes(userRole)) {
      baseStats.push({
        title: "Clinical Notes",
        value: stats.clinicalNotes,
        icon: FileText,
        color: "text-orange-600",
      });
    }

    // Add active users stat for admin roles
    if (["ADMIN", "SUPERADMIN"].includes(userRole)) {
      baseStats.push({
        title: "Active Users",
        value: stats.activeUsers,
        icon: Activity,
        color: "text-purple-600",
      });
    }

    return baseStats;
  };

  const statsToShow = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsToShow.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className=" px-[20px] flex items-start gap-1">
            <Icon className={`w-4 h-4 ${stat.color}`} />
            <div className="">
              <div>
                <p className=" text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
