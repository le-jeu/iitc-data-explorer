export function portalInField(pid: LinkGUID, fid: FieldGUID) {
  if (!window.fields[fid]) return false;
  return window.fields[fid].options.data.points.some((d) => d.guid == pid);
}

export function portalInLink(pid: PortalGUID, lid: LinkGUID) {
  if (!window.links[lid]) return false;
  return (
    window.links[lid].options.data.oGuid == pid ||
    window.links[lid].options.data.dGuid == pid
  );
}

export function linkInField(lid: LinkGUID, fid: FieldGUID) {
  const link = window.links[lid];
  if (!link) return false;
  return (
    portalInField(link.options.data.oGuid, fid) &&
    portalInField(link.options.data.dGuid, fid)
  );
}

export function timestampToString(t: number) {
  const d = new Date(t);
  const year = d.getUTCFullYear() + '';
  const month = d.getUTCMonth() + 1 + '';
  const day = d.getUTCDate() + '';
  const hour = d.getUTCHours() + '';
  const minute = d.getUTCMinutes() + '';
  const second = d.getUTCSeconds() + '';
  const milli = d.getUTCMilliseconds() + '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(
    2,
    '0'
  )}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(
    2,
    '0'
  )}.${milli.padStart(3, '0')}Z`;
}

export function getTileList(): TileID[] {
  const cache = (window.mapDataRequest.cache as DataCache)._cache;
  return Object.keys(cache);
}

export function getTile(tid: TileID) {
  const cache = (window.mapDataRequest.cache as DataCache)._cache;
  if (tid in cache) return JSON.parse(cache[tid].dataStr) as RequestTile;
  return null;
}

export function getTileTime(tid: TileID) {
  const cache = (window.mapDataRequest.cache as DataCache)._cache;
  if (tid in cache) return cache[tid].time;
  return 0;
}

export function entityInTile(thingid: PortalGUID | LinkGUID | FieldGUID, tid: TileID) {
  const tile = getTile(tid);
  if (!tile) return;
  return tile.gameEntities.some((e) => e[0] == thingid);
}
