"use client";

import { Label } from "@/components/ui/label.tsx";

import { useState } from "react";
import {
  Activity,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Info,
  LineChart,
  MessageSquare,
  MoreHorizontal,
  PieChart,
  Plus,
  Search,
  Settings,
  ThumbsUp,
  Trash2,
  User,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "@/components/core/Layout.tsx";
import { useCommunityDashboard } from "@/api/communities/useCommunityDashboard.ts";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner.tsx";

export default function CommunityDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("overview");
  const { id } = useParams();

  const { data, isLoading } = useCommunityDashboard({ id: Number(id) });

  if (isLoading) {
    return (
      <Layout>
        <Spinner className="m-auto mt-5" />
      </Layout>
    );
  }

  // Mock data for the community
  const communityData = {
    name: "Computer Science Society",
    avatar: "/placeholder.svg",
    memberCount: 324,
    pendingRequests: 8,
    postsCount: 156,
    eventsCount: 12,
    engagement: 78, // percentage
    growth: 12.5, // percentage
  };

  // Mock data for charts
  const memberGrowthData = [
    { date: "Jan", members: 220 },
    { date: "Feb", members: 240 },
    { date: "Mar", members: 260 },
    { date: "Apr", members: 280 },
    { date: "May", members: 300 },
    { date: "Jun", members: 324 },
  ];

  const engagementData = [
    { day: "Mon", posts: 12, comments: 34 },
    { day: "Tue", posts: 15, comments: 42 },
    { day: "Wed", posts: 18, comments: 56 },
    { day: "Thu", posts: 14, comments: 48 },
    { day: "Fri", posts: 20, comments: 62 },
    { day: "Sat", posts: 8, comments: 30 },
    { day: "Sun", posts: 10, comments: 36 },
  ];

  const contentTypeData = [
    { name: "Posts", value: data?.total_posts },
    { name: "Events", value: data?.total_events },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Mock data for pending join requests
  const pendingRequests = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      major: "Computer Science",
      year: "1st Year",
      date: "2 hours ago",
    },
    {
      id: 2,
      name: "Jamie Smith",
      avatar: "/placeholder.svg",
      major: "Data Science",
      year: "2nd Year",
      date: "5 hours ago",
    },
    {
      id: 3,
      name: "Taylor Wilson",
      avatar: "/placeholder.svg",
      major: "Software Engineering",
      year: "3rd Year",
      date: "1 day ago",
    },
    {
      id: 4,
      name: "Morgan Lee",
      avatar: "/placeholder.svg",
      major: "Computer Science",
      year: "MSc",
      date: "1 day ago",
    },
    {
      id: 5,
      name: "Casey Brown",
      avatar: "/placeholder.svg",
      major: "Cybersecurity",
      year: "Foundation Year",
      date: "2 days ago",
    },
  ];

  // Mock data for recent posts
  const recentPosts = [
    {
      id: 1,
      author: "Emily Chen",
      avatar: "/placeholder.svg",
      title: "Upcoming Hackathon Information",
      excerpt:
        "Here's everything you need to know about our upcoming hackathon event...",
      likes: 24,
      comments: 8,
      date: "3 hours ago",
      status: "approved",
    },
    {
      id: 2,
      author: "Michael Rodriguez",
      avatar: "/placeholder.svg",
      title: "Study Group for Advanced Algorithms",
      excerpt:
        "Looking to form a study group for the upcoming midterm exam in Advanced Algorithms...",
      likes: 18,
      comments: 12,
      date: "5 hours ago",
      status: "pending",
    },
    {
      id: 3,
      author: "Sarah Johnson",
      avatar: "/placeholder.svg",
      title: "Internship Opportunity at Tech Corp",
      excerpt:
        "My company is looking for summer interns in software development...",
      likes: 32,
      comments: 5,
      date: "1 day ago",
      status: "approved",
    },
    {
      id: 4,
      author: "David Kim",
      avatar: "/placeholder.svg",
      title: "Resources for Learning React",
      excerpt:
        "I've compiled a list of the best resources for learning React from scratch...",
      likes: 45,
      comments: 15,
      date: "2 days ago",
      status: "approved",
    },
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Hackathon 2025",
      date: "March 15-16, 2025",
      attendees: 87,
      location: "University Tech Center",
    },
    {
      id: 2,
      title: "AI Workshop Series",
      date: "February 10, 2025",
      attendees: 42,
      location: "Computer Science Building, Room 302",
    },
    {
      id: 3,
      title: "Industry Networking Night",
      date: "January 25, 2025",
      attendees: 65,
      location: "University Conference Center",
    },
  ];

  // Handle join request approval/rejection
  const handleJoinRequest = (id: number, action: "approve" | "reject") => {};

  return (
    <Layout>
      {/* Community Dashboard Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={communityData.avatar || "/placeholder.svg"}
                  alt={communityData.name}
                />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  CS
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{communityData.name}</h1>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Admin Dashboard
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Manage your community, members, and content
                </p>
              </div>
            </div>
            {/*<div className="flex flex-wrap gap-2">*/}
            {/*  <Button>*/}
            {/*    <Settings className="w-4 h-4 mr-2" />*/}
            {/*    Settings*/}
            {/*  </Button>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="container px-4 py-6 mx-auto">
        {/* Dashboard Tabs */}
        <Tabs
          defaultValue="overview"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-8"
        >
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Members
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {data.total_members}
                      </h3>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50"
                    >
                      +{data.member_growth[0].growth}%
                    </Badge>
                    <span className="ml-2 text-muted-foreground">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pending Requests
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {communityData.pendingRequests}
                      </h3>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-full">
                      <UserPlus className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Review Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Posts
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {data.total_posts}
                      </h3>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-muted-foreground">
                      <span className="font-medium text-green-600">+12</span>{" "}
                      new posts this week
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Engagement Rate
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {communityData.engagement}%
                      </h3>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50"
                    >
                      +5%
                    </Badge>
                    <span className="ml-2 text-muted-foreground">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-blue-600" />
                    Member Growth
                  </CardTitle>
                  <CardDescription>
                    Monthly member growth over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={[...data.member_growth].reverse()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month"/>
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Weekly Engagement
                  </CardTitle>
                  <CardDescription>Posts and comments by day</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.engagement}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#8884d8" name="Posts" />
                        <Bar
                          dataKey="events"
                          fill="#82ca9d"
                          name="Comments"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-amber-600" />
                    Content Distribution
                  </CardTitle>
                  <CardDescription>
                    Types of content in your community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={contentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {contentTypeData.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Join Requests */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pending Join Requests</CardTitle>
                    <CardDescription>
                      Review and manage membership requests
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRequests.slice(0, 3).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={request.avatar || "/placeholder.svg"}
                              alt={request.name}
                            />
                            <AvatarFallback>
                              {request.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.major} • {request.year}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                            onClick={() =>
                              handleJoinRequest(request.id, "approve")
                            }
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                            onClick={() =>
                              handleJoinRequest(request.id, "reject")
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-slate-50 px-6 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing 3 of {pendingRequests.length} requests
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <div className="grid grid-cols-1 gap-6">
              {/* Member Management Header */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Member Management</CardTitle>
                      <CardDescription>
                        Review, approve, and manage community members
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search members..."
                          className="pl-9 w-[250px]"
                        />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                          <SelectItem value="moderator">Moderators</SelectItem>
                          <SelectItem value="member">
                            Regular Members
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Pending Join Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-amber-600" />
                    Pending Join Requests
                  </CardTitle>
                  <CardDescription>
                    {pendingRequests.length} people waiting to join your
                    community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={request.avatar || "/placeholder.svg"}
                              alt={request.name}
                            />
                            <AvatarFallback>
                              {request.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span>{request.major}</span>
                              <span>•</span>
                              <span>{request.year}</span>
                              <span>•</span>
                              <span>Requested {request.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                            onClick={() =>
                              handleJoinRequest(request.id, "approve")
                            }
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                            onClick={() =>
                              handleJoinRequest(request.id, "reject")
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Roles */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Roles</CardTitle>
                  <CardDescription>
                    Manage leadership and moderation roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Admin Role */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Administrators</h3>
                          <p className="text-sm text-muted-foreground">
                            Full control over community settings and members
                          </p>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Admin
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Emily Chen"
                              />
                              <AvatarFallback>EC</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Emily Chen</p>
                              <p className="text-xs text-muted-foreground">
                                Admin since Jan 2024
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Michael Rodriguez"
                              />
                              <AvatarFallback>MR</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Michael Rodriguez</p>
                              <p className="text-xs text-muted-foreground">
                                Admin since Jan 2024
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Moderator Role */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Moderators</h3>
                          <p className="text-sm text-muted-foreground">
                            Can approve posts and manage content
                          </p>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Moderator
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Sarah Johnson"
                              />
                              <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Sarah Johnson</p>
                              <p className="text-xs text-muted-foreground">
                                Moderator since Feb 2024
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="David Kim"
                              />
                              <AvatarFallback>DK</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">David Kim</p>
                              <p className="text-xs text-muted-foreground">
                                Moderator since Mar 2024
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Member Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Member Statistics</CardTitle>
                  <CardDescription>
                    Insights about your community membership
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Members
                      </p>
                      <p className="text-3xl font-bold mt-2">245</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        76% of total members
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        New This Month
                      </p>
                      <p className="text-3xl font-bold mt-2">32</p>
                      <p className="text-xs text-green-600 mt-1">
                        ↑ 12% increase
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg. Engagement
                      </p>
                      <p className="text-3xl font-bold mt-2">68%</p>
                      <p className="text-xs text-green-600 mt-1">
                        ↑ 5% increase
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 gap-6">
              {/* Content Management Header */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Content Management</CardTitle>
                      <CardDescription>
                        Review, approve, and manage community content
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search content..."
                          className="pl-9 w-[250px]"
                        />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Content</SelectItem>
                          <SelectItem value="posts">Posts</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="announcements">
                            Announcements
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Recent Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Content</CardTitle>
                  <CardDescription>
                    Recently published content in your community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts
                      .filter((post) => post.status === "approved")
                      .map((post) => (
                        <div
                          key={post.id}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar>
                                <AvatarImage
                                  src={post.avatar || "/placeholder.svg"}
                                  alt={post.author}
                                />
                                <AvatarFallback>
                                  {post.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{post.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  Posted {post.date}
                                </p>
                              </div>
                            </div>
                            <h4 className="font-medium">{post.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4 mr-1" />
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Post
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Info className="h-4 w-4 mr-2" />
                                  Mark as Featured
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Post
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-slate-50 px-6 py-3 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing 3 of{" "}
                    {
                      recentPosts.filter((post) => post.status === "approved")
                        .length
                    }{" "}
                    posts
                  </p>
                  <Button variant="outline" size="sm">
                    View All Posts
                  </Button>
                </CardFooter>
              </Card>

              {/* Content Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Analytics</CardTitle>
                  <CardDescription>
                    Insights about your community's content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Most Engaged Post
                      </p>
                      <p className="font-medium mt-2">
                        Internship Opportunity at Tech Corp
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        32 likes • 15 comments
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg. Engagement Rate
                      </p>
                      <p className="text-3xl font-bold mt-2">24%</p>
                      <p className="text-xs text-green-600 mt-1">
                        ↑ 3% from last month
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Content Growth
                      </p>
                      <p className="text-3xl font-bold mt-2">+12%</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Month over month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="grid grid-cols-1 gap-6">
              {/* Events Management Header */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Events Management</CardTitle>
                      <CardDescription>
                        Create, manage, and track community events
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    Events scheduled for your community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees} attending</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Info className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4 mr-1" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Event
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="h-4 w-4 mr-2" />
                                View Attendees
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Analytics</CardTitle>
                  <CardDescription>
                    Insights about your community events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Events
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {communityData.eventsCount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        This year
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg. Attendance
                      </p>
                      <p className="text-3xl font-bold mt-2">65</p>
                      <p className="text-xs text-green-600 mt-1">
                        ↑ 8% from last semester
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Most Popular Event
                      </p>
                      <p className="font-medium mt-2">Annual Hackathon 2025</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        87 attendees
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Calendar</CardTitle>
                  <CardDescription>
                    View and manage upcoming events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-lg text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium mt-4">
                      Calendar View Coming Soon
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      We're working on a comprehensive calendar view for better
                      event management.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 gap-6">
              {/* Community Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Settings</CardTitle>
                  <CardDescription>
                    Configure your community preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">General Settings</h3>
                    <Separator />
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <Label
                            htmlFor="community-name"
                            className="font-medium"
                          >
                            Community Name
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            The name of your community
                          </p>
                        </div>
                        <Input
                          id="community-name"
                          defaultValue={communityData.name}
                          className="max-w-md"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <Label
                            htmlFor="community-description"
                            className="font-medium"
                          >
                            Description
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Describe what your community is about
                          </p>
                        </div>
                        <Input
                          id="community-description"
                          defaultValue="A community for computer science enthusiasts"
                          className="max-w-md"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <Label
                            htmlFor="community-category"
                            className="font-medium"
                          >
                            Category
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            The category your community belongs to
                          </p>
                        </div>
                        <Select defaultValue="academic">
                          <SelectTrigger
                            id="community-category"
                            className="max-w-md"
                          >
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="interest">
                              Interest-based
                            </SelectItem>
                            <SelectItem value="cultural">Cultural</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="career">
                              Career & Professional
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Privacy & Permissions
                    </h3>
                    <Separator />
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Community Visibility
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Control who can see your community
                          </p>
                        </div>
                        <Select defaultValue="public">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="restricted">
                              Restricted
                            </SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Join Requests</Label>
                          <p className="text-sm text-muted-foreground">
                            How new members can join
                          </p>
                        </div>
                        <Select defaultValue="approval">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select join method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open to All</SelectItem>
                            <SelectItem value="approval">
                              Require Approval
                            </SelectItem>
                            <SelectItem value="invite">Invite Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Post Creation</Label>
                          <p className="text-sm text-muted-foreground">
                            Who can create posts
                          </p>
                        </div>
                        <Select defaultValue="all-members">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select permission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-members">
                              All Members
                            </SelectItem>
                            <SelectItem value="moderators">
                              Moderators Only
                            </SelectItem>
                            <SelectItem value="admins">Admins Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <Separator />
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            New Join Requests
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone requests to join
                          </p>
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select notification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Requests</SelectItem>
                            <SelectItem value="digest">Daily Digest</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">New Posts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about new posts
                          </p>
                        </div>
                        <Select defaultValue="digest">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select notification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Posts</SelectItem>
                            <SelectItem value="digest">Daily Digest</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Comments on Posts
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about comments
                          </p>
                        </div>
                        <Select defaultValue="none">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select notification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Comments</SelectItem>
                            <SelectItem value="digest">Daily Digest</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t p-6">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader className="text-red-800">
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription className="text-red-700">
                    Actions that can't be undone
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-red-800">
                          Delete Community
                        </h3>
                        <p className="text-sm text-red-700">
                          This action cannot be undone. All content will be
                          permanently deleted.
                        </p>
                      </div>
                      <Button variant="destructive">Delete Community</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}
