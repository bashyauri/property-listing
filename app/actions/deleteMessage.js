"use server";
import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import getSessionUser from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteMessage(messageId) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser?.userId) {
    throw new Error("User ID is required");
  }
  const { userId } = sessionUser;
  await connectDB();
  const message = await Message.findById(messageId);
  if (
    message.recipient.toString() !== userId &&
    message.sender.toString() !== userId
  ) {
    throw new Error("You are not authorized to delete this message");
  }
  await message.deleteOne();

  revalidatePath("/", "layout");
}
export default deleteMessage;
