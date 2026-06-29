import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Users,
  DollarSign,
  Calendar,
  Crown,
  Info,
  CheckCircle,
  Lock,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";

type PayoutFrequency = "weekly" | "biweekly" | "monthly" | "quarterly";

const FREQUENCY_CONFIG: Record<
  PayoutFrequency,
  { label: string; cyclesPerYear: number; minMembers: number; maxMembers: number; joinWindowCycles: number }
> = {
  weekly:    { label: "Weekly",      cyclesPerYear: 52, minMembers: 4,  maxMembers: 12, joinWindowCycles: 2 },
  biweekly:  { label: "Bi-weekly",   cyclesPerYear: 26, minMembers: 4,  maxMembers: 16, joinWindowCycles: 2 },
  monthly:   { label: "Monthly",     cyclesPerYear: 12, minMembers: 6,  maxMembers: 24, joinWindowCycles: 3 },
  quarterly: { label: "Quarterly",   cyclesPerYear: 4,  minMembers: 4,  maxMembers: 12, joinWindowCycles: 1 },
};

const TRUST_THRESHOLD = 750;
const CYCLES_REQUIRED = 1;

export default function CreateGroup() {
  const navigate = useNavigate();
  const { user, canCreateGroup } = useUser();

  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    memberLimit: "",
    contributionAmount: "",
    durationCycles: "",
    startDate: "",
    category: "",
    privacyLevel: "request",
    payoutFrequency: "monthly" as PayoutFrequency,
    minReputationScore: "600",
    minLiquidityRatio: "3",
  });

  const freq = FREQUENCY_CONFIG[formData.payoutFrequency];

  const totalMembers = parseInt(formData.memberLimit) || 0;
  const contribution = parseInt(formData.contributionAmount) || 0;
  const cycles = parseInt(formData.durationCycles) || 0;

  const potPerPayout = totalMembers * contribution;
  const totalPerMember = contribution * cycles;
  const durationMonths = Math.ceil(
    cycles / (freq.cyclesPerYear / 12)
  );

  // Join window: new members can only join within the first N cycles
  const joinWindowCycles = freq.joinWindowCycles;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateGroup) {
      toast.error("You need Gold tier (750+) and 1 completed cycle to create a group.");
      return;
    }
    toast.success(`"${formData.groupName}" created successfully!`);
    navigate("/my-groups");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!canCreateGroup) {
    return (
      <Sidebar>
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create a Savings Group</h1>
            <p className="text-muted-foreground">Lead a new stokvel circle on the platform</p>
          </div>

          <Card className="border-amber-500/40 bg-amber-500/5">
            <CardContent className="p-8 text-center space-y-5">
              <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Gold Tier Required</h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  To create and publish a group, you must be a proven, disciplined saver. This protects all members who will trust you as their group leader.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm max-w-xs mx-auto">
                <RequirementRow
                  label="Reliability Score ≥ 750"
                  met={user.reputationScore >= TRUST_THRESHOLD}
                  current={`${user.reputationScore} / 750`}
                />
                <RequirementRow
                  label="At least 1 completed cycle"
                  met={user.completedCycles >= CYCLES_REQUIRED}
                  current={`${user.completedCycles} cycle${user.completedCycles !== 1 ? "s" : ""}`}
                />
                <RequirementRow
                  label="Zero missed payments"
                  met={user.missedPayments === 0}
                  current={user.missedPayments === 0 ? "Clean record" : `${user.missedPayments} missed`}
                />
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-4">
                  You need <span className="font-semibold text-foreground">{Math.max(0, TRUST_THRESHOLD - user.reputationScore)} more points</span> to reach Gold tier. Join an existing group to build your score.
                </p>
                <Link to="/marketplace">
                  <Button variant="outline" className="w-full">
                    Browse Groups to Join
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold">Create a Savings Group</h1>
            <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Gold+ Feature
            </Badge>
          </div>
          <p className="text-muted-foreground">
            You're a trusted member — configure your stokvel circle below
          </p>
        </div>

        {/* Creator score card */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Reliability Score</p>
                  <p className="text-2xl font-bold text-yellow-500">{user.reputationScore}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="text-center">
                  <p className="font-semibold text-foreground">{user.completedCycles}</p>
                  <p>Cycles</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">{user.onTimePayments}</p>
                  <p>On-time</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-emerald-400">{user.missedPayments}</p>
                  <p>Missed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Soweto Teachers Savings Circle"
                  value={formData.groupName}
                  onChange={(e) => handleChange("groupName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose, goals, and who this group is for…"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => handleChange("category", v)} required>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="family">Family & Friends</SelectItem>
                    <SelectItem value="business">Business / Asset Acquisition</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="factory">Cooperative / Factory</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payout Schedule — most important config */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Payout Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Payout Frequency *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(FREQUENCY_CONFIG) as [PayoutFrequency, typeof freq][]).map(([key, cfg]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => handleChange("payoutFrequency", key)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        formData.payoutFrequency === key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-semibold text-sm">{cfg.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cfg.minMembers}–{cfg.maxMembers} members
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Join window: first {cfg.joinWindowCycles} cycle{cfg.joinWindowCycles !== 1 ? "s" : ""}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="durationCycles">
                    Duration (number of {freq.label.toLowerCase()} cycles) *
                  </Label>
                  <Input
                    id="durationCycles"
                    type="number"
                    placeholder={`e.g., ${freq.cyclesPerYear}`}
                    min={freq.minMembers}
                    max={freq.cyclesPerYear * 3}
                    value={formData.durationCycles}
                    onChange={(e) => handleChange("durationCycles", e.target.value)}
                    required
                  />
                  {cycles > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ≈ {durationMonths} month{durationMonths !== 1 ? "s" : ""} total
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* Join window explanation */}
              <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 text-sm">
                <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Join Window Rule</p>
                  <p className="text-muted-foreground">
                    New members may only join within the first <strong>{joinWindowCycles} {freq.label.toLowerCase()} cycle{joinWindowCycles !== 1 ? "s" : ""}</strong> after the group starts. After that, the group is closed — this ensures all members receive a fair payout rotation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contributionAmount">
                    Contribution per {freq.label.split("-")[0].toLowerCase()} period (R) *
                  </Label>
                  <Input
                    id="contributionAmount"
                    type="number"
                    placeholder="e.g., 500"
                    min="50"
                    value={formData.contributionAmount}
                    onChange={(e) => handleChange("contributionAmount", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Minimum R50 per cycle</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberLimit">
                    Maximum Members *
                    <span className="text-muted-foreground font-normal ml-1">({freq.minMembers}–{freq.maxMembers} for {freq.label.toLowerCase()})</span>
                  </Label>
                  <Input
                    id="memberLimit"
                    type="number"
                    placeholder={`e.g., ${Math.round((freq.minMembers + freq.maxMembers) / 2)}`}
                    min={freq.minMembers}
                    max={freq.maxMembers}
                    value={formData.memberLimit}
                    onChange={(e) => handleChange("memberLimit", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Live calculation */}
              {contribution > 0 && totalMembers > 0 && (
                <Card className="bg-muted/40">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm text-center">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Pot per Payout</p>
                        <p className="text-xl font-bold text-primary">R{potPerPayout.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Your Total Contribution</p>
                        <p className="text-xl font-bold">R{totalPerMember.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Duration</p>
                        <p className="text-xl font-bold">~{durationMonths}mo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Member Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Member Eligibility Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minReputationScore">Minimum Reliability Score *</Label>
                  <Input
                    id="minReputationScore"
                    type="number"
                    min="400"
                    max="849"
                    value={formData.minReputationScore}
                    onChange={(e) => handleChange("minReputationScore", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: ≥600 for a {freq.label.toLowerCase()} group
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minLiquidityRatio">
                    Min Income-to-Contribution Ratio *
                  </Label>
                  <Select
                    value={formData.minLiquidityRatio}
                    onValueChange={(v) => handleChange("minLiquidityRatio", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2× (accessible)</SelectItem>
                      <SelectItem value="3">3× (recommended)</SelectItem>
                      <SelectItem value="4">4× (conservative)</SelectItem>
                      <SelectItem value="5">5× (strict)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Member's income must be at least {formData.minLiquidityRatio}× the contribution
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacyLevel">Join Mode *</Label>
                <Select value={formData.privacyLevel} onValueChange={(v) => handleChange("privacyLevel", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Open — Anyone meeting the score can join instantly</SelectItem>
                    <SelectItem value="request">Request — Applicants need your approval</SelectItem>
                    <SelectItem value="private">Invite Only — You send invitations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Important rules */}
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium">Immutable Group Rules</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Contribution amount and payout frequency cannot be changed once the group starts</li>
                    <li>The payout rotation order is set by smart contract at group start</li>
                    <li>Members can only join within the first {joinWindowCycles} {freq.label.toLowerCase()} cycle{joinWindowCycles !== 1 ? "s" : ""}</li>
                    <li>All contribution events and payouts are recorded on-chain — tamper-proof</li>
                    <li>AI anomaly detection flags unusual transactions for your review as treasurer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link to="/my-groups" className="flex-1">
              <Button type="button" variant="outline" className="w-full">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Publish Group
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}

function RequirementRow({ label, met, current }: { label: string; met: boolean; current: string }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-3 ${met ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
      <div className="flex items-center gap-2">
        {met
          ? <CheckCircle className="h-4 w-4 text-emerald-400" />
          : <Lock className="h-4 w-4 text-red-400" />
        }
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-xs font-medium ${met ? "text-emerald-400" : "text-red-400"}`}>{current}</span>
    </div>
  );
}
