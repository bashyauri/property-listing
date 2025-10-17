"use client";
import { FaBookmark } from "react-icons/fa";
import bookmarkProperty from "@/app/actions/bookmarkProperty";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
const BookmarkButton = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleBookmark = async () => {
    if (!userId)
      return toast.error("You must be logged in to bookmark a property");
    try {
      const { message, isBookmarked } = await bookmarkProperty(property._id);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      onClick={handleBookmark}
    >
      <FaBookmark className="mr-1" /> Bookmark Property
    </button>
  );
};

export default BookmarkButton;
