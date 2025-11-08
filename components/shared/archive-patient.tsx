"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { archivePatient, unarchivePatient } from "@/actions/patients";
import { toast } from "sonner";

export function ArchivePatientButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleArchive = async () => {
    setLoading(true);
    const result = await archivePatient(id);
    setLoading(false);

    if (result) {
      router.refresh();
      toast.success("Patient archived successfully!");
    } else {
      router.refresh();
      toast.error(result.error || "Failed to archive patient");
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handleArchive}
      className=" hover:bg-red-800 bg-[#f93e3e] w-full"
    >
      {loading ? "Archiving..." : "Archive Patient"}
    </Button>
  );
}

export function UnarchivePatientButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUnarchive = async () => {
    setLoading(true);
    const result = await unarchivePatient(id);
    setLoading(false);

    if (result) {
      router.refresh();
      toast.success("Patient unarchived successfully!");
    } else {
      router.refresh();
      toast.error(result.error || "Failed to unarchive patient");
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handleUnarchive}
      className=" hover:bg-red-800 bg-[#f93e3e] w-full"
    >
      {loading ? "Unarchiving..." : "Unarchive Patient"}
    </Button>
  );
}
