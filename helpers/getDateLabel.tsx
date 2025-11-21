type DateLabelType = "start" | "due" | "completed";

export function getDateLabel(date: any, type: DateLabelType) {
  if (!date) return "";

  // Convert Firestore Timestamp → Date
  const d = date.toDate ? date.toDate() : new Date(date);

  const today = new Date();

  // Normalize times
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  const diffDays = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  // Prefix groups
  const prefixToday =
    type === "start" ? "Starts" : type === "due" ? "Due" : "Completed";

  const prefixPast =
    type === "start" ? "Started" : type === "due" ? "Was due" : "Completed";

  // --- SAME WEEK CHECK ---
  const todayDay = today.getDay(); // Sunday = 0
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - todayDay);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // ─── Today / Tomorrow / Yesterday ──────────────────────
  if (diffDays === 0) return `${prefixToday} today`;
  if (diffDays === 1) return `${prefixToday} tomorrow`;
  if (diffDays === -1) return `${prefixPast} yesterday`;

  // ─── Same week ───────────────────────────────────────────
  if (d >= weekStart && d <= weekEnd) {
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    return diffDays > 0
      ? `${prefixToday} on ${weekday}`
      : `${prefixPast} on ${weekday}`;
  }

  // ─── Outside this week → numeric date ───────────────────
  return d.toLocaleDateString("en-US"); // e.g., 11/20/25
}
