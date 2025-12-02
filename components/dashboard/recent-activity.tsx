"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Role } from "@prisma/client";

interface Activity {
  id: string;
  type: "appointment" | "patient" | "note" | "user";
  description: string;
  timestamp: Date;
  user: string;
  status?: "completed" | "pending" | "cancelled";
}

interface RecentActivityProps {
  userRole: Role;
  activities?: Activity[];
}

export function RecentActivity({ userRole, activities }: RecentActivityProps) {
  const getFilteredActivities = () => {
    // Patient role only sees their own activities
    if (userRole === Role.PATIENT) {
      return activities
        ?.filter(
          (activity) =>
            activity.type === "appointment" || activity.type === "note"
        )
        .slice(0, 5);
    }

    // Other roles see all relevant activities based on permissions
    let filteredActivities = activities;

    // FRONTDESK and NURSE don't see user management activities
    if (["FRONTDESK", "NURSE"].includes(userRole)) {
      filteredActivities = activities?.filter(
        (activity) => activity.type !== "user"
      );
    }

    return filteredActivities?.slice(0, 10);
  };

  const filteredActivities = getFilteredActivities();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {filteredActivities && filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    by {activity.user}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
                  </span>
                  {activity.status && (
                    <Badge
                      className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No recent activity
          </p>
        )}
      </div>
    </Card>
  );
}
