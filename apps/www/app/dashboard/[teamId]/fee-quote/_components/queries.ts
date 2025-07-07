import { toast } from "@galleo/ui/components/ui/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiOptions } from "~/lib/client/api";

export const useListFeeQuoteItems = (teamId: string) => {
  return useQuery(
    apiOptions.feeQuote.getItems.queryOptions({
      input: {
        teamId,
      },
    }),
  );
};

export const useUpsertFeeQuoteItems = (teamId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    apiOptions.feeQuote.upsertItem.mutationOptions({
      onSuccess: () => {
        toast.success("Fee structure saved.");
        queryClient.invalidateQueries({
          queryKey: apiOptions.feeQuote.getItems.queryKey({
            input: {
              teamId,
            },
          }),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};
