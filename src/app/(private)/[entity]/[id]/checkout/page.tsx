"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PageCheckout() {
  const { id, entity } = useParams<{
    id: string;
    entity: string;
  }>();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${entity}/${id}`);
    return () => {
      router.push(`/${entity}/${id}/checkout`);
    };
  }, [id, entity, router]);

  return null;
}
