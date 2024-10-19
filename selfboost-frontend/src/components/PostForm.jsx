import React, { useEffect, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/24/solid";
import { createPost } from "../api/postApi";
import { useUser } from "../contexts/UserContext";
import { getMyChallenges } from "../api/challengeApi";

function PostForm({ darkMode, onPostCreated }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [myChallenges, setMyChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState("");

  const { user } = useUser();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", postContent);
      if (selectedImage) {
        formData.append("postImage", selectedImage);
      }
      if (selectedChallenge) {
        formData.append("challengeId", selectedChallenge);
      }

      const newPost = await createPost(formData);
      setPostContent("");
      setSelectedImage(null);
      setSelectedChallenge("");
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error("投稿作成エラー:", error.response?.data || error.message);
      setError("投稿の作成中にエラーが発生しました。もう一度お試しください");
    }
  };

  const handlePostContentChange = (e) => {
    setPostContent(e.target.value);
    resizeTextarea();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    const fetchMyChallenges = async () => {
      try {
        const challenges = await getMyChallenges();
        setMyChallenges(challenges);
      } catch (error) {
        console.error("マイチャレンジの取得に失敗しました:", error);
      }
    };

    fetchMyChallenges();
  }, []);

  const handleChallengeChange = (e) => {
    setSelectedChallenge(e.target.value);
  };

  return (
    <div
      className={`p-4 md:p-6 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
        <img
          className="h-10 w-10 rounded-full"
          src={
            user.profilePicture
              ? `${backendUrl}${user.profilePicture}`
              : "../images/default-avatar.png"
          }
          alt="Your avatar"
        />
        <form onSubmit={(e) => handleSubmit(e)} className="flex-grow">
          <textarea
            ref={textareaRef}
            placeholder="あなたの成長や経験を共有しましょう..."
            className={`w-full p-2 rounded-md resize-none overflow-hidden ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
            }`}
            value={postContent}
            onChange={handlePostContentChange}
            rows={1}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex flex-col space-y-2 mt-2 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleImageClick}
                className={`p-2 rounded-md ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <CameraIcon className="h-5 w-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {selectedImage && (
                <span className="text-sm">{selectedImage.name}</span>
              )}
              <select
                className={`p-2 rounded-md flex-grow md:flex-grow-0 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                }`}
              >
                <option value="">チャレンジを選択</option>
                {myChallenges.map((challenge) => (
                  <option key={challenge._id} value={challenge._id}>
                    {challenge.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md w-full md:w-auto ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              投稿する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
