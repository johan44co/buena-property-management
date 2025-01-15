"use client";

import PropertyForm from "@/app/(admin)/properties/form";
import { updateProperty } from "@/util/property";
import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function UpdateProperty({
  id,
  property,
}: {
  id: string;
  property?: Property;
}) {
  const router = useRouter();

  return (
    <PropertyForm
      title="Edit Property"
      description="Edit property details"
      submitText="Save"
      property={property ?? undefined}
      onSubmitHandler={(property) => {
        updateProperty(id, property).then((result) => {
          if (result.property) {
            router.push(`/properties`);
          }
        });
      }}
    />
  );
}
