"use client";
import PropertyForm from "@/app/(admin)/properties/property-form";
import { createProperty } from "@/util/property";
import { useRouter } from "next/navigation";

export default function Page() {
  const route = useRouter();
  return (
    <div className="container mx-auto p-4 pt-0">
      <PropertyForm
        title="Add New Property"
        description="Fill in the details below to add a new property."
        submitText="Create Property"
        onSubmitHandler={(property) => {
          createProperty(property).then((result) => {
            if (result.property) {
              route.push(`/properties/${result.property.id}`);
            }
          });
        }}
      />
    </div>
  );
}
