import { CommunityDashboard } from "@/api/communities/communityTypes.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  BarChart3,
  FileText,
  LineChart,
  PieChart,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
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
import CommunityJoinRequestCard from "@/components/communities/CommunityJoinRequestCard.tsx";

export default function CommunityDashboardOverview({
  data,
}: {
  data: CommunityDashboard;
}) {
  const postsThisWeek = data.engagement.reduce(
    (total: number, day: any) => total + day.posts,
    0,
  );

  const contentTypeData = [
    { name: "Posts", value: data?.total_posts },
    { name: "Events", value: data?.total_events },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                  {data.pending_requests.length}
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
                <h3 className="text-2xl font-bold mt-1">{data.total_posts}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">
                <span className="font-medium text-green-600">
                  +{postsThisWeek}
                </span>{" "}
                new posts this week
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
            <CardDescription>Monthly member growth over time</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={[...data.member_growth].reverse()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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
                <BarChart data={data.engagement.sort((a, b) => a.idx - b.idx)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="posts" fill="#8884d8" name="Posts" />
                  <Bar dataKey="events" fill="#82ca9d" name="Comments" />
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
              {data.pending_requests.slice(0, 3).map((request) => (
                <CommunityJoinRequestCard joinRequest={request} />
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-slate-50 px-6 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(data.pending_requests.length, 3)} of{" "}
              {data.pending_requests.length} requests
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
