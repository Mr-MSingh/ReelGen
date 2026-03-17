export function isWithinMonthlyVideoLimit(
  usedCount: number,
  monthlyLimit: number
) {
  if (monthlyLimit <= 0) {
    return false;
  }
  return usedCount < monthlyLimit;
}
