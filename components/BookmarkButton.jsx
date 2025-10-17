"use client";
import { FaBookmark } from "react-icons/fa";
import bookmarkProperty from "@/app/actions/bookmarkProperty";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import checkBookmarkStatus from "@/app/actions/checkBookmarkStatus";

const BookmarkButton = ({ property }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't start fetching until we have a definitive session state
    if (status === "loading") {
      return; // Still checking authentication
    }

    // If no user after session is loaded, hide button immediately
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchBookmarkStatus = async () => {
      try {
        setLoading(true); // Ensure loading is true when starting the fetch
        const res = await checkBookmarkStatus(property?._id);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        setIsBookmarked(res?.isBookmarked ?? false);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          console.error("Unknown error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkStatus();
  }, [property?._id, userId, status]);

  const handleBookmark = async () => {
    if (!userId) {
      return toast.error("You must be logged in to bookmark a property");
    }

    try {
      const res = await bookmarkProperty(property?._id);
      if (res?.error) return toast.error(res.error);
      toast.success(res.message);
      setIsBookmarked(res.isBookmarked ?? false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error("Unknown error occurred:", error);
      }
    }
  };

  // Hide button until BOTH: session is loaded AND bookmark status is checked
  if (status === "loading" || loading) {
    return null;
  }

  // Optional: Also hide if no user is logged in
  // if (!userId) return null;

  return (
    <button
      className={`${
        isBookmarked
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-200`}
      onClick={handleBookmark}
    >
      <FaBookmark className="mr-1" />
      {isBookmarked ? "Remove Bookmark" : "Bookmark Property"}
    </button>
  );
};

export default BookmarkButton;
