"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Grid,
  Heart,
  Info,
  List,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  PenSquare,
  Search,
  Share2,
  Star,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
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
import { Input } from "@/components/ui/input.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import Layout from "@/components/core/Layout.tsx";
import { useCommunity } from "@/hooks/communities/useCommunity.ts";
import { useParams } from "react-router-dom";
import {
  bannerCategoryIcons,
  bannerColours,
} from "@/api/old/types/communities.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";

export default function CommunityDetail() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { id } = useParams();
  const { data: community } = useCommunity({
    community_id: parseInt(id as string),
  });

  if (!community) {
    return null;
  }

  return (
    <Layout>
      {/* Community Banner */}
      <div
        className={`relative h-48 md:h-64 bg-gradient-to-r ${bannerColours[community.category_name]}`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          {bannerCategoryIcons[community.category_name]}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container px-4 mx-auto">
            <div className="relative -bottom-12 md:-bottom-6 flex flex-col md:flex-row gap-4 items-start">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
                <AvatarImage src="/placeholder.svg" alt={community.name} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {nameToAvatarFallback(community.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block pt-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
                  {community.category_name}
                </Badge>
                <h1 className="text-3xl font-bold text-white drop-shadow-md">
                  {community.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container px-4 mx-auto pt-16 md:pt-20 pb-12">
        {/* Mobile Title (visible on small screens) */}
        <div className="md:hidden mb-6">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
            {community.category_name}
          </Badge>
          <h1 className="text-2xl font-bold">{community.name}</h1>
        </div>

        {/* Community Actions */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>324 members</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>1,205 posts</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.8/5 rating</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={() => setIsFollowing(!isFollowing)}
              className={
                isFollowing
                  ? "border-primary text-primary hover:bg-primary/10"
                  : ""
              }
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report Community</DropdownMenuItem>
                <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Community Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              {community.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag, index) => (
                <Badge variant="secondary" key={index}>
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Content Tabs */}
        <Tabs defaultValue="posts" className="mb-8">
          <TabsList className="w-full md:w-auto grid grid-cols-4 md:inline-flex h-auto p-0 bg-transparent gap-2">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <Users className="w-4 h-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <Info className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Posts</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-slate-100" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-slate-100" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button size="sm">
                  <PenSquare className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>

            {/* Pinned Post */}
            <Card className="mb-6 border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-blue-500 border-blue-500"
                  >
                    Pinned
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    2 days ago
                  </span>
                </div>
                <CardTitle className="mt-2">
                  Welcome to the Computer Science Society!
                </CardTitle>
                <CardDescription>
                  A guide for new members and information about upcoming events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Welcome to all new members! This post contains essential
                  information about our community, including how to get
                  involved, upcoming events, and resources available to members.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 h-8 px-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>42</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 h-8 px-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>18</span>
                  </Button>
                </div>
                <Button size="sm" variant="outline">
                  Read More
                </Button>
              </CardFooter>
            </Card>

            {/* Posts Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          Alex Johnson
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          3h ago
                        </span>
                      </div>
                      <CardTitle className="text-base">
                        Hackathon Preparation Tips
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        Looking to join our upcoming hackathon? Here are some
                        essential tips to help you prepare and maximize your
                        chances of success...
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 h-8 px-2"
                        >
                          <Heart className="w-4 h-4" />
                          <span>24</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 h-8 px-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>8</span>
                        </Button>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Card key={item}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">Alex Johnson</span>
                          <p className="text-xs text-muted-foreground">
                            3h ago
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-semibold mb-2">
                        Hackathon Preparation Tips
                      </h3>
                      <p className="text-muted-foreground">
                        Looking to join our upcoming hackathon? Here are some
                        essential tips to help you prepare and maximize your
                        chances of success:
                        <br />
                        <br />
                        1. Form a diverse team with complementary skills
                        <br />
                        2. Brainstorm project ideas before the event
                        <br />
                        3. Familiarize yourself with common APIs and tools
                        <br />
                        4. Get plenty of rest before the event
                        <br />
                        5. Focus on creating a working prototype rather than a
                        perfect solution
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 h-8 px-2"
                        >
                          <Heart className="w-4 h-4" />
                          <span>24</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 h-8 px-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>8</span>
                        </Button>
                      </div>
                      <Button size="sm">View Post</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-9 h-9 p-0 bg-primary text-primary-foreground"
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  2
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  3
                </Button>
                <span className="mx-1">...</span>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  8
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <Button size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Annual Hackathon 2025",
                  date: "March 15-16, 2025",
                  time: "9:00 AM - 5:00 PM",
                  location: "University Tech Center",
                  description:
                    "A 48-hour coding competition where teams build innovative solutions to real-world problems.",
                  attendees: 87,
                  color: "bg-blue-500",
                },
                {
                  title: "AI Workshop Series",
                  date: "February 10, 2025",
                  time: "2:00 PM - 4:00 PM",
                  location: "Computer Science Building, Room 302",
                  description:
                    "Learn the fundamentals of artificial intelligence and machine learning in this hands-on workshop.",
                  attendees: 42,
                  color: "bg-purple-500",
                },
                {
                  title: "Industry Networking Night",
                  date: "January 25, 2025",
                  time: "6:00 PM - 8:30 PM",
                  location: "University Conference Center",
                  description:
                    "Connect with professionals from leading tech companies and explore career opportunities.",
                  attendees: 65,
                  color: "bg-green-500",
                },
              ].map((event, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className={`h-2 ${event.color}`}></div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-1 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <Avatar
                            key={i}
                            className="w-6 h-6 border-2 border-white"
                          >
                            <AvatarFallback className="text-xs">
                              U{i}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {event.attendees} attending
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">RSVP</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Past Events</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Web Development Workshop",
                    date: "November 12, 2024",
                    attendees: 53,
                  },
                  {
                    title: "Tech Talk: The Future of Quantum Computing",
                    date: "October 28, 2024",
                    attendees: 78,
                  },
                  {
                    title: "Resume Review Session",
                    date: "October 15, 2024",
                    attendees: 34,
                  },
                ].map((event, index) => (
                  <Card key={index} className="bg-slate-50">
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{event.date}</span>
                            <span className="mx-2">•</span>
                            <Users className="h-3 w-3" />
                            <span>{event.attendees} attended</span>
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          View Photos
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Community Members</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-9 w-[250px]"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Emily Chen",
                    role: "President",
                    avatar: "/placeholder.svg",
                    bio: "Computer Science senior specializing in AI and machine learning.",
                  },
                  {
                    name: "Michael Rodriguez",
                    role: "Vice President",
                    avatar: "/placeholder.svg",
                    bio: "Software Engineering junior with a passion for web development.",
                  },
                  {
                    name: "Sarah Johnson",
                    role: "Events Coordinator",
                    avatar: "/placeholder.svg",
                    bio: "Computer Science sophomore focusing on cybersecurity.",
                  },
                ].map((member, index) => (
                  <Card key={index}>
                    <CardHeader className="text-center pb-2">
                      <Avatar className="w-20 h-20 mx-auto">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="mt-2 text-lg">
                        {member.name}
                      </CardTitle>
                      <Badge variant="outline" className="mx-auto mt-1">
                        {member.role}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {member.bio}
                      </p>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Active Members</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt="Member" />
                          <AvatarFallback>M{index + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Member Name</p>
                          <p className="text-xs text-muted-foreground">
                            Joined Jan 2024
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="ghost" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline">View All 324 Members</Button>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Our Community</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      The Computer Science Society was founded in 2015 with the
                      mission of creating a supportive community for students
                      interested in computer science and technology. We aim to
                      bridge the gap between classroom learning and real-world
                      applications by providing hands-on experiences, networking
                      opportunities, and resources for professional development.
                    </p>
                    <p>
                      Our community welcomes students of all skill levels, from
                      beginners just starting their journey in computer science
                      to advanced programmers looking to refine their skills. We
                      believe in the power of collaboration and peer learning,
                      and we strive to create an inclusive environment where
                      everyone can contribute and grow.
                    </p>
                    <p>
                      Throughout the academic year, we organize a variety of
                      events including workshops, hackathons, tech talks, and
                      networking sessions with industry professionals. These
                      events are designed to help members develop technical
                      skills, explore career opportunities, and build
                      connections within the tech community.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          Be respectful and inclusive of all members regardless
                          of background or experience level.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          Share knowledge and resources freely with fellow
                          community members.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          Provide constructive feedback and support for others'
                          projects and ideas.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          Maintain academic integrity and ethical standards in
                          all community activities.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          Participate actively in discussions and events to
                          foster a vibrant community.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          cs-society@university.edu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Office Location</p>
                        <p className="text-sm text-muted-foreground">
                          Computer Science Building, Room 204
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Office Hours</p>
                        <p className="text-sm text-muted-foreground">
                          Monday-Friday: 10:00 AM - 4:00 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <img
                          src="/placeholder.svg"
                          alt="Twitter"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <img
                          src="/placeholder.svg"
                          alt="Instagram"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Instagram
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <img
                          src="/placeholder.svg"
                          alt="LinkedIn"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <img
                          src="/placeholder.svg"
                          alt="GitHub"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        GitHub
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Join Our Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Interested in taking a leadership role in our community?
                      We're always looking for passionate members to join our
                      organizing team.
                    </p>
                    <Button className="w-full">Apply for Leadership</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}
