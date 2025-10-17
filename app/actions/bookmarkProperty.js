"use server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import User from "@/models/User";
import getSessionUser from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function bookmarkProperty(propertyId) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser?.userId) {
    throw new Error("User ID is required");
  }
  const { userId } = sessionUser;
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  let isBookmarked = user.bookmarks?.includes(propertyId);
  let message;
  if (isBookmarked) {
    // if already bookmarked remove it
    user.bookmarks.pull(propertyId);
    message = "Property removed from bookmarks";
    isBookmarked = false;
  } else {
    // if not bookmarked add it
    if (!user.bookmarks) {
      user.bookmarks = [];
    }
    user.bookmarks.push(propertyId);
    message = "Property added to bookmarks";
    isBookmarked = true;
  }
  try {
    await user.save();
  } catch (error) {
    throw new Error("Error saving user: " + error.message);
  }
  revalidatePath("/properties/saved", "layout");
  return { message, isBookmarked };
}
export default bookmarkProperty;
