"use client";

import { useQuery } from "@tanstack/react-query";
import { partnersService, resolvePartners } from "@/features/partners/partners.service";

export function usePartners() {
  const { data } = useQuery({
    queryKey: ["partners"],
    queryFn: () => partnersService.getPartners(),
  });
  return resolvePartners(data);
}
