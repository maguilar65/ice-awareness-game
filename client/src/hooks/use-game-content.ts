import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type GameContent, type InsertPlayerProgress } from "@shared/schema";

export function useGameContent() {
  return useQuery({
    queryKey: [api.content.list.path],
    queryFn: async () => {
      const res = await fetch(api.content.list.path);
      if (!res.ok) throw new Error("Failed to fetch game content");
      // Validate with Zod schema from API definition if needed, 
      // but for now we trust the shared schema type
      return (await res.json()) as GameContent[];
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertPlayerProgress) => {
      const res = await fetch(api.progress.update.path, {
        method: api.progress.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to update progress");
      return await res.json();
    },
    // We might want to invalidate queries if we were fetching progress, 
    // but for now just logging success is enough
    onSuccess: () => {
      console.log("Progress saved");
    },
  });
}
