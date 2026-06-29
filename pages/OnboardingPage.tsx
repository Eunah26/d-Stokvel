import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  Users,
  Banknote,
  UserPlus,
  BookOpen,
  Brain,
  AlertCircle,
  TrendingUp,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useUser, MemberTrack, LiquidityAnalysis, GroupHistoryAnalysis } from "../context/UserContext";
import {
  analyzeBankStatement,
  analyzeGroupBook,
  calcInitialScore,
} from "../services/aiScoring";

type Step = "track" | "documents" | "analysis" | "score";

const TRACKS = [
  {
    id: "banked" as MemberTrack,
    icon: Banknote,
    title: "I have a bank account",
    subtitle: "Upload your bank statement so our AI can assess your liquidity and savings discipline",
    color: "border-blue-500/50 bg-blue-500/5",
    badge: "NLP Analysis",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    id: "migrating" as MemberTrack,
    icon: BookOpen,
    title: "We're migrating from a traditional Stokvel",
    subtitle: "Upload photos of your group's savings book — our AI reads your group's history and discipline",
    color: "border-amber-500/50 bg-amber-500/5",
    badge: "OCR + AI",
    badgeColor: "bg-amber-500/20 text-amber-400",
  },
  {
    id: "new" as MemberTrack,
    icon: UserPlus,
    title: "I'm new to Stokvels",
    subtitle: "No bank account or group history needed — you'll build your score through consistent contributions",
    color: "border-emerald-500/50 bg-emerald-500/5",
    badge: "Behavioral Scoring",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();

  const [step, setStep] = useState<Step>("track");
  const [track, setTrack] = useState<MemberTrack | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [liquidity, setLiquidity] = useState<LiquidityAnalysis | null>(null);
  const [groupHistory, setGroupHistory] = useState<GroupHistoryAnalysis | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<{ label: string; points: number; description: string }[]>([]);

  const steps: Step[] = ["track", "documents", "analysis", "score"];
  const stepIndex = steps.indexOf(step);
  const progressValue = ((stepIndex) / (steps.length - 1)) * 100;

  const handleTrackSelect = (t: MemberTrack) => {
    setTrack(t);
    if (t === "new") {
      // New members skip to score directly
      const { score, breakdown } = calcInitialScore("new", null, null);
      setFinalScore(score);
      setScoreBreakdown(breakdown);
      setStep("score");
    } else {
      setStep("documents");
    }
  };

  const canProceedDocuments = () => {
    if (!idFile) return false;
    if (track === "banked" || track === "migrating") return !!primaryFile;
    return true;
  };

  const runAnalysis = async () => {
    if (!primaryFile || !track) return;
    setStep("analysis");
    setAnalyzing(true);
    setAnalysisProgress(0);

    const stages =
      track === "banked"
        ? [
            "Extracting text from bank statement…",
            "Running NLP income pattern recognition…",
            "Analysing savings consistency…",
            "Calculating debt-to-income ratio…",
            "Computing Liquidity Score…",
          ]
        : [
            "Running OCR on group book photo…",
            "Parsing handwritten payment records…",
            "Detecting contribution rhythm patterns…",
            "Assessing rule adherence…",
            "Computing Group History Score…",
          ];

    const interval = setInterval(() => {
      setAnalysisProgress((p) => {
        const next = p + 100 / (stages.length * 6);
        const stageIdx = Math.min(stages.length - 1, Math.floor((next / 100) * stages.length));
        setAnalysisStage(stages[stageIdx]);
        return Math.min(95, next);
      });
    }, 250);

    try {
      let liq: LiquidityAnalysis | null = null;
      let grp: GroupHistoryAnalysis | null = null;

      if (track === "banked") {
        liq = await analyzeBankStatement(primaryFile);
        setLiquidity(liq);
      } else if (track === "migrating") {
        grp = await analyzeGroupBook(primaryFile);
        setGroupHistory(grp);
      }

      clearInterval(interval);
      setAnalysisProgress(100);
      setAnalysisStage("Analysis complete!");

      const { score, breakdown } = calcInitialScore(track, liq, grp);
      setFinalScore(score);
      setScoreBreakdown(breakdown);

      await new Promise((r) => setTimeout(r, 600));
      setStep("score");
    } catch {
      clearInterval(interval);
      toast.error("Analysis failed. Using base score.");
      const { score, breakdown } = calcInitialScore(track, null, null);
      setFinalScore(score);
      setScoreBreakdown(breakdown);
      setStep("score");
    } finally {
      setAnalyzing(false);
    }
  };

  const finish = () => {
    if (!track) return;
    completeOnboarding(track, finalScore, liquidity, groupHistory);
    toast.success(`Welcome! Your Reliability Score is ${finalScore}.`);
    navigate("/dashboard");
  };

  const tier =
    finalScore >= 850 ? { label: "Platinum", color: "text-purple-400" } :
    finalScore >= 750 ? { label: "Gold", color: "text-yellow-400" } :
    finalScore >= 650 ? { label: "Silver", color: "text-slate-300" } :
    finalScore >= 500 ? { label: "Bronze", color: "text-amber-600" } :
    { label: "Unranked", color: "text-muted-foreground" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to d-Stokvel</h1>
          <p className="text-muted-foreground">
            Your AI-powered reliability score is calculated from your real financial behaviour
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                {steps.map((s, i) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i <= stepIndex ? "bg-primary w-8" : "bg-muted w-4"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                Step {stepIndex + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progressValue} className="h-1" />
          </CardHeader>

          <CardContent className="pt-4 space-y-6">

            {/* STEP 1: Track selection */}
            {step === "track" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Which describes you?</h2>
                  <p className="text-sm text-muted-foreground">
                    This determines how we calculate your initial Reliability Score
                  </p>
                </div>
                {TRACKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTrackSelect(t.id)}
                    className={`w-full text-left rounded-xl border-2 p-5 transition-all hover:scale-[1.01] active:scale-[0.99] ${t.color} hover:border-primary`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0">
                        <t.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold">{t.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.badgeColor}`}>
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug">{t.subtitle}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: Document upload */}
            {step === "documents" && track && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {track === "banked" ? "Upload Your Bank Statement" : "Upload Your Group Savings Book"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {track === "banked"
                      ? "Last 3 months of your personal bank statement — our AI analyses your liquidity, income regularity, and savings consistency"
                      : "A clear photo of your group's payment record book — our AI reads contribution history, group structure, and member discipline"}
                  </p>
                </div>

                {/* Primary document */}
                <div>
                  <Label className="mb-2 block">
                    {track === "banked" ? "Bank Statement (PDF or photo)" : "Group Book Photo"}
                    <span className="text-red-400 ml-1">*</span>
                  </Label>
                  <label
                    htmlFor="primaryFile"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                      primaryFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Input
                      id="primaryFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.heic"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setPrimaryFile(f); toast.success(`${f.name} ready for analysis`); }
                      }}
                    />
                    {primaryFile ? (
                      <div className="text-center">
                        <CheckCircle className="h-10 w-10 text-primary mx-auto mb-2" />
                        <p className="font-medium text-primary">{primaryFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-medium">Click or drag to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — max 10MB</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* AI preview callout */}
                {primaryFile && (
                  <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">
                        {track === "banked" ? "AI will analyse:" : "AI will detect:"}
                      </p>
                      <ul className="text-muted-foreground space-y-0.5">
                        {track === "banked" ? (
                          <>
                            <li>• Average monthly balance & income regularity</li>
                            <li>• Savings consistency across 3 months</li>
                            <li>• Existing stokvel / debit order patterns</li>
                            <li>• Debt-to-income ratio</li>
                          </>
                        ) : (
                          <>
                            <li>• Contribution rhythm and punctuality</li>
                            <li>• Group structure and rule adherence</li>
                            <li>• Number of completed cycles</li>
                            <li>• Member count and group age</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* ID Document */}
                <div>
                  <Label className="mb-2 block">
                    ID Document (SA ID / Passport)
                    <span className="text-red-400 ml-1">*</span>
                  </Label>
                  <label
                    htmlFor="idFile"
                    className={`flex items-center gap-4 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors ${
                      idFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Input
                      id="idFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setIdFile(f); toast.success("ID document ready"); }
                      }}
                    />
                    {idFile ? (
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    ) : (
                      <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {idFile ? idFile.name : "Upload ID document"}
                      </p>
                      <p className="text-xs text-muted-foreground">+50 identity verification points</p>
                    </div>
                  </label>
                </div>

                {/* Privacy note */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Your documents are processed on-device and never stored. Only the extracted score is saved on-chain.</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("track")} className="flex-1">Back</Button>
                  <Button
                    onClick={runAnalysis}
                    disabled={!canProceedDocuments()}
                    className="flex-1"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Run AI Analysis
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Analysis in progress */}
            {step === "analysis" && (
              <div className="space-y-8 py-6">
                <div className="text-center">
                  <div className="relative h-24 w-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">AI Analysis Running</h2>
                  <p className="text-sm text-muted-foreground">{analysisStage}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing…</span>
                    <span className="font-medium">{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-3" />
                </div>

                {track === "banked" && (
                  <div className="grid grid-cols-2 gap-3">
                    {["Income Regularity", "Savings Consistency", "Liquidity Depth", "Stokvel History"].map((label, i) => (
                      <div key={label} className={`rounded-lg border p-3 text-sm transition-all duration-700 ${
                        analysisProgress > (i + 1) * 22 ? "border-primary/40 bg-primary/5" : "border-border opacity-40"
                      }`}>
                        <div className="flex items-center gap-2">
                          {analysisProgress > (i + 1) * 22
                            ? <CheckCircle className="h-4 w-4 text-primary" />
                            : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                          }
                          <span>{label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {track === "migrating" && (
                  <div className="grid grid-cols-2 gap-3">
                    {["OCR Extraction", "Payment Patterns", "Rule Adherence", "Cycle History"].map((label, i) => (
                      <div key={label} className={`rounded-lg border p-3 text-sm transition-all duration-700 ${
                        analysisProgress > (i + 1) * 22 ? "border-amber-500/40 bg-amber-500/5" : "border-border opacity-40"
                      }`}>
                        <div className="flex items-center gap-2">
                          {analysisProgress > (i + 1) * 22
                            ? <CheckCircle className="h-4 w-4 text-amber-400" />
                            : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                          }
                          <span>{label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Score reveal */}
            {step === "score" && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="h-14 w-14 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-1">Your Reliability Score</h2>
                  <p className="text-sm text-muted-foreground">
                    {track === "new"
                      ? "Build your score through consistent, on-time contributions"
                      : "Calculated from your real financial behaviour"}
                  </p>
                </div>

                {/* Score display */}
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-2 mb-6">
                      <div className="text-7xl font-bold text-primary tabular-nums">{finalScore}</div>
                      <Badge className={`${tier.color} bg-transparent border border-current px-3 py-1`}>
                        {tier.label} Tier
                      </Badge>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3">
                      {scoreBreakdown.map((item) => (
                        <div key={item.label} className="rounded-lg bg-background/50 p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="text-primary font-bold">+{item.points}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Liquidity detail for banked track */}
                {liquidity && track === "banked" && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        AI Liquidity Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Avg Monthly Balance</p>
                        <p className="font-semibold">R{liquidity.avgMonthlyBalance.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Est. Monthly Income</p>
                        <p className="font-semibold">R{liquidity.estimatedMonthlyIncome.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Income Regularity</p>
                        <p className="font-semibold">{liquidity.incomeRegularity}%</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Savings Consistency</p>
                        <p className="font-semibold">{liquidity.savingsConsistency}%</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Debt-to-Income</p>
                        <p className="font-semibold">{Math.round(liquidity.debtToIncomeRatio * 100)}%</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Existing Stokvels</p>
                        <p className="font-semibold">{liquidity.existingStokvels} detected</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Group history detail for migrating track */}
                {groupHistory && track === "migrating" && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4 text-amber-400" />
                        AI Group Book Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Group Age</p>
                        <p className="font-semibold">{groupHistory.groupAge} months</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Members Detected</p>
                        <p className="font-semibold">{groupHistory.memberCount}</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Payment Discipline</p>
                        <p className="font-semibold">{groupHistory.paymentDiscipline}%</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs mb-1">Rule Adherence</p>
                        <p className="font-semibold">{groupHistory.ruleAdherence}%</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3 col-span-2">
                        <p className="text-muted-foreground text-xs mb-1">Completed Cycles</p>
                        <p className="font-semibold">{groupHistory.completedCycles} full cycle{groupHistory.completedCycles !== 1 ? "s" : ""}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* What's next */}
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    How to grow your score
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• On-time contribution every cycle: <span className="text-primary font-medium">+10 pts</span></li>
                    <li>• Early contribution (3+ days early): <span className="text-primary font-medium">+5 pts</span></li>
                    <li>• Completing a full cycle: <span className="text-primary font-medium">+50 pts</span></li>
                    <li>• 6-month streak (no misses): <span className="text-primary font-medium">+75 pts</span></li>
                    {track !== "banked" && (
                      <li>• Linking a verified bank account later: <span className="text-primary font-medium">+up to 250 pts</span></li>
                    )}
                  </ul>
                  {finalScore < 750 && (
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
                      <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        You need <span className="font-medium text-foreground">{750 - finalScore} more points</span> to reach Gold tier and become eligible to create your own group.
                      </p>
                    </div>
                  )}
                </div>

                <Button onClick={finish} className="w-full" size="lg">
                  Enter d-Stokvel
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
