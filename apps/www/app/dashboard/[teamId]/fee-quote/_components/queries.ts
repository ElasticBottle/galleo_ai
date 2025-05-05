import { toast } from "@galleo/ui/components/ui/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backend } from "~/lib/client/backend";
import type { FeeQuoteFormValues } from "./schema";

export const listFeeQuoteItemsKey = (teamId: number) => [
  "fee-quote-items",
  teamId,
];
export const useListFeeQuoteItems = (teamId: number) => {
  return useQuery({
    queryKey: listFeeQuoteItemsKey(teamId),
    queryFn: async () => {
      const response = await backend.api["fee-quote"][":teamId"].$get({
        param: { teamId: teamId.toString() },
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to fetch fee quote items", error);
        throw new Error("Failed to fetch fee quote items");
      }
      const result = await response.json();
      return result.feeQuoteItems;
    },
  });
};

export const useUpsertFeeQuoteItems = (teamId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: FeeQuoteFormValues) => {
      const response = await backend.api["fee-quote"][":teamId"].$put({
        param: { teamId: teamId.toString() },
        json: values,
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to upsert fee quote items", error);
        throw new Error("Failed to upsert fee quote items");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Fee structure saved.");
      queryClient.invalidateQueries({ queryKey: listFeeQuoteItemsKey(teamId) });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
