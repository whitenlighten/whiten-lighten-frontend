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
        type: item.module || "system",
        description: item.actionDescription || item.description,
        timestamp: new Date(item.createdAt),
        user: item.user?.firstName
          ? `${item.user.firstName} ${item.user.lastName}`
          : item.user?.email || "System",
        status: item.status || undefined,
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
