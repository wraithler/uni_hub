import api from "@/api/apiClient";
import { PostList } from "@/api/posts/postTypes";
import { usePostsPaginated } from "@/api/posts/usePostPaginated.ts";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileFormData } from "@/types/profile.types";
import FeaturedProfileCard from "@/components/profile/FeaturedProfileCard.tsx";
import Layout from "@/components/core/Layout.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import profileConfig from "@/components/profile/ProfileStyling.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx";
import { FileText, UserPen, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import ProfileEditCarousel from "@/components/profile/ProfileEditCarousel.tsx";
import { useParams } from "react-router-dom";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
}
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export default function ProfilePage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/profile/${id}/`)
        .then(res => {
          const raw = res.data;
          const transformed = Object.fromEntries(
            Object.entries(raw).map(([k, v]) =>
              v && typeof v === 'object' && 'display' in v ? [k, v.display] : [k, v]
            )
          );
          setProfileData(transformed);
        })

        .catch(err => {
          console.error("Failed to load profile:", err);
        });
    }
  }, [id]);

  const {
    data: postsData,
    pagination,
    isLoading: postsLoading,
  } = usePostsPaginated({
    created_by: user?.id ?? 0,
    limit: 12,
  });

  const profile = {
    first_name: profileData?.first_name ?? user?.first_name ?? "User",
    avatar_url: "",
    ...profileData,
  };

  const style = profileConfig["Default"];

  const [bannerStartColor, setBannerStartColor] = useState<string>(
    () => localStorage.getItem("bannerStartColor") || "#6b7280"
  );
  const [bannerEndColor, setBannerEndColor] = useState<string>(
    () => localStorage.getItem("bannerEndColor") || "#1e3a8a"
  );
  const [avatarBgColor, setAvatarBgColor] = useState<string>(
    () => localStorage.getItem("avatarBgColor") || "#374151"
  );
  const bannerTextColor = useMemo(
    () => getContrastColor(bannerEndColor),
    [bannerEndColor]
  );
  const avatarTextColor = useMemo(
    () => getContrastColor(avatarBgColor),
    [avatarBgColor]
  );

  useEffect(() => {
    localStorage.setItem("bannerStartColor", bannerStartColor);
  }, [bannerStartColor]);

  useEffect(() => {
    localStorage.setItem("bannerEndColor", bannerEndColor);
  }, [bannerEndColor]);

  useEffect(() => {
    localStorage.setItem("avatarBgColor", avatarBgColor);
  }, [avatarBgColor]);

  return (
    <Layout>
      {/* Profile Banner */}
      <div
        className="relative h-48 md:h-64"
        style={{ background: `linear-gradient(to right, ${bannerStartColor}, ${bannerEndColor})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          {style.icon}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container px-4 mx-auto">
            <div className="relative -bottom-12 md:-bottom-8 flex items-center gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url} alt={profile.first_name} />
                <AvatarFallback
                  style={{ backgroundColor: avatarBgColor, color: avatarTextColor }}
                  className="text-2xl"
                >
                  {nameToAvatarFallback(`${profile.first_name} ${profile.last_name}`)}
                </AvatarFallback>
              </Avatar>
              <div
                className="flex flex-col items-center md:items-start space-y-2"
                style={{ color: bannerTextColor }}
              >
                <h1 className="text-3xl font-bold drop-shadow-md mb-0 text-center md:text-left">
                  {profile.first_name} {profile.last_name}
                </h1>
                <div className="flex flex-wrap gap-4 font-semibold text-sm">
                  {profile.course_display && (
                    <span>{profile.course_display} student</span>
                  )}
                  {profile.year_of_study && profile.course && (
                    <span>{`${profile.year_of_study} ${profile.course} Student`}</span>
                  )}
                  {profile.email && (
                    <span><strong>Email:</strong> {profile.email}</span>
                  )}
                  {profile.linkedin_url && (
                    <span>
                      <strong>LinkedIn:</strong>{" "}
                      <a href={profile.linkedin_url} className="underline" target="_blank" rel="noopener noreferrer">
                        {profile.linkedin_url}
                      </a>
                    </span>
                  )}
                                   
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Posts, Edit Profile, Friends */}
      <Tabs defaultValue="posts" className="mb-8 mt-16">
        <div className="container px-4 mx-auto mb-6 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4 text-black font-semibold text-sm mt-4">
            <section>
            </section>
          </div>
        </div>

        <div className="container px-4 mx-auto mb-4">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex h-auto p-0 bg-transparent gap-2 justify-center">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <span className="inline-flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Posts
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <span className="inline-flex items-center">
                <UserPen className="w-4 h-4 mr-2" />
                Edit Profile
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <span className="inline-flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Friends
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tabs Content */}
        <TabsContent value="posts" className="mt-6">
          <div className="container px-4 mx-auto mt-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Posts List */}
              <div className="lg:col-span-3 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
                {postsLoading ? (
                  <Spinner className="m-auto" />
                ) : (
                  (postsData?.results || []).map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={post.created_by?.avatar_url || ""}
                              alt={`${post.created_by?.first_name ?? ""} ${post.created_by?.last_name ?? ""}`}
                            />
                            <AvatarFallback>
                              {nameToAvatarFallback(
                                `${post.created_by?.first_name ?? ""} ${post.created_by?.last_name ?? ""}`
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">
                              {`${post.created_by?.first_name ?? ""} ${post.created_by?.last_name ?? ""}`}
                            </span>
                            <p className="text-xs text-muted-foreground">3h ago</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    {post.community?.name && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        in {post.community.name}
                      </p>
                    )}
                    <p className="text-muted-foreground">{post.content}</p>
                  </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-8 px-2"></Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2"></Button>
                        </div>
                        <Button size="sm">View Post</Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="edit" className="mt-6">
          <ProfileEditCarousel
            initialValues={profile}
            avatarBgColor={avatarBgColor}
            bannerStartColor={bannerStartColor}
            bannerEndColor={bannerEndColor}
            onSaved={async (payload) => {
              try {
                const res = await api.patch(`/profile/${id}/`, payload);
                const updated = res.data;
                setProfileData(updated);
                setAvatarBgColor(updated.avatar_bg_color ?? avatarBgColor);
                setBannerStartColor(updated.banner_start_color ?? bannerStartColor);
                setBannerEndColor(updated.banner_end_color ?? bannerEndColor);
              } catch (err) {
                console.error("Failed to save profile:", err);
              }
            }}
            onAvatarBgColorChange={setAvatarBgColor}
            onBannerStartColorChange={setBannerStartColor}
            onBannerEndColorChange={setBannerEndColor}
          />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}