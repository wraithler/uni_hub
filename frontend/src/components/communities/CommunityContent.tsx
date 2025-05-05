import CommunityContentPrivate from "@/components/communities/CommunityContentPrivate.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Info,
  MapPin,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";
import PostListContainer from "@/components/posts/display/PostListContainer.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Community } from "@/api/communities/communityTypes.ts";
import EventListContainer from "@/components/events/EventListContainer.tsx";

export default function CommunityContent({
  community,
}: {
  community: Community;
}) {
  return (
    <>
      {community.privacy === "restricted" && !community.is_member && (
        <CommunityContentPrivate />
      )}

      {/* Community Content Tabs */}
      {(community.privacy === "public" || community.is_member) && (
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
            <PostListContainer community={community} />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <EventListContainer community={community} />
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
      )}
    </>
  );
}
