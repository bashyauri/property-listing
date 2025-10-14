"use server";
import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import getSessionUser from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser?.userId) {
    throw new Error("User ID is required");
  }
  const { userId } = sessionUser;
  await connectDB();
  const propertyToDelete = await Property.findById(propertyId).select(
    "images owner"
  );
  if (!propertyToDelete) {
    throw new Error(`Property with ID ${propertyId} not found`);
  }
  if (propertyToDelete.owner.toString() !== userId) {
    throw new Error("You are not authorized to delete this property");
  }
  const publicIds = propertyToDelete.images.map((imageUrl) => {
    const parts = imageUrl.split("/");
    return parts.at(-1).split(".").at(0);
  });
  // Delete images from cloudinary
  for (const publicId of publicIds) {
    await cloudinary.uploader.destroy("property-listing/" + publicId);
  }
  await propertyToDelete.deleteOne();

  revalidatePath("/", "layout");
}
export default deleteProperty;
