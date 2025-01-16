"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

type UserData = Pick<User, "name" | "email">;

export const createUser = async (data: UserData) => {
  try {
    const session = await getSession();
    console.log(session);
    if (!session || !session.user?.id || session.user?.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: "tenant",
        createdById: session.user.id,
      },
    });

    return { user };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while creating the user" };
  }
};
