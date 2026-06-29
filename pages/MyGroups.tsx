import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Crown,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { PaymentModal } from "../components/PaymentModal";
import type { PaymentResult } from "../services/paymentService";
import { useUser } from "../context/UserContext";
import { toast } from "sonner";

interface PaymentTarget {
  stokvelId: string;
  stokvelName: string;
  amount: number;
  cycle: number;
}

export default function MyGroups() {
  const { user, canCreateGroup, updateScore } = useUser();
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);

  const openPayment = (target: PaymentTarget) => setPaymentTarget(target);
  const closePayment = () => setPaymentTarget(null);

  const handlePaymentComplete = (result: PaymentResult) => {
    if (result.success) {
      updateScore(10, "on_time_contribution");
      toast.success(`Payment confirmed! +10 reputation points. Ref: ${result.reference.slice(0, 12)}…`);
    }
    closePayment();
  };

  return (
    <Sidebar>
      {/* Payment modal — rendered above everything */}
      {paymentTarget && (
        <PaymentModal
          open={!!paymentTarget}
          onClose={closePayment}
          stokvelId={paymentTarget.stokvelId}
          stokvelName={paymentTarget.stokvelName}
          contributionAmount={paymentTarget.amount}
          cycleNumber={paymentTarget.cycle}
          userEmail={user.onboardingComplete ? "member@dstokvel.co.za" : "guest@dstokvel.co.za"}
          userId={user.track}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Groups</h1>
            <p className="text-muted-foreground">
              Manage your savings groups and track contributions
            </p>
          </div>
          {canCreateGroup && (
            <Link to="/create-group">
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
                <Crown className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-xs text-muted-foreground">
                Contributing monthly
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contributed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R18,000</div>
              <p className="text-xs text-muted-foreground">
                Across all groups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Next Payout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R6,000</div>
              <p className="text-xs text-muted-foreground">
                In 2 months
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Groups</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        group.status === "Current"
                          ? "default"
                          : group.status === "Upcoming"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {group.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Group Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Users className="h-4 w-4 mr-1" />
                        Members
                      </div>
                      <div className="font-semibold">{group.members}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Monthly
                      </div>
                      <div className="font-semibold">R{group.monthlyContribution}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Duration
                      </div>
                      <div className="font-semibold">{group.duration} months</div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Total Pot
                      </div>
                      <div className="font-semibold">
                        R{group.monthlyContribution * group.members}
                      </div>
                    </div>
                  </div>

                  {/* Contribution Status */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Your Contribution Progress
                      </span>
                      <span className="text-sm text-muted-foreground">
                        R{group.yourContribution} / R{group.monthlyContribution}
                      </span>
                    </div>
                    <Progress
                      value={(group.yourContribution / group.monthlyContribution) * 100}
                    />
                  </div>

                  {/* Next Action */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                    <div className="flex-1">
                      {group.nextAction && (
                        <div className="flex items-start space-x-2">
                          {group.nextAction.type === "payment" ? (
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {group.nextAction.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {group.nextAction.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {group.nextAction?.type === "payment" && (
                        <Button
                          onClick={() =>
                            openPayment({
                              stokvelId: group.id,
                              stokvelName: group.name,
                              amount: group.monthlyContribution - (group.yourContribution ?? 0),
                              cycle: 3,
                            })
                          }
                        >
                          Make Payment
                        </Button>
                      )}
                      <Link to={`/tracker/${group.id}`}>
                        <Button variant="outline">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{request.groupName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {request.description}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Requested {request.requestedDate}
                    </div>
                    <Button variant="outline" size="sm">
                      Cancel Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {pendingRequests.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No pending requests
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse the marketplace to find groups to join
                  </p>
                  <Link to="/marketplace">
                    <Button>Browse Groups</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Completed {group.completedDate}
                      </p>
                    </div>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Total Contributed
                      </div>
                      <div className="font-semibold">R{group.totalContributed}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Total Received
                      </div>
                      <div className="font-semibold">R{group.totalReceived}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Success Rate
                      </div>
                      <div className="font-semibold">{group.successRate}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
}

const activeGroups = [
  {
    id: "1",
    name: "Tech Professionals Circle",
    description: "For tech industry professionals building financial security",
    status: "Current",
    members: 12,
    monthlyContribution: 2000,
    duration: 12,
    yourContribution: 2000,
    nextAction: {
      type: "paid",
      title: "Payment Complete",
      description: "Your March contribution has been recorded",
    },
  },
  {
    id: "2",
    name: "Young Entrepreneurs Fund",
    description: "Supporting young business owners in their ventures",
    status: "Upcoming",
    members: 8,
    monthlyContribution: 1500,
    duration: 10,
    yourContribution: 1500,
    nextAction: {
      type: "payout",
      title: "Your payout is in 2 months",
      description: "Expected payout of R12,000 in May 2026",
    },
  },
  {
    id: "3",
    name: "Family Savings Group",
    description: "Building emergency funds together",
    status: "Current",
    members: 6,
    monthlyContribution: 1000,
    duration: 6,
    yourContribution: 500,
    nextAction: {
      type: "payment",
      title: "Payment Due in 5 days",
      description: "R500 remaining for March contribution",
    },
  },
];

const pendingRequests = [
  {
    id: "p1",
    groupName: "Healthcare Workers Union",
    description: "Medical professionals saving together",
    requestedDate: "March 15, 2026",
  },
];

const completedGroups = [
  {
    id: "c1",
    name: "2025 Holiday Fund",
    completedDate: "December 2025",
    totalContributed: 12000,
    totalReceived: 12000,
    successRate: 100,
  },
];
