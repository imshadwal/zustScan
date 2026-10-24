export type ClientGuestMetric = "page_view" | "copy_continue";

export function trackGuestMetric(loginId: string, metric: ClientGuestMetric) {
  const id = loginId.trim().toLowerCase();
  if (!id) return;

  void fetch("/api/guest/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId: id, event: metric }),
    keepalive: true,
  }).catch(() => {
    /* ignore */
  });
}
