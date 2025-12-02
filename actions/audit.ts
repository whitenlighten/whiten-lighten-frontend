import { auth } from "@/auth";
import { API, URLS } from "@/lib/const";

export const getRecentActivities = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  const url = new URL(`${API}${URLS.audit.all}`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const activities = data.data.data.map((item: any) => ({
        id: item.id,

        // 🔥 Map entityType from backend → type expected by UI
        type:
          item.entityType?.toLowerCase() === "appointment"
            ? "appointment"
            : item.entityType?.toLowerCase() === "patient"
            ? "patient"
            : item.entityType?.toLowerCase() === "user"
            ? "user"
            : "system",

        // 🔥 Fallback to human-readable actionDescription
        description: item.actionDescription || "Activity recorded",

        timestamp: new Date(item.createdAt),

        // 🔥 Map user relation if present
        user: item.user?.firstName
          ? `${item.user.firstName} ${item.user.lastName}`
          : item.actorRole
          ? item.actorRole
          : "System",

        // Some audit actions may have status
        status: item.details?.status || undefined,
      }));

      return {
        activities,
        meta: data.data.meta,
      };
    }

    return { activities: [], meta: null };
  } catch (e) {
    console.error("Error fetching recent activities:", e);
    return { activities: [], meta: null };
  }
};
