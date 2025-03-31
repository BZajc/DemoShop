export function isUserOnline(lastSeenAt: Date | string | null | undefined): boolean {
    if (!lastSeenAt) return false;
  
    const lastSeen = new Date(lastSeenAt).getTime();
    const now = Date.now();
  
    return now - lastSeen < 60_000;
  }
  