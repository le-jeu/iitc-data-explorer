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

export function tileIDToTileParam(tid: TileID) {
  const [zoom, x, y, minlvl, maxlvl, maxhealth] = tid.split('_');
  const maxTilesPerEdge =
    window.TILE_PARAMS.TILES_PER_EDGE[
      window.TILE_PARAMS.TILES_PER_EDGE.length - 1
    ];
  const params = {
    tilesPerEdge: window.TILE_PARAMS.TILES_PER_EDGE[+zoom] || maxTilesPerEdge,
  } as MapZoomTileParameters;
  const latNorth = window.tileToLat(+y, params);
  const latSouth = window.tileToLat(+y + 1, params);
  const lngWest = window.tileToLng(+x, params);
  const lngEast = window.tileToLng(+x + 1, params);
  return {
    zoom: +zoom,
    x: +x,
    y: +y,
    minlvl: +minlvl,
    maxlvl: +maxlvl,
    maxhealth: +maxhealth,
    latNorth,
    lngWest,
    latSouth,
    lngEast,
  };
}

export function coveredS2CellsByTile(tid: TileID) {
  if (!window.S2) return [];
  const s2Map = [4, 4, 4, 4, 4, 5, 5, 7, 9, 10, 10, 11, 13, 13, 13, 14];
  const param = tileIDToTileParam(tid);
  const r = {};
  for (let i = 3; i <= param.zoom && i <= 15; i++) {
    const z = s2Map[i];
    if (z in r) continue;
    const ss = [
      S2.S2Cell.FromLatLng(window.L.latLng([param.latNorth, param.lngWest]), z),
      S2.S2Cell.FromLatLng(window.L.latLng([param.latNorth, param.lngEast]), z),
      S2.S2Cell.FromLatLng(window.L.latLng([param.latSouth, param.lngWest]), z),
      S2.S2Cell.FromLatLng(window.L.latLng([param.latSouth, param.lngEast]), z),
    ];
    r[z] = {
      [ss[0].toString()]: ss[0],
      [ss[1].toString()]: ss[1],
      [ss[2].toString()]: ss[2],
      [ss[3].toString()]: ss[3],
    };
  }
  const ret: S2.S2Cell[] = [];
  for (const z in r) for (const key in r[z]) ret.push(r[z][key]);

  return ret;
}
