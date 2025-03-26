import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/Layout.tsx";

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Connect with your university community
            </h1>
            <p className="text-xl text-muted-foreground">
              Join Uni Hub to connect with fellow students, discover
              communities, and stay updated with campus events.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <a href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-6">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                5,000+
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Active Students
              </p>
            </div>
            <div className="p-6">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                200+
              </p>
              <p className="text-sm text-muted-foreground mt-2">Communities</p>
            </div>
            <div className="p-6">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                1,000+
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Events Per Year
              </p>
            </div>
            {/*<div className="p-6">*/}
            {/*  <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>*/}
            {/*  <p className="text-sm text-muted-foreground mt-2">Partner Universities</p>*/}
            {/*</div>*/}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uni Hub provides all the tools you need to engage with your
              university community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Join Communities</CardTitle>
                <CardDescription>
                  Find and join communities based on your interests, major, or
                  extracurricular activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Academic communities for your major
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Interest-based groups for hobbies
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Cultural and diversity organizations
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-1" asChild>
                  <a href="/communities">
                    Explore Communities
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Discover Events</CardTitle>
                <CardDescription>
                  Stay updated with campus events, workshops, seminars, and
                  social gatherings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Academic conferences and workshops
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Social events and networking opportunities
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Career fairs and professional development
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-1">
                  View Events
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Engage in Discussions</CardTitle>
                <CardDescription>
                  Participate in meaningful discussions with peers and faculty
                  members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Course-specific study groups
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Research collaboration opportunities
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Campus initiatives and feedback
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-1">
                  Join Discussions
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Communities Preview */}
      <section id="communities" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Communities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students in our most active communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Computer Science Society",
                members: 324,
                category: "Academic",
                icon: <GraduationCap className="h-5 w-5" />,
                color: "bg-blue-500",
              },
              {
                name: "Environmental Action",
                members: 156,
                category: "Interest",
                icon: <BookOpen className="h-5 w-5" />,
                color: "bg-green-500",
              },
              {
                name: "International Students",
                members: 203,
                category: "Cultural",
                icon: <Users className="h-5 w-5" />,
                color: "bg-purple-500",
              },
              {
                name: "Business & Entrepreneurship",
                members: 289,
                category: "Academic",
                icon: <GraduationCap className="h-5 w-5" />,
                color: "bg-amber-500",
              },
              {
                name: "Campus Photography",
                members: 112,
                category: "Interest",
                icon: <BookOpen className="h-5 w-5" />,
                color: "bg-pink-500",
              },
              {
                name: "Psychology Network",
                members: 176,
                category: "Academic",
                icon: <GraduationCap className="h-5 w-5" />,
                color: "bg-indigo-500",
              },
            ].map((community, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div
                  className={`size-12 rounded-lg ${community.color} flex items-center justify-center text-white`}
                >
                  {community.icon}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{community.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {community.members} members • {community.category}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Join
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" asChild>
              <a href="/communities">
                Explore All Communities
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from students who have transformed their university
              experience with Uni Hub.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Uni Hub helped me find my community on campus. I've made lifelong friends and valuable connections through the platform.",
                name: "Alex Johnson",
                role: "Computer Science, Class of 2025",
                avatar:
                  "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fHww",
              },
              {
                quote:
                  "As an international student, finding my place was challenging. The cultural communities on Uni Hub made me feel at home away from home.",
                name: "Sophia Chen",
                role: "Business Administration, Class of 2024",
                avatar: "/placeholder.svg?height=64&width=64",
              },
              {
                quote:
                  "The events feature helped me discover workshops and seminars that aligned with my career goals. I've gained valuable skills and experiences.",
                name: "Marcus Williams",
                role: "Psychology, Class of 2023",
                avatar: "/placeholder.svg?height=64&width=64",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="italic text-muted-foreground">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to join your university community?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Sign up today and connect with thousands of students, discover
            events, and join communities that match your interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="/login">
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about Uni Hub.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "Who can join Uni Hub?",
                answer:
                  "Uni Hub is available to all students, faculty, and staff with a valid university email address. We verify all accounts to ensure a safe community.",
              },
              {
                question: "How do I create or join a community?",
                answer:
                  "After signing up, you can browse existing communities or create your own. To join, simply click the 'Join' button on any community page.",
              },
              {
                question: "Can I create events for my community?",
                answer:
                  "Yes! Community administrators can create and manage events, send invitations, and track attendance through the platform.",
              },
              {
                question: "How is my data protected?",
                answer:
                  "We take privacy seriously. Your data is encrypted and never shared with third parties without your consent. Read our privacy policy for more details.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
