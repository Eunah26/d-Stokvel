import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import {
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Brain,
  Banknote,
  BookOpen,
  UserPlus,
  AlertCircle,
  Shield,
  Zap,
  Crown,
} from "lucide-react";
import { useUser, UserProfile } from "../context/UserContext";
import { Link } from "react-router";

const TIER_COLORS: Record<string, string> = {
  platinum: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  gold:     "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  silver:   "from-slate-400/20 to-slate-500/10 border-slate-400/30",
  bronze:   "from-amber-700/20 to-amber-800/10 border-amber-700/30",
  unranked: "from-primary/10 to-accent/10 border-primary/20",
};

const TIER_SCORE_COLORS: Record<string, string> = {
  platinum: "text-purple-400",
  gold:     "text-yellow-400",
  silver:   "text-slate-300",
  bronze:   "text-amber-600",
  unranked: "text-primary",
};

const NEXT_TIER: Record<string, { label: string; threshold: number }> = {
  unranked: { label: "Bronze",   threshold: 500 },
  bronze:   { label: "Silver",   threshold: 650 },
  silver:   { label: "Gold",     threshold: 750 },
  gold:     { label: "Platinum", threshold: 850 },
  platinum: { label: "Platinum", threshold: 850 },
};

const TRACK_LABELS: Record<string, { label: string; icon: typeof Brain; color: string }> = {
  banked:    { label: "Bank Statement Track", icon: Banknote, color: "text-blue-400" },
  migrating: { label: "Migrating Group Track", icon: BookOpen, color: "text-amber-400" },
  new:       { label: "Behavioural Track",    icon: UserPlus, color: "text-emerald-400" },
};

export default function ReputationProfile() {
  const { user } = useUser();
  const score = user.reputationScore;
  const tier = user.tier;
  const next = NEXT_TIER[tier];
  const TIER_FLOORS: Record<string, number> = { unranked: 0, bronze: 500, silver: 650, gold: 750, platinum: 850 };
  const floor = TIER_FLOORS[tier] ?? 0;
  const ceiling = next.threshold;
  const progressToNext = tier === "platinum" ? 100 : Math.round(((score - floor) / (ceiling - floor)) * 100);
  const pointsToNext = Math.max(0, next.threshold - score);

  const trackMeta = TRACK_LABELS[user.track] ?? TRACK_LABELS.new;
  const TrackIcon = trackMeta.icon;

  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Reliability Profile</h1>
          <p className="text-muted-foreground">
            Your AI-calculated score — live from your behaviour and verified documents
          </p>
        </div>

        {/* Score hero */}
        <Card className={`bg-gradient-to-br ${TIER_COLORS[tier]}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">AI Reliability Score</span>
                  <Badge className={`${trackMeta.color} bg-transparent border border-current text-xs`}>
                    <TrackIcon className="h-3 w-3 mr-1" />
                    {trackMeta.label}
                  </Badge>
                </div>
                <div className={`text-7xl font-bold mb-2 tabular-nums ${TIER_SCORE_COLORS[tier]}`}>{score}</div>
                <Badge className="px-3 py-1 capitalize border border-current bg-transparent">
                  {tier} Tier
                </Badge>
                {user.onTimePayments > 0 && (
                  <div className="flex items-center justify-center md:justify-start mt-3 text-sm text-primary gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>+{user.onTimePayments * 10} pts from on-time payments</span>
                  </div>
                )}
              </div>

              <div className="w-full md:w-72 space-y-4">
                {tier !== "platinum" && (
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Progress to {next.label}</span>
                      <span className="font-medium">{pointsToNext} pts to go</span>
                    </div>
                    <Progress value={Math.max(5, progressToNext)} className="h-2.5" />
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3 text-sm text-center">
                  <div className="bg-background/30 rounded-lg p-2">
                    <p className="text-muted-foreground text-xs mb-0.5">On-time</p>
                    <p className="font-bold text-primary">{user.onTimePayments}</p>
                  </div>
                  <div className="bg-background/30 rounded-lg p-2">
                    <p className="text-muted-foreground text-xs mb-0.5">Cycles</p>
                    <p className="font-bold">{user.completedCycles}</p>
                  </div>
                  <div className="bg-background/30 rounded-lg p-2">
                    <p className="text-muted-foreground text-xs mb-0.5">Missed</p>
                    <p className={`font-bold ${user.missedPayments === 0 ? "text-emerald-400" : "text-red-400"}`}>{user.missedPayments}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Liquidity Analysis — only shown for banked members */}
        {user.liquidityAnalysis && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-blue-400" />
                AI Liquidity Analysis
                <Badge className="bg-blue-500/20 text-blue-400 text-xs ml-1">NLP Parsed</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Extracted from your bank statement — informs your group compatibility score</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <MetricTile label="Avg Monthly Balance" value={`R${user.liquidityAnalysis.avgMonthlyBalance.toLocaleString()}`} />
                <MetricTile label="Est. Monthly Income" value={`R${user.liquidityAnalysis.estimatedMonthlyIncome.toLocaleString()}`} />
                <MetricTile label="Debt-to-Income Ratio" value={`${Math.round(user.liquidityAnalysis.debtToIncomeRatio * 100)}%`} good={user.liquidityAnalysis.debtToIncomeRatio < 0.35} />
                <MetricTile label="Income Regularity" value={`${user.liquidityAnalysis.incomeRegularity}%`} good={user.liquidityAnalysis.incomeRegularity > 70} />
                <MetricTile label="Savings Consistency" value={`${user.liquidityAnalysis.savingsConsistency}%`} good={user.liquidityAnalysis.savingsConsistency > 60} />
                <MetricTile label="Existing Stokvels" value={`${user.liquidityAnalysis.existingStokvels} detected`} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Liquidity Score contribution</span>
                  <span className="font-semibold text-blue-400">+{user.liquidityAnalysis.liquidityScore} pts</span>
                </div>
                <Progress value={(user.liquidityAnalysis.liquidityScore / 250) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Out of max 250 pts from liquidity analysis</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Group History Analysis — only shown for migrating members */}
        {user.groupHistoryAnalysis && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-400" />
                Group Book Analysis
                <Badge className="bg-amber-500/20 text-amber-400 text-xs ml-1">OCR + AI</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Extracted from your traditional stokvel's savings book</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <MetricTile label="Group Age" value={`${user.groupHistoryAnalysis.groupAge} months`} />
                <MetricTile label="Members Detected" value={`${user.groupHistoryAnalysis.memberCount}`} />
                <MetricTile label="Payment Discipline" value={`${user.groupHistoryAnalysis.paymentDiscipline}%`} good={user.groupHistoryAnalysis.paymentDiscipline > 70} />
                <MetricTile label="Rule Adherence" value={`${user.groupHistoryAnalysis.ruleAdherence}%`} good={user.groupHistoryAnalysis.ruleAdherence > 70} />
                <MetricTile label="Completed Cycles" value={`${user.groupHistoryAnalysis.completedCycles}`} />
                <MetricTile label="History Score" value={`+${user.groupHistoryAnalysis.structureScore} pts`} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* For new/unbanked — show upgrade path */}
        {user.track === "new" && (
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium">Unlock deeper scoring</p>
                  <p className="text-sm text-muted-foreground">
                    You're on the Behavioural Track. Add a bank statement anytime to get AI liquidity scoring — this can add up to <strong>250 extra points</strong> and unlocks better group compatibility matching.
                  </p>
                  <Link to="/onboarding">
                    <Button size="sm" variant="outline" className="mt-1">
                      <Banknote className="h-4 w-4 mr-2" />
                      Upload Bank Statement
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score breakdown stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Payment Reliability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-1">
                {user.onTimePayments + user.latePayments + user.missedPayments > 0
                  ? `${Math.round((user.onTimePayments / (user.onTimePayments + user.latePayments + user.missedPayments)) * 100)}%`
                  : "—"
                }
              </div>
              <p className="text-sm text-muted-foreground">
                {user.onTimePayments} on-time · {user.latePayments} late · {user.missedPayments} missed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Group Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-1">{user.monthsActive}</div>
              <p className="text-sm text-muted-foreground">Months active · {user.completedCycles} full cycle{user.completedCycles !== 1 ? "s" : ""} completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Group Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-1 ${score >= 750 ? "text-emerald-400" : "text-muted-foreground"}`}>
                {score >= 750 ? "Eligible" : "Locked"}
              </div>
              <p className="text-sm text-muted-foreground">
                {score >= 750
                  ? "You can create and publish groups"
                  : `${750 - score} more points needed`
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reputation history */}
        <Card>
          <CardHeader>
            <CardTitle>Score History</CardTitle>
            <p className="text-sm text-muted-foreground">Recent events that changed your score</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {HISTORY.map((ev, i) => (
                <div key={i} className="flex items-start justify-between pb-4 last:pb-0 border-b last:border-0 border-border">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${ev.change > 0 ? "bg-primary/10" : "bg-red-500/10"}`}>
                      {ev.change > 0
                        ? <ArrowUp className="h-5 w-5 text-primary" />
                        : <ArrowDown className="h-5 w-5 text-red-400" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{ev.title}</p>
                        {ev.badge && <Badge variant="outline" className="text-xs">{ev.badge}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{ev.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{ev.date}
                      </p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold flex-shrink-0 ${ev.change > 0 ? "text-primary" : "text-red-400"}`}>
                    {ev.change > 0 ? "+" : ""}{ev.change}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = a.condition(user);
                return (
                  <div key={a.name} className={`flex flex-col items-center p-4 rounded-lg border transition-colors ${unlocked ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border opacity-50"}`}>
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-3 ${unlocked ? "bg-primary/10" : "bg-muted"}`}>
                      <a.icon className={`h-7 w-7 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <p className="text-sm font-medium text-center">{a.name}</p>
                    <p className="text-xs text-muted-foreground text-center mt-1">{a.description}</p>
                    {unlocked && (
                      <Badge variant="outline" className="mt-2 text-xs text-primary border-primary/30">
                        <CheckCircle className="h-3 w-3 mr-1" />Earned
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* How to grow */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              How to Grow Your Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {TIPS.map((tip) => (
                <div key={tip.title} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                  <span className="text-xs font-bold text-primary flex-shrink-0">{tip.points}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
}

function MetricTile({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="bg-muted/40 rounded-lg p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-semibold ${good === true ? "text-emerald-400" : good === false ? "text-amber-400" : ""}`}>{value}</p>
    </div>
  );
}

const HISTORY = [
  { title: "On-time Payment", description: "Soweto Teachers Circle — May 2026", date: "1 Jun 2026", change: 10, badge: null },
  { title: "6-Month Streak Bonus", description: "Consistent payments for 6 consecutive cycles", date: "1 Jun 2026", change: 75, badge: "Milestone" },
  { title: "Early Payment Bonus", description: "Paid 4 days before deadline", date: "28 May 2026", change: 5, badge: null },
  { title: "Cycle Completion Bonus", description: "Completed full 12-month rotation", date: "1 May 2026", change: 50, badge: "Milestone" },
  { title: "Late Payment", description: "Young Entrepreneurs Fund — Mar 2026", date: "12 Mar 2026", change: -5, badge: null },
];

const ACHIEVEMENTS = [
  { name: "First Step", description: "Made first contribution", icon: CheckCircle, condition: (u: UserProfile) => u.onTimePayments >= 1 },
  { name: "Consistent Saver", description: "6-month streak", icon: Calendar, condition: (u: UserProfile) => u.monthsActive >= 6 },
  { name: "Cycle Champion", description: "Completed a full cycle", icon: Award, condition: (u: UserProfile) => u.completedCycles >= 1 },
  { name: "Group Leader", description: "Created your own group", icon: Crown, condition: (u: UserProfile) => u.reputationScore >= 750 && u.completedCycles >= 1 },
];

const TIPS = [
  { title: "Pay on time", description: "Every on-time payment", points: "+10 pts", icon: CheckCircle },
  { title: "Pay early", description: "3+ days before deadline", points: "+5 pts", icon: Clock },
  { title: "Complete a cycle", description: "Stay to the end of a rotation", points: "+50 pts", icon: Award },
  { title: "6-month streak", description: "Zero misses across 6 cycles", points: "+75 pts", icon: TrendingUp },
  { title: "Vouch for a member", description: "Mentor joins and completes first cycle", points: "+30 pts", icon: Shield },
  { title: "Upload bank statement", description: "Liquidity verified by AI", points: "+up to 250 pts", icon: Banknote },
];
