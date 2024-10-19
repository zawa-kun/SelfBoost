import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { likePost } from "../api/postApi";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";

function Post({ darkMode, post, updatePost}) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(post.userId._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = useCallback(async () => {
    try {
      const updatedPost = await likePost(post._id);
      setIsLiked(!isLiked);
      setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
      updatePost(updatedPost);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  }, [post._id, isLiked, updatePost]);

  if (!post) {
    return null;
  }

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const postUserId = post.userId._id;

  return (
    <div
      className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
    >
      <div className="flex items-center mb-2">
        <Link to={`/profile/${postUserId}`}>
          <img
            className="h-10 w-10 rounded-full mr-3"
            src={
              post.userId.profilePicture
                ? `${backendUrl}${post.userId.profilePicture}`
                : "../images/default-avatar.png"
            }
            alt="User avatar"
          />
        </Link>
        <div>
          <p className="font-semibold">{post.userId.username}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-sm mb-2">{post.text}</p>
      {post.imgUrl && (
        <img
          src={`${backendUrl}${post.imgUrl}`}
          alt="Post content"
          className="w-full rounded-md mb-2"
        />
      )}
      {post.challengeId && (
        <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            チャレンジ: {post.challengeId.title}
          </p>
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <HandThumbUpIcon className="h-5 w-5" />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
