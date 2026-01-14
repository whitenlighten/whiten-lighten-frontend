import { ForgotPasswordForm } from "@/components/auth/forgot-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Whiten Lighten",
  description: "Reset your password for your Whiten Lighten dental practice management system account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md">
              <Card>
                  <CardHeader className="text-center">
                      <CardTitle className="text-xl md:text-2xl">
                          Forgot Password
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                          Enter your email address and we&apos;ll send you a
                          link to reset your password
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ForgotPasswordForm />
                  </CardContent>
              </Card>
          </div>
      </div>
  );
}
