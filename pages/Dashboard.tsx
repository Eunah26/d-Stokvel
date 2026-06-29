import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Users,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your savings activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Reputation Score
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">780</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">+20</span> from last month
              </p>
              <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">
                Gold Tier
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Savings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R18,000</div>
              <p className="text-xs text-muted-foreground">
                Across 3 active groups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Next Payment
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 days</div>
              <p className="text-xs text-muted-foreground">
                R2,000 due on March 24
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Next Payout
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 months</div>
              <p className="text-xs text-muted-foreground">
                Expected R6,000 payout
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Groups */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Groups</CardTitle>
                <Link to="/my-groups">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {group.members} members • R{group.contribution}/month
                      </p>
                    </div>
                  </div>
                  <Link to={`/tracker/${group.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 pb-4 last:pb-0 border-b last:border-0 border-border"
                >
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contribution Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Contribution Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {contributionProgress.map((item) => (
              <div key={item.group} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.group}</span>
                  <span className="text-muted-foreground">
                    R{item.paid} / R{item.total}
                  </span>
                </div>
                <Progress value={(item.paid / item.total) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Ready to join more groups?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Discover new savings circles that match your goals
                </p>
              </div>
              <Link to="/marketplace">
                <Button size="lg">
                  Browse Groups
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
}

const activeGroups = [
  {
    id: "1",
    name: "Tech Professionals Circle",
    members: 12,
    contribution: 2000,
  },
  {
    id: "2",
    name: "Young Entrepreneurs Fund",
    members: 8,
    contribution: 1500,
  },
  {
    id: "3",
    name: "Family Savings Group",
    members: 6,
    contribution: 1000,
  },
];

const recentActivity = [
  {
    title: "Payment Received",
    description: "Tech Professionals Circle - March 2026",
    time: "2 hours ago",
    icon: DollarSign,
  },
  {
    title: "Reputation Updated",
    description: "You earned +10 points for on-time payment",
    time: "1 day ago",
    icon: Award,
  },
  {
    title: "Upcoming Payment",
    description: "Young Entrepreneurs Fund due in 5 days",
    time: "2 days ago",
    icon: Clock,
  },
];

const contributionProgress = [
  { group: "Tech Professionals Circle", paid: 2000, total: 2000 },
  { group: "Young Entrepreneurs Fund", paid: 1500, total: 1500 },
  { group: "Family Savings Group", paid: 500, total: 1000 },
];
