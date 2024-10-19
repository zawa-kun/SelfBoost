import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { CalendarDays, CheckCircle, Trophy } from "lucide-react";
import {
  checkFollowStatus,
  followUser,
  getUserInfo,
  unfollowUser,
  updateUserInfo,
} from "../api/userApi";
import { getUserTimeline } from "../api/timelineApi";
import { getUserChallenges } from "../api/challengeApi";
import Post from "../components/Post";
import ChallengeDetail from "../components/ChallengeDetail";
import { useUser } from "../contexts/UserContext";
import { DarkModeContext } from "../contexts/DarkModeContext";

function Profile() {
  const { user: currentUser } = useUser();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [challenges, setChallenges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({});
  const profilePictureInputRef = useRef(null);
  const backgroundPictureInputRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userInfoData, userPosts, userChallenges, followStatus] =
          await Promise.all([
            getUserInfo(id),
            getUserTimeline(id),
            getUserChallenges(id),
            checkFollowStatus(id),
          ]);
        setUserInfo(userInfoData);
        setPosts(userPosts);

        const activeChallenges = userChallenges.filter(
          (challenge) => challenge.userStatus !== "完了"
        );
        const completedCount = userChallenges.length - activeChallenges.length;

        setChallenges(activeChallenges);
        setCompletedChallenges(completedCount);
        setIsFollowing(followStatus);
        setEditedUserInfo({
          username: userInfoData.username,
          email: userInfoData.email,
        });
      } catch (err) {
        setError("ユーザー情報の取得に失敗しました。");
        console.error("ユーザー情報取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(id);
      } else {
        await followUser(id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("フォロー/アンフォロー操作に失敗しました:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUserInfo({
      username: userInfo.username,
      email: userInfo.email,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // フィールド名を変更
      const fieldName = type === "profilePicture" ? "avatar" : "background";
      setEditedUserInfo((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserInfo(id, editedUserInfo);
      setUserInfo(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex pt-16">
        <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} />
        <main className="flex-1 md:ml-64 p-4">
          <div className="max-w-4xl mx-auto">
            {/* カバー画像 */}
            <div className="relative h-80 rounded-t-xl overflow-hidden">
              <img
                src={
                  userInfo.backgroundPicture
                    ? `${backendUrl}${userInfo.backgroundPicture}`
                    : "/images/default-background.jpg"
                }
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={
                      userInfo.profilePicture
                        ? `${backendUrl}${userInfo.profilePicture}`
                        : "/images/default-avatar.png"
                    }
                    alt={userInfo.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium"
                      >
                        ユーザー名
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={editedUserInfo.username}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                      >
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editedUserInfo.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => profilePictureInputRef.current.click()}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        プロフィール画像を変更
                      </button>
                      <input
                        type="file"
                        ref={profilePictureInputRef}
                        onChange={(e) => handleImageChange(e, "profilePicture")}
                        className="hidden"
                        accept="image/*"
                        name="avatar" // 名前を変更
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          backgroundPictureInputRef.current.click()
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        背景画像を変更
                      </button>
                      <input
                        type="file"
                        ref={backgroundPictureInputRef}
                        onChange={(e) =>
                          handleImageChange(e, "backgroundPicture")
                        }
                        className="hidden"
                        accept="image/*"
                        name="background" // 名前を変更
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                      >
                        キャンセル
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-center mt-4">
                      {userInfo.username}
                    </div>
                    <div className="flex items-center justify-center mt-4">
                      <Trophy className="mr-2 h-5 w-5" />
                      <span>{challenges.length}チャレンジに参加中</span>
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span>{completedChallenges}チャレンジ達成</span>
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <CalendarDays className="mr-2 h-5 w-5" />
                      <span>
                        {new Date(userInfo.createdAt).toLocaleDateString()}
                        に登録
                      </span>
                    </div>
                    {isOwnProfile ? (
                      <button
                        onClick={handleEdit}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        プロフィールを編集
                      </button>
                    ) : (
                      currentUser &&
                      isFollowing !== null && (
                        <button
                          onClick={handleFollowToggle}
                          className={`mt-4 px-4 py-2 rounded-full ${
                            isFollowing
                              ? "bg-gray-200 text-gray-800"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {isFollowing ? "フォロー中" : "フォローする"}
                        </button>
                      )
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="posts">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="posts" className="w-1/2 py-3 text-lg">
                  投稿
                </TabsTrigger>
                <TabsTrigger value="challenges" className="w-1/2 py-3 text-lg">
                  チャレンジ
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                {posts.map((post) => (
                  <Post key={post._id} post={post} darkMode={darkMode} />
                ))}
              </TabsContent>
              <TabsContent value="challenges">
                {challenges.map((challenge) => (
                  <ChallengeDetail key={challenge.id} challenge={challenge} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default Profile;
