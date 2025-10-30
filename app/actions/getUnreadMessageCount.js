"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import getSessionUser from "@/utils/getSessionUser";

async function getUnreadMessageCount() {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser?.userId) {
      return { error: "User ID is required" };
    }

    const { userId } = sessionUser;
    const unreadCount = await Message.countDocuments({
      recipient: userId,
      read: false,
    });
    return { unreadCount };
  } catch (error) {
    console.error("Error in markMessageAsRead:", error);
    return { error: error.message };
  }
}

export default getUnreadMessageCount;
