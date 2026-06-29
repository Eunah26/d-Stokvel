import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Shield,
  Calendar,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router";

export default function ContributionTracker() {
  const { groupId } = useParams();

  // In a real app, fetch group data based on groupId
  const group = mockGroupData;

  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <Link to="/my-groups">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Groups
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>

        {/* Group Info */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Members</span>
              </div>
              <div className="text-2xl font-bold">{group.members.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Monthly Pot</span>
              </div>
              <div className="text-2xl font-bold">
                R{group.monthlyContribution * group.members.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Paid Members</span>
              </div>
              <div className="text-2xl font-bold">
                {group.members.filter((m) => m.status === "paid").length}/
                {group.members.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Trust Score</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {group.trustScore}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contribution Ledger */}
        <Card>
          <CardHeader>
            <CardTitle>March 2026 Contribution Ledger</CardTitle>
            <p className="text-sm text-muted-foreground">
              Transparent record of all member contributions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar>
                      <AvatarFallback
                        className={
                          member.isYou
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }
                      >
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{member.name}</p>
                        {member.isYou && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Score: {member.reputationScore}</span>
                        {member.paidDate && (
                          <span>Paid: {member.paidDate}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        R{group.monthlyContribution}
                      </div>
                      {member.status === "paid" && member.paidEarly && (
                        <p className="text-xs text-primary">Early payment</p>
                      )}
                    </div>
                    {member.status === "paid" && (
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    {member.status === "pending" && (
                      <div className="h-8 w-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                    )}
                    {member.status === "missed" && (
                      <div className="h-8 w-8 bg-destructive/10 rounded-full flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-destructive" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-muted-foreground">
                      {group.members.filter((m) => m.status === "paid").length} Paid
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-muted-foreground">
                      {group.members.filter((m) => m.status === "pending").length}{" "}
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-destructive mr-2" />
                    <span className="text-muted-foreground">
                      {group.members.filter((m) => m.status === "missed").length}{" "}
                      Missed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Rotation */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Rotation</CardTitle>
            <p className="text-sm text-muted-foreground">
              The order in which members receive their payouts
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.payoutRotation.map((payout, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    payout.status === "completed"
                      ? "border-border bg-muted/30"
                      : payout.status === "current"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                        payout.status === "completed"
                          ? "bg-muted text-muted-foreground"
                          : payout.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{payout.memberName}</p>
                        {payout.isYou && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payout.month}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">R{payout.amount}</div>
                    {payout.status === "completed" && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    )}
                    {payout.status === "current" && (
                      <Badge className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Current
                      </Badge>
                    )}
                    {payout.status === "upcoming" && (
                      <Badge variant="secondary" className="text-xs">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
}

const mockGroupData = {
  name: "Tech Professionals Circle",
  description: "For tech industry professionals building financial security",
  monthlyContribution: 2000,
  trustScore: 95,
  members: [
    {
      id: "1",
      name: "John Doe",
      initials: "JD",
      reputationScore: 780,
      status: "paid" as const,
      paidDate: "March 5, 2026",
      paidEarly: true,
      isYou: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      initials: "SJ",
      reputationScore: 820,
      status: "paid" as const,
      paidDate: "March 1, 2026",
      paidEarly: true,
      isYou: false,
    },
    {
      id: "3",
      name: "Michael Chen",
      initials: "MC",
      reputationScore: 750,
      status: "paid" as const,
      paidDate: "March 10, 2026",
      paidEarly: false,
      isYou: false,
    },
    {
      id: "4",
      name: "Emily Williams",
      initials: "EW",
      reputationScore: 790,
      status: "paid" as const,
      paidDate: "March 8, 2026",
      paidEarly: false,
      isYou: false,
    },
    {
      id: "5",
      name: "David Brown",
      initials: "DB",
      reputationScore: 720,
      status: "pending" as const,
      paidDate: null,
      paidEarly: false,
      isYou: false,
    },
    {
      id: "6",
      name: "Lisa Anderson",
      initials: "LA",
      reputationScore: 800,
      status: "paid" as const,
      paidDate: "March 3, 2026",
      paidEarly: true,
      isYou: false,
    },
  ],
  payoutRotation: [
    {
      memberName: "Sarah Johnson",
      month: "January 2026",
      amount: 12000,
      status: "completed" as const,
      isYou: false,
    },
    {
      memberName: "Lisa Anderson",
      month: "February 2026",
      amount: 12000,
      status: "completed" as const,
      isYou: false,
    },
    {
      memberName: "Emily Williams",
      month: "March 2026",
      amount: 12000,
      status: "current" as const,
      isYou: false,
    },
    {
      memberName: "Michael Chen",
      month: "April 2026",
      amount: 12000,
      status: "upcoming" as const,
      isYou: false,
    },
    {
      memberName: "John Doe",
      month: "May 2026",
      amount: 12000,
      status: "upcoming" as const,
      isYou: true,
    },
    {
      memberName: "David Brown",
      month: "June 2026",
      amount: 12000,
      status: "upcoming" as const,
      isYou: false,
    },
  ],
};
