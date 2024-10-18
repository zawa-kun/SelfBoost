import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { CalendarDays, CheckCircle, Trophy } from "lucide-react";
import { checkFollowStatus, followUser, getUserInfo, unfollowUser } from "../api/userApi";
import { getUserTimeline } from "../api/timelineApi";
import { getUserChallenges } from "../api/challengeApi";
import Post from "../components/Post";
import ChallengeDetail from "../components/ChallengeDetail";
import { useUser } from "../contexts/UserContext";

function Profile() {
  const { user: currentUser } = useUser();
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [challenges, setChallenges] = useState([]);

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
      } catch (err) {
        setError("ユーザー情報の取得に失敗しました。");
        console.error("ユーザー情報取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
            <div className="relative h-64 rounded-t-xl overflow-hidden mb-16">
              <img
                src={userInfo.backgroundPicture}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              {/* プロフィール画像 */}
              <Avatar className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 w-32 h-32 border-4 border-background">
                <AvatarImage
                  src={userInfo.profilePicture}
                  alt={userInfo.username}
                />
                <AvatarFallback>{userInfo.username[0]}</AvatarFallback>
              </Avatar>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
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
                    {new Date(userInfo.createdAt).toLocaleDateString()}に登録
                  </span>
                </div>
                {currentUser &&
                  currentUser._id !== id &&
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
