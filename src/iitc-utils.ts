export function chatJumpToDate(timestamp: number) {
  if (Date.now() - timestamp > 31 * 24 * 3600 * 1000) return;
  const all = window.chat._public;
  all.data = {};
  all.guids = [];
  all.oldestTimestamp = timestamp + 1000;
  all.newestTimestamp = timestamp - 1000;
  delete all.oldestGUID;
  delete all.newestGUID;
  window.chat.requestPublic(true, false);
}
