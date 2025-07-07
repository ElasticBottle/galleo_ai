"use client";
import { Button } from "@galleo/ui/components/ui/button";
import {
  arktypeResolver,
  useFieldArray,
  useForm,
} from "@galleo/ui/components/ui/form";
import { Input } from "@galleo/ui/components/ui/input";
import { Skeleton } from "@galleo/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@galleo/ui/components/ui/table";
import { useEffect } from "react";
import { useListFeeQuoteItems, useUpsertFeeQuoteItems } from "./queries";
import { type FeeQuoteFormValues, feeQuoteFormSchema } from "./schema";

export function QuoteForm({ teamId }: { teamId: string }) {
  const { data: feeData, isLoading } = useListFeeQuoteItems(teamId);
  const { mutate: upsertFeeItems, isPending: isSaving } =
    useUpsertFeeQuoteItems(teamId);

  const form = useForm<FeeQuoteFormValues>({
    resolver: arktypeResolver(feeQuoteFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Populate form with fetched data
  useEffect(() => {
    if (feeData) {
      form.reset({ items: feeData.feeQuoteItems ?? [] });
    }
  }, [feeData, form]);

  const onSubmit = (values: FeeQuoteFormValues) => {
    upsertFeeItems({
      teamId,
      items: values.items,
    });
  };

  const addRow = () => {
    append({
      description: "",
      basePriceUnit: 0,
      basePriceDecimal: 2,
      basePriceCurrency: "SGD",
      professionalPriceUnit: 0,
      professionalPriceDecimal: 2,
      professionalPriceCurrency: "SGD",
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Fee Quote Structure</h1>
          <p className="text-muted-foreground">
            Manage your fee structure for client quotes.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSaving || !form.formState.isDirty}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Description</TableHead>
                <TableHead>Base Price ($)</TableHead>
                <TableHead>Professional Price ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell className="h-14 text-center">
                    <Skeleton className="h-6 w-38" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-14" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                </TableRow>
              ) : fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No fee items added yet.
                  </TableCell>
                </TableRow>
              ) : (
                fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input
                        {...form.register(`items.${index}.description`)}
                        placeholder="Enter description"
                        className={
                          form.formState.errors.items?.[index]?.description
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {form.formState.errors.items?.[index]?.description && (
                        <p className="mt-1 text-destructive text-sm">
                          {
                            form.formState.errors.items[index].description
                              .message
                          }
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...form.register(`items.${index}.basePriceUnit`, {
                          valueAsNumber: true,
                        })}
                        placeholder="0"
                        className={
                          form.formState.errors.items?.[index]?.basePriceUnit
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {form.formState.errors.items?.[index]?.basePriceUnit && (
                        <p className="mt-1 text-destructive text-sm">
                          {
                            form.formState.errors.items[index].basePriceUnit
                              .message
                          }
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...form.register(
                          `items.${index}.professionalPriceUnit`,
                          { valueAsNumber: true },
                        )}
                        placeholder="0"
                        className={
                          form.formState.errors.items?.[index]
                            ?.professionalPriceUnit
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {form.formState.errors.items?.[index]
                        ?.professionalPriceUnit && (
                        <p className="mt-1 text-destructive text-sm">
                          {
                            form.formState.errors.items[index]
                              .professionalPriceUnit.message
                          }
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        {/* Add Trash Icon Here if available */}
                        <span className="text-xs">X</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Button type="button" variant="outline" onClick={addRow}>
          + Add Row
        </Button>
      </form>
    </div>
  );
}
