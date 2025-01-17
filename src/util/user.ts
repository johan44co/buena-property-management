"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

type UserData = Pick<User, "name" | "email">;

export const createUser = async (data: UserData) => {
  try {
    const session = await getSession();
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

export const getUser = async (id: string) => {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id, createdById: session.user.id },
    });

    return { user };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching the user" };
  }
};

export const updateUser = async (id: string, data: UserData) => {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.update({
      where: { id, createdById: session.user.id },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return { user };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating the user" };
  }
};

export const getUsers = async () => {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const users = await prisma.user.findMany({
      where: {
        createdById: session.user.id,
      },
    });

    return { users };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching the users" };
  }
};
