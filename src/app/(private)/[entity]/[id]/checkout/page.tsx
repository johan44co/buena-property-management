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
    router.push(`/${entity}/${id}`);
    setTimeout(() => {
      router.push(`/${entity}/${id}/checkout`);
    }, 100);
  }, [id, entity, router]);

  return null;
}
