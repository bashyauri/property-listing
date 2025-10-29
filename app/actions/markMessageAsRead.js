"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import User from "@/models/User";
import getSessionUser from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function markMessageAsRead(messageId) {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser?.userId) {
      return { error: "User ID is required" };
    }

    const { userId } = sessionUser;

    const message = await Message.findById(messageId);

    if (!message) {
      throw new Error(`Message with ID ${messageId} not found`);
    }
    if (message.recipient.toString() !== userId) {
      throw new Error("You are not authorized to mark this message as read");
    }

    message.read = !message.read;

    revalidatePath("/messages", "page");
    await message.save();

    return message.read;
  } catch (error) {
    console.error("Error in markMessageAsRead:", error);
    return { error: error.message };
  }
}

export default markMessageAsRead;
