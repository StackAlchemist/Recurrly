import dayjs from "dayjs";

type ClerkUserNameFields = {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export const isDevEnvironment = process.env.NODE_ENV === "development";

export function logAuthDebug(message: string): void {
  if (isDevEnvironment) console.log(message);
}

export function logAuthError(message: string, detail?: unknown): void {
  if (isDevEnvironment && detail !== undefined) {
    console.error(message, detail);
  } else {
    console.error(message);
  }
}

export const getUserDisplayName = (
  user: ClerkUserNameFields | null | undefined,
): string | undefined => {
  if (!user) return undefined;

  const trimmedFull = user.fullName?.trim();
  const trimmedJoined = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const trimmedFirst = user.firstName?.trim();

  return trimmedFull || trimmedJoined || trimmedFirst || undefined;
};

export const formatJoinedDate = (value?: Date | number | null): string => {
  if (value == null) return "—";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMMM D, YYYY") : "—";
};

export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};