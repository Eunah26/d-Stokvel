import { createContext, useContext, useState, ReactNode } from "react";

export type MemberTrack = "new" | "banked" | "migrating";

export interface LiquidityAnalysis {
  avgMonthlyBalance: number;
  incomeRegularity: number; // 0-100
  savingsConsistency: number; // 0-100
  existingStokvels: number;
  estimatedMonthlyIncome: number;
  debtToIncomeRatio: number; // 0-1
  liquidityScore: number; // 0-250
}

export interface GroupHistoryAnalysis {
  groupAge: number; // months
  memberCount: number;
  paymentDiscipline: number; // 0-100
  ruleAdherence: number; // 0-100
  completedCycles: number;
  structureScore: number; // 0-200
}

export interface UserProfile {
  track: MemberTrack;
  reputationScore: number;
  tier: "unranked" | "bronze" | "silver" | "gold" | "platinum";
  onboardingComplete: boolean;
  liquidityAnalysis: LiquidityAnalysis | null;
  groupHistoryAnalysis: GroupHistoryAnalysis | null;
  onTimePayments: number;
  latePayments: number;
  missedPayments: number;
  completedCycles: number;
  monthsActive: number;
}

const defaultProfile: UserProfile = {
  track: "new",
  reputationScore: 0,
  tier: "unranked",
  onboardingComplete: false,
  liquidityAnalysis: null,
  groupHistoryAnalysis: null,
  onTimePayments: 0,
  latePayments: 0,
  missedPayments: 0,
  completedCycles: 0,
  monthsActive: 0,
};

function calcTier(score: number): UserProfile["tier"] {
  if (score >= 850) return "platinum";
  if (score >= 750) return "gold";
  if (score >= 650) return "silver";
  if (score >= 500) return "bronze";
  return "unranked";
}

interface UserContextValue {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  updateScore: (delta: number, reason: string) => void;
  completeOnboarding: (
    track: MemberTrack,
    score: number,
    liquidity: LiquidityAnalysis | null,
    groupHistory: GroupHistoryAnalysis | null
  ) => void;
  canCreateGroup: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("dstokvel_user");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultProfile;
  });

  const setUser = (u: UserProfile) => {
    const updated = { ...u, tier: calcTier(u.reputationScore) };
    setUserState(updated);
    localStorage.setItem("dstokvel_user", JSON.stringify(updated));
  };

  const updateScore = (delta: number) => {
    const newScore = Math.max(0, user.reputationScore + delta);
    setUser({ ...user, reputationScore: newScore });
  };

  const completeOnboarding = (
    track: MemberTrack,
    score: number,
    liquidity: LiquidityAnalysis | null,
    groupHistory: GroupHistoryAnalysis | null
  ) => {
    setUser({
      ...user,
      track,
      reputationScore: score,
      tier: calcTier(score),
      onboardingComplete: true,
      liquidityAnalysis: liquidity,
      groupHistoryAnalysis: groupHistory,
      monthsActive: track === "migrating" && groupHistory ? groupHistory.groupAge : 0,
      completedCycles: track === "migrating" && groupHistory ? groupHistory.completedCycles : 0,
    });
  };

  const canCreateGroup =
    user.reputationScore >= 750 &&
    user.completedCycles >= 1 &&
    user.missedPayments === 0;

  return (
    <UserContext.Provider value={{ user, setUser, updateScore, completeOnboarding, canCreateGroup }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}

export { calcTier };
