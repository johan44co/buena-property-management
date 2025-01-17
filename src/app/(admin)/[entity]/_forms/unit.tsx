"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Property, Unit, User } from "@prisma/client";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const unitFormSchema = z.object({
  unitNumber: z.string().min(1, "Unit number is required"),
  rentAmount: z.number().min(1, "Rent amount is required"),
  isOccupied: z.boolean().default(false),
  leaseStart: z.date().optional(),
  leaseEnd: z.date().optional(),
  propertyId: z.string(),
  tenantId: z.string().optional(),
});

type UnitFormValues = z.infer<typeof unitFormSchema>;

export default function UnitForm({
  unit,
  properties,
  tenants,
  onSubmitHandler,
  title,
  description,
  submitText,
}: {
  unit?: Unit;
  properties: Property[];
  tenants: User[];
  onSubmitHandler: (unit: UnitFormValues) => void;
  title: string;
  description: string;
  submitText?: string;
}) {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: unit
      ? {
          ...unit,
          leaseStart: unit.leaseStart || undefined,
          leaseEnd: unit.leaseEnd || undefined,
          tenantId: unit.tenantId || undefined,
        }
      : {
          unitNumber: "",
          rentAmount: 0,
          isOccupied: false,
          leaseStart: undefined,
          leaseEnd: undefined,
          propertyId: undefined,
          tenantId: undefined,
        },
  });

  function onSubmit(data: UnitFormValues) {
    onSubmitHandler(data);
  }

  const [propertyInputOpen, setPropertyInputOpen] = useState(false);
  const [tenantInputOpen, setTenantInputOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="unit"
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property</FormLabel>
                  <FormControl>
                    <Popover
                      open={propertyInputOpen}
                      onOpenChange={setPropertyInputOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? properties.find(
                                (property) => property.id === field.value,
                              )?.name
                            : "Select property..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search property..." />
                          <CommandList>
                            <CommandEmpty>No property found.</CommandEmpty>
                            <CommandGroup>
                              {properties.map((property) => (
                                <CommandItem
                                  key={property.id}
                                  value={property.id}
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    setPropertyInputOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === property.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {property.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <FormControl>
                    <Popover
                      open={tenantInputOpen}
                      onOpenChange={setTenantInputOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? tenants.find(
                                (tenant) => tenant.id === field.value,
                              )?.name
                            : "Select tenant..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search tenant..." />
                          <CommandList>
                            <CommandEmpty>No tenant found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                key="null"
                                value={undefined}
                                onSelect={() => {
                                  field.onChange(undefined);
                                  setTenantInputOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === null
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                None
                              </CommandItem>
                              {tenants.map((tenant) => (
                                <CommandItem
                                  key={tenant.id}
                                  value={tenant.id}
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    setTenantInputOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === tenant.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {tenant.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Number</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Enter unit number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rent Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      autoComplete="off"
                      placeholder="Enter rent amount"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={Number(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOccupied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Occupied</SelectItem>
                      <SelectItem value="false">Vacant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaseStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease Start Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaseEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease End Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="unit">
          {submitText || "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
