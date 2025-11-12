"use server";

import { auth } from "@/auth";
import { CreateUserValues } from "@/components/users/user-creation-form";
import { UpdateUserValues } from "@/components/users/user-edit-form";
import { API, URLS } from "@/lib/const";
import { FetchUserProps, UserProps } from "@/lib/types";
import { getCurrentUser } from "./auth";

// Dummy data store
let dummyUsers: any[] = [
  {
    id: "u1",
    name: "Admin One",
    email: "admin@example.com",
    phone: "08011111111",
    role: "admin",
    password_hash: "admin123", // ⚠️ dummy only, not secure
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "u2",
    name: "Dr. Smile",
    email: "dentist@example.com",
    phone: "08022222222",
    role: "dentist",
    password_hash: "dentist123",
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// Utility: generate unique IDs
function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function createUserAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (["SUPERADMIN", "ADMIN"].includes(user.role))
    return { success: false, error: "Insufficient permissions" };

  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!name || !email || !phone || !password || !role) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    // Duplicate email check
    const existingUser = dummyUsers.find((u) => u.email === email);
    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists",
      };
    }

    const validRoles = ["admin", "dentist", "receptionist", "assistant"];
    if (!validRoles.includes(role)) {
      return { success: false, error: "Invalid role selected" };
    }

    const newUser = {
      id: generateId("u"),
      name,
      email,
      phone,
      role,
      password_hash: password,
      status: "active",
      last_login: null,
      created_at: new Date().toISOString(),
    };

    dummyUsers.push(newUser);
    return { success: true, userId: newUser.id };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUsersAction() {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (!["SUPERADMIN", "ADMIN"].includes(user.role))
    return { success: false, error: "Insufficient permissions" };

  try {
    // Sort by created_at desc
    const users = [...dummyUsers].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return { success: true, users };
  } catch (err) {
    console.error("Error fetching users:", err);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function getUserByIdAction(userId: string) {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (!["SUPERADMIN", "ADMIN"].includes(user.role))
    return { success: false, error: "Insufficient permissions" };

  try {
    const targetUser = dummyUsers.find((u) => u.id === userId);
    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user: targetUser };
  } catch (err) {
    console.error("Error fetching user:", err);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function updateUserStatusAction(userId: string, status: string) {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (!["SUPERADMIN", "ADMIN"].includes(user.role))
    return { success: false, error: "Insufficient permissions" };

  try {
    const index = dummyUsers.findIndex((u) => u.id === userId);
    if (index === -1) return { success: false, error: "User not found" };

    dummyUsers[index].status = status;
    dummyUsers[index].updated_at = new Date().toISOString();

    return { success: true };
  } catch (err) {
    console.error("Error updating user status:", err);
    return { success: false, error: "Failed to update user status" };
  }
}

//DIVINE CHANGES
export const createUserPost = async (data: CreateUserValues) => {
  const url = `${API}${URLS.users.create}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;
  const payload = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    password: data.password,
    role: data.role,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Server error:", res.status);
      return null;
    }
    const data = await res.json();
    return data?.data ?? null;
  } catch (e: any) {
    if (e.name === "AbortError") {
      console.warn("Request timed out after 10s");
    } else {
      console.error("Unable to create staff", e);
    }
    return null;
  }
};

//Request URL Structure
//API/users?page=1&limit=20&role=ADMIN&q=Divine&fields=email%2CfirstName%2ClastName

export const getAllUsers = async ({
  fields,
  limit,
  page,
  query,
  role,
}: FetchUserProps) => {
  const stringFields = fields?.join(",");
  //   const url = `${API}${URLS.users.fetch}?page=${page}&limit=${limit}&role=${role}&q=${query}&fields=${stringFields}`;
  const url = new URL(`${API}${URLS.users.fetch}`);
  url.searchParams.set("page", page?.toString() ?? "");
  url.searchParams.set("limit", limit?.toString() ?? "");
  role &&
    url.searchParams.set("role", Array.isArray(role) ? role.join(",") : role);
  query &&
    url.searchParams.set("q", Array.isArray(query) ? query.join(",") : query);
  url.searchParams.set("fields", stringFields ?? "");

  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  // console.log(url.toString());

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(data.data.data);
    const success = data.success;
    const meta = data.data.meta;
    const records: UserProps[] = data.data.data;

    const totalPage = meta.pages;
    const currentPage = meta.page;
    const totalRecord = meta.total;
    const setLimit = meta.limit;

    if (success) {
      return {
        records: records,
        totalPage: totalPage,
        currentPage: currentPage,
        totalRecord: totalRecord,
        setLimit: setLimit,
      };
    }
    return null;
  } catch (e: any) {
    console.log("Error fetching users", e);
  }
};

export const getUserById = async (id: string) => {
  const url = `${API}${URLS.users.one.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    const data = await res.json();

    const user: UserProps = data.data;

    if (res.ok) {
      return user;
    }
    return null;
  } catch (e: any) {
    console.log("Unable to fetch user by ID", e);
  }
};

export const updateUserRole = async (id: string, role: string) => {
  const url = `${API}${URLS.users.update_role.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;
  const payload = { role };

  try {
    const res = await fetch(url, {
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    const data = await res.json();

    if (res.ok) {
      return data.data;
    }
    return null;
  } catch (e: any) {
    console.log("Unable to update user role", e);
  }
};

export const updateUserInfo = async (id: string, data: UpdateUserValues) => {
  const url = `${API}${URLS.users.update_user.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  };

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    console.log({ data });
    if (res.ok) {
      return data.data;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log("Unable to update user", e);
  }
};

export const reactivateUser = async (id: string) => {
  const url = `${API}${URLS.users.activate_user.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data.data;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log("Unable to activate user", e);
  }
};

export const deleteUser = async (id: string) => {
  const url = `${API}${URLS.users.delete.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data.data;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log("Unable to delete user", e);
  }
};
