export type RiskResult = {
  score: number;
  level: "Low" | "Medium" | "High";
  status: "Safe" | "Suspicious" | "Blocked";
  reasons: string[];
};

type Input = {
  amount: number;
  country: string;
  paymentMethod: string;
  accountAgeDays?: number;
  previousCountry?: string;
  rapidTransactions?: number;
};

export function scoreTransaction(input: Input): RiskResult {
  let score = 8;
  const reasons: string[] = [];

  if (input.amount >= 100000) {
    score += 42;
    reasons.push("High-value transaction");
  } else if (input.amount >= 50000) {
    score += 22;
    reasons.push("Unusually large amount");
  }

  if (["UAE", "Singapore", "USA"].includes(input.country)) {
    score += 12;
    reasons.push("International transaction");
  }

  if (input.paymentMethod === "Wallet") {
    score += 7;
    reasons.push("Wallet payment requires additional monitoring");
  }

  if ((input.accountAgeDays ?? 365) < 30) {
    score += 18;
    reasons.push("New customer account");
  }

  if ((input.rapidTransactions ?? 0) >= 4) {
    score += 20;
    reasons.push("Multiple transactions in a short period");
  }

  if (input.previousCountry && input.previousCountry !== input.country) {
    score += 15;
    reasons.push("Country change detected");
  }

  score = Math.min(score, 100);
  const level = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
  const status = score >= 85 ? "Blocked" : score >= 40 ? "Suspicious" : "Safe";

  if (!reasons.length) reasons.push("Normal transaction behaviour");
  return { score, level, status, reasons };
}
