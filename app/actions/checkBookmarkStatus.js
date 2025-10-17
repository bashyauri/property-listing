"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import getSessionUser from "@/utils/getSessionUser";

async function checkBookmarkStatus(propertyId) {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser?.userId) {
      return { error: "User ID is required" };
    }

    const { userId } = sessionUser;
    const user = await User.findById(userId).select("bookmarks");

    if (!user) {
      return { error: `User with ID ${userId} not found` };
    }

    const isBookmarked = user.bookmarks?.includes(propertyId) ?? false;

    return { isBookmarked }; // Return as object
  } catch (error) {
    console.error("Error in checkBookmarkStatus:", error);
    return { error: error.message };
  }
}

export default checkBookmarkStatus;
