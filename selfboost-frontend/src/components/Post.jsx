import React from "react";
import { Link } from "react-router-dom";

function Post({ darkMode, post }) {
  if (!post) {
    return null; // または適切なローディング表示
  }
  console.log(post.userId._id);
  const postUserId = post.userId._id;
  return (
    <div
      className={`p-4 rounded-lg ${
        darkMode ? "bg-gray-700" : "bg-gray-100"
      }`}
    >
      <div className="flex items-center mb-2">
        <Link to={`/profile/${postUserId}`}>
        <img
          className="h-10 w-10 rounded-full mr-3"
          src={post.userId.profilePicture || `https://i.pravatar.cc/40?img=${post.user._id}`}
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
          src={`http://localhost:5000${post.imgUrl}`}
          alt="Post content"
          className="w-full rounded-md mb-2"
        />
      )}
      {post.challengeId && (
        <p className="text-sm text-blue-500 dark:text-blue-400">
          Challenge: {post.challengeId}
        </p>
      )}
    </div>
  );
}

export default Post;
