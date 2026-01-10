import { getCurrentUser } from "@/actions/auth";
import { UserCreationForm } from "@/components/users/user-creation-form";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
  const user = await getCurrentUser();
  const session = user;

  if (!user) {
    redirect("/");
  }

  // Only admin can create users
  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600">
            Create a new system user with role assignment
          </p>
        </div>

        <UserCreationForm currentUserRole={user.role} />
      </main>
    </div>
  );
}
