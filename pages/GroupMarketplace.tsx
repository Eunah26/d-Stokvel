import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Users,
  TrendingUp,
  Shield,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Award,
  Clock,
  Lock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { calcGroupCompatibility } from "../services/aiScoring";
import { Link } from "react-router";

type PayoutFrequency = "weekly" | "biweekly" | "monthly" | "quarterly" | "all";

interface Group {
  id: string;
  name: string;
  description: string;
  trustLevel: "High" | "Medium" | "Low";
  currentMembers: number;
  maxMembers: number;
  contributionAmount: number;
  payoutFrequency: Exclude<PayoutFrequency, "all">;
  totalCycles: number;
  cyclesElapsed: number;
  joinWindowCycles: number;
  minScore: number;
  minLiquidityRatio: number;
  category: string;
  featured?: boolean;
}

const FREQUENCY_LABEL: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

const FREQUENCY_COLOR: Record<string, string> = {
  weekly:    "bg-purple-500/20 text-purple-400",
  biweekly:  "bg-blue-500/20 text-blue-400",
  monthly:   "bg-emerald-500/20 text-emerald-400",
  quarterly: "bg-amber-500/20 text-amber-400",
};

export default function GroupMarketplace() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("compatibility");
  const [freqFilter, setFreqFilter] = useState<PayoutFrequency>("all");

  const joinWindowOpen = (g: Group) => g.cyclesElapsed < g.joinWindowCycles;
  const hasSpace = (g: Group) => g.currentMembers < g.maxMembers;
  const canJoin = (g: Group) => joinWindowOpen(g) && hasSpace(g);

  const getCompatibility = (g: Group) =>
    calcGroupCompatibility(
      user.reputationScore,
      user.liquidityAnalysis,
      g.minScore,
      g.contributionAmount,
      g.payoutFrequency
    );

  const filtered = ALL_GROUPS
    .filter((g) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery = !q || g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.category.toLowerCase().includes(q);
      const matchesFreq = freqFilter === "all" || g.payoutFrequency === freqFilter;
      return matchesQuery && matchesFreq;
    })
    .sort((a, b) => {
      if (sortBy === "compatibility") {
        return getCompatibility(b).compatibilityPct - getCompatibility(a).compatibilityPct;
      }
      if (sortBy === "trust") return a.minScore > b.minScore ? -1 : 1;
      if (sortBy === "contribution") return a.contributionAmount - b.contributionAmount;
      if (sortBy === "openFirst") {
        const aOpen = canJoin(a) ? 0 : 1;
        const bOpen = canJoin(b) ? 0 : 1;
        return aOpen - bOpen;
      }
      return 0;
    });

  const featured = filtered.filter((g) => g.featured);
  const rest = filtered.filter((g) => !g.featured);

  const handleJoin = (g: Group) => {
    const compat = getCompatibility(g);
    if (!compat.eligible) {
      toast.error(`You don't meet this group's requirements yet.`);
      return;
    }
    if (!canJoin(g)) {
      toast.error(joinWindowOpen(g) ? "Group is full." : "Join window has closed for this group.");
      return;
    }
    toast.success(`Join request sent to "${g.name}"`);
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Group Marketplace</h1>
          <p className="text-muted-foreground">
            Groups ranked by your AI compatibility score — based on your reliability and liquidity profile
          </p>
        </div>

        {/* User score snapshot */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Your Score</p>
                  <p className="text-2xl font-bold text-primary">{user.reputationScore}</p>
                </div>
                {user.liquidityAnalysis && (
                  <>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Est. Income</p>
                      <p className="font-semibold">R{user.liquidityAnalysis.estimatedMonthlyIncome.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Avg Balance</p>
                      <p className="font-semibold">R{user.liquidityAnalysis.avgMonthlyBalance.toLocaleString()}</p>
                    </div>
                  </>
                )}
                {!user.liquidityAnalysis && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Upload a bank statement to unlock liquidity-based matching</span>
                  </div>
                )}
              </div>
              <Badge className={
                user.tier === "platinum" ? "bg-purple-500/20 text-purple-400" :
                user.tier === "gold" ? "bg-yellow-500/20 text-yellow-400" :
                user.tier === "silver" ? "bg-slate-400/20 text-slate-300" :
                "bg-amber-700/20 text-amber-600"
              }>
                {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Tier
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search and filters */}
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups by name, category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={freqFilter} onValueChange={(v) => setFreqFilter(v as PayoutFrequency)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compatibility">Best Match (AI)</SelectItem>
                  <SelectItem value="trust">Highest Trust</SelectItem>
                  <SelectItem value="contribution">Lowest Contribution</SelectItem>
                  <SelectItem value="openFirst">Join Window Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured groups */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Featured Groups</h2>
              <Badge variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                Best Match
              </Badge>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {featured.map((g) => (
                <GroupCard key={g.id} group={g} onJoin={handleJoin} getCompatibility={getCompatibility} canJoin={canJoin} joinWindowOpen={joinWindowOpen} />
              ))}
            </div>
          </div>
        )}

        {/* All groups */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Available Groups</h2>
          {rest.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No groups match your filters.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((g) => (
                <GroupCard key={g.id} group={g} onJoin={handleJoin} getCompatibility={getCompatibility} canJoin={canJoin} joinWindowOpen={joinWindowOpen} compact />
              ))}
            </div>
          )}
        </div>

        {/* Create CTA */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Want to start your own circle?</h3>
                <p className="text-sm text-muted-foreground">
                  Gold tier members (750+) can create and publish groups
                </p>
              </div>
              <Link to="/create-group">
                <Button size="lg" variant="secondary">Create Group</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
}

function GroupCard({
  group: g,
  onJoin,
  getCompatibility,
  canJoin,
  joinWindowOpen,
  compact = false,
}: {
  group: Group;
  onJoin: (g: Group) => void;
  getCompatibility: (g: Group) => ReturnType<typeof calcGroupCompatibility>;
  canJoin: (g: Group) => boolean;
  joinWindowOpen: (g: Group) => boolean;
  compact?: boolean;
}) {
  const compat = getCompatibility(g);
  const open = canJoin(g);
  const windowOpen = joinWindowOpen(g);
  const full = g.currentMembers >= g.maxMembers;
  const cyclesLeft = g.joinWindowCycles - g.cyclesElapsed;

  const compatColor =
    compat.compatibilityPct >= 80 ? "text-emerald-400" :
    compat.compatibilityPct >= 50 ? "text-amber-400" : "text-red-400";

  const joinStatusBadge = full
    ? <Badge variant="outline" className="text-muted-foreground border-muted">Full</Badge>
    : !windowOpen
    ? <Badge variant="outline" className="text-red-400 border-red-500/30">Window Closed</Badge>
    : cyclesLeft <= 1
    ? <Badge className="bg-amber-500/20 text-amber-400">Last chance — {cyclesLeft} cycle left</Badge>
    : <Badge className="bg-emerald-500/20 text-emerald-400">Open — {cyclesLeft} cycles left</Badge>;

  return (
    <Card className={`hover:border-primary/50 transition-colors ${!open || !compat.eligible ? "opacity-80" : ""}`}>
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className={compact ? "text-base mb-1" : "text-lg mb-1"}>{g.name}</CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-2">{g.description}</p>
          </div>
          <Badge className={`text-xs flex-shrink-0 ${FREQUENCY_COLOR[g.payoutFrequency]}`}>
            {FREQUENCY_LABEL[g.payoutFrequency]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Compatibility meter */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI Compatibility
            </span>
            <span className={`font-bold ${compatColor}`}>{compat.compatibilityPct}%</span>
          </div>
          <Progress value={compat.compatibilityPct} className="h-1.5" />
          <div className="mt-1.5 space-y-0.5">
            {compat.reasons.map((r, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                {compat.eligible
                  ? <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                  : <XCircle className="h-3 w-3 text-red-400 flex-shrink-0" />
                }
                {r}
              </p>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{g.currentMembers}/{g.maxMembers} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            <span>R{g.contributionAmount.toLocaleString()} /{FREQUENCY_LABEL[g.payoutFrequency].toLowerCase().split("-")[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{g.totalCycles} cycles total</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Award className="h-3.5 w-3.5" />
            <span>Min score: {g.minScore}</span>
          </div>
        </div>

        {/* Pot value highlight */}
        <div className="bg-muted/40 rounded-lg p-3 flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Pot per payout</span>
          <span className="font-bold text-primary">R{(g.contributionAmount * g.maxMembers).toLocaleString()}</span>
        </div>

        {/* Join window status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Cycle {g.cyclesElapsed} of {g.totalCycles}</span>
          </div>
          {joinStatusBadge}
        </div>

        {/* CTA */}
        <Button
          className="w-full"
          size={compact ? "sm" : "default"}
          onClick={() => onJoin(g)}
          disabled={!open || !compat.eligible}
          variant={open && compat.eligible ? "default" : "outline"}
        >
          {!compat.eligible
            ? <><Lock className="h-3.5 w-3.5 mr-1.5" />Score too low</>
            : full
            ? "Group Full"
            : !windowOpen
            ? "Window Closed"
            : "Request to Join"
          }
        </Button>

        {/* Why locked */}
        {!compat.eligible && (
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Build your score in a lower-threshold group first
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Mock data ────────────────────────────────────────────────────────────────

const ALL_GROUPS: Group[] = [
  {
    id: "1",
    name: "Soweto Teachers Circle",
    description: "Educators pooling monthly to fund classroom resources and emergency support",
    trustLevel: "High",
    currentMembers: 9,
    maxMembers: 12,
    contributionAmount: 1500,
    payoutFrequency: "monthly",
    totalCycles: 12,
    cyclesElapsed: 1,
    joinWindowCycles: 3,
    minScore: 650,
    minLiquidityRatio: 3,
    category: "community",
    featured: true,
  },
  {
    id: "2",
    name: "Young Entrepreneurs Weekly",
    description: "Fast-rotating weekly savings for small business cash flow",
    trustLevel: "High",
    currentMembers: 6,
    maxMembers: 8,
    contributionAmount: 400,
    payoutFrequency: "weekly",
    totalCycles: 8,
    cyclesElapsed: 0,
    joinWindowCycles: 2,
    minScore: 600,
    minLiquidityRatio: 3,
    category: "business",
    featured: true,
  },
  {
    id: "3",
    name: "Factory Co-Op Fund",
    description: "12 members co-saving to purchase shared manufacturing equipment",
    trustLevel: "High",
    currentMembers: 8,
    maxMembers: 12,
    contributionAmount: 3000,
    payoutFrequency: "monthly",
    totalCycles: 12,
    cyclesElapsed: 4,
    joinWindowCycles: 3,
    minScore: 720,
    minLiquidityRatio: 4,
    category: "factory",
  },
  {
    id: "4",
    name: "Students Starter Club",
    description: "Low-barrier entry group for students building their first savings habit",
    trustLevel: "Medium",
    currentMembers: 10,
    maxMembers: 15,
    contributionAmount: 200,
    payoutFrequency: "monthly",
    totalCycles: 15,
    cyclesElapsed: 2,
    joinWindowCycles: 3,
    minScore: 400,
    minLiquidityRatio: 2,
    category: "education",
  },
  {
    id: "5",
    name: "Quarterly Asset Builders",
    description: "Conservative quarterly payouts — ideal for members saving for large assets",
    trustLevel: "High",
    currentMembers: 6,
    maxMembers: 12,
    contributionAmount: 5000,
    payoutFrequency: "quarterly",
    totalCycles: 12,
    cyclesElapsed: 0,
    joinWindowCycles: 1,
    minScore: 750,
    minLiquidityRatio: 5,
    category: "investment",
  },
  {
    id: "6",
    name: "Freelancers Bi-Weekly",
    description: "Flexible bi-weekly rotation for independent contractors with irregular income",
    trustLevel: "Medium",
    currentMembers: 7,
    maxMembers: 10,
    contributionAmount: 750,
    payoutFrequency: "biweekly",
    totalCycles: 10,
    cyclesElapsed: 1,
    joinWindowCycles: 2,
    minScore: 550,
    minLiquidityRatio: 3,
    category: "community",
  },
  {
    id: "7",
    name: "Healthcare Workers Fund",
    description: "Medical professionals — high-trust, high-contribution circle",
    trustLevel: "High",
    currentMembers: 12,
    maxMembers: 12,
    contributionAmount: 2500,
    payoutFrequency: "monthly",
    totalCycles: 12,
    cyclesElapsed: 6,
    joinWindowCycles: 3,
    minScore: 750,
    minLiquidityRatio: 4,
    category: "professional",
  },
  {
    id: "8",
    name: "Township Growth Circle",
    description: "Community-first group with accessible contribution amounts",
    trustLevel: "Medium",
    currentMembers: 14,
    maxMembers: 20,
    contributionAmount: 300,
    payoutFrequency: "monthly",
    totalCycles: 20,
    cyclesElapsed: 3,
    joinWindowCycles: 3,
    minScore: 500,
    minLiquidityRatio: 2,
    category: "community",
  },
];
