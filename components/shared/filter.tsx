"use client";

import { Roles } from "@/lib/const";
import { Funnel } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Filter({
  placeholder,
  data,
  searchTerm,
}: {
  placeholder: string;
  searchTerm: string | string[] | undefined;
  data: string[];
}) {
  const [selected, setSelected] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );
  console.log({ searchTerm });
  useEffect(() => {
    if (data && typeof data === "string") {
      setSelected(data);
    } else {
      setSelected("");
    }
  }, [data]);

  const handleChange = (value: string) => {
    if (value === "none") {
      setSelected("");
      router.push(
        pathname +
          "?" +
          createQueryString(`${searchTerm?.toString()}`, undefined)
      );
    } else {
      setSelected(value);
      router.push(
        pathname + "?" + createQueryString(`${searchTerm?.toString()}`, value)
      );
    }
  };

  return (
    <div>
      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger>
          <Funnel />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Selection</SelectItem>
          {data.map((data, k) => (
            <SelectItem key={k} value={data}>
              {data}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
