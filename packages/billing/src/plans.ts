export type PlanConfig = {
  code: string;
  name: string;
  monthlyVideoLimit: number;
  monthlyCreditsIncluded: number;
};

export const PLANS: Record<string, PlanConfig> = {
  free: {
    code: "free",
    name: "Free",
    monthlyVideoLimit: 5,
    monthlyCreditsIncluded: 50,
  },
  starter: {
    code: "starter",
    name: "Starter",
    monthlyVideoLimit: 30,
    monthlyCreditsIncluded: 300,
  },
  pro: {
    code: "pro",
    name: "Pro",
    monthlyVideoLimit: 120,
    monthlyCreditsIncluded: 1200,
  },
};

export function resolvePlan(code?: string | null): PlanConfig {
  if (!code) {
    return PLANS.free;
  }
  return PLANS[code] ?? PLANS.free;
}
