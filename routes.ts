export const publicRoutes = ["/", "/forgot-password", "/reset-password"];
export const protectedRoutes = [
  "/appointments",
  "/appointments/[id]",
  "/appointments/[id]/details",
  "/appointments/new",
  "/clinical",
  "/clinical/new",
  "/dashboard",
  "/patients",
  "/patients/new",
  "/patients/[patientId]",
  "/patients/[patientId]/appointments",
  "/patients/[patientId]/edit",
  "/patients/archived",
  "/users",
  "/users/new",
  "/users/[id]",
  "/users/[id]/edit",
];
export const authRoutes = ["/sign-in"];
export const apiAuthPrefix = "/api/auth";
export const defaultRoute = "/dashboard";
