"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ModalPageInterceptor({ modal }: { modal: string }) {
  const { id, entity } = useParams<{
    id: string;
    entity: string;
  }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    router.replace(`/${entity}/${id}`);
    return () => {
      router.push(
        `/${entity}/${id}/${modal}${searchParams.size ? `?${searchParams.toString()}` : ""}`,
      );
    };
  }, [id, entity, router, modal]);

  return null;
}
