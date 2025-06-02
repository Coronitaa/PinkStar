
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Package, Users, BarChart3, ShieldAlert, Activity, DollarSign, Clock } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart" // Assuming Chart components are available
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Area, AreaChart } from "recharts"
import { auth } from '@/lib/firebase/auth'; // Import auth to get session
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export const metadata = {
  title: 'Dashboard - PinkStar Admin',
};

// Mock data for charts - replace with actual data fetching
const barChartData = [
  { month: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
];

const lineChartData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(0, i).toLocaleString('default', { month: 'short' }),
  downloads: Math.floor(Math.random() * 3000) + 500,
  uploads: Math.floor(Math.random() * 1000) + 100,
}));

const areaChartData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  users: Math.floor(Math.random() * 100) + 10,
}));

const chartConfig = {
  total: { label: "Total", color: "hsl(var(--chart-1))" },
  downloads: { label: "Downloads", color: "hsl(var(--chart-2))" },
  uploads: { label: "Uploads", color: "hsl(var(--chart-3))" },
  users: { label: "Active Users", color: "hsl(var(--chart-4))" },
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || !session.user.isAdmin) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Home className="w-8 h-8 mr-3 text-primary" /> Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || 'Admin'}! Overview of PinkStar.
          </p>
        </div>
         <Button asChild className="button-primary-glow">
            <Link href="/admin/projects/new">Add New Project</Link>
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Moderation</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground text-orange-500">Needs attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">+5% this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-border/40">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Downloads and uploads over the last year.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={lineChartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="downloads" type="monotone" stroke="var(--color-downloads)" strokeWidth={2} dot={false} />
                <Line dataKey="uploads" type="monotone" stroke="var(--color-uploads)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/40">
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>Active users in the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={areaChartData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Area dataKey="users" type="natural" fill="var(--color-users)" fillOpacity={0.4} stroke="var(--color-users)" stackId="a" />
                </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity or Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg border-border/40">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest submissions and reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { icon: Package, text: "New mod 'Super Tools' submitted for PixelVerse.", time: "2m ago", user: "ModMaster" },
                { icon: ShieldAlert, text: "Report received for resource 'DarkTextures'.", time: "1h ago", user: "UserX123" },
                { icon: Users, text: "User 'CreativeWorks' updated their profile.", time: "3h ago", user: "CreativeWorks" },
                { icon: DollarSign, text: "Subscription 'Pro Plan' started by 'DevGuru'.", time: "5h ago", user: "DevGuru", color: "text-green-500" },
              ].map((activity, index) => (
                <li key={index} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                  <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color || 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">By {activity.user} - {activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border/40">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button variant="outline" asChild className="justify-start"><Link href="/admin/projects"><Package className="mr-2 h-4 w-4" /> Manage All Projects</Link></Button>
            <Button variant="outline" asChild className="justify-start"><Link href="/admin/users"><Users className="mr-2 h-4 w-4" /> Manage Users</Link></Button>
            <Button variant="outline" asChild className="justify-start"><Link href="/admin/moderation"><ShieldAlert className="mr-2 h-4 w-4" /> Moderation Queue</Link></Button>
            <Button variant="outline" asChild className="justify-start"><Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /> System Settings</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
