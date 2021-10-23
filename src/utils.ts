import * as S2 from './s2';

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

export function coveredS2CellsByLink(linkid: LinkGUID) {
  const link = window.links[linkid];
  if (!link) return [];
  const lls = link.getLatLngs();
  const length = window.map.distance(lls[0], lls[1]);

  const s2Dist: [number, number][] = [
    [300, 14],
    [800, 13],
    [2500, 11],
    [5000, 10],
    [10000, 9],
    [60000, 7],
    [200000, 5],
    [12000000, 4],
  ];
  const s2Level = s2Dist.find((p) => p[0] > length)[1];
  const covering = new S2.S2RegionCover();
  return covering.getCovering(
    new S2.S2Polyline(lls.map(S2.LatLngToXYZ)),
    s2Level
  );
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
  const param = tileIDToTileParam(tid);
  const bounds = window.L.latLngBounds(
    [param.latSouth, param.lngWest],
    [param.latNorth, param.lngEast]
  ).pad(0.01);
  const s2Map = [4, 4, 4, 4, 4, 5, 5, 7, 9, 10, 10, 11, 13, 13, 13, 14];
  const r = {};
  for (let i = 3; i <= param.zoom && i <= 15; i++) {
    const z = s2Map[i];
    if (z in r) continue;
    const ss = [
      S2.S2Cell.FromLatLng(bounds.getSouthEast(), z),
      S2.S2Cell.FromLatLng(bounds.getSouthWest(), z),
      S2.S2Cell.FromLatLng(bounds.getNorthEast(), z),
      S2.S2Cell.FromLatLng(bounds.getNorthWest(), z),
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

  // dfs on s2 tiles
  const toTest: S2.S2Cell[] = [];
  const seen: { [key: string]: boolean } = {};
  for (const s2 of ret) {
    seen[s2.toString()] = true;
    toTest.push(s2);
  }

  while (toTest.length) {
    const s = toTest.pop();
    for (const n2 of s.getNeighbors()) {
      if (n2.toString() in seen) continue;
      seen[n2.toString()] = true;
      const corners = n2.getCornerLatLngs();
      if (corners.some((ll) => bounds.contains(ll))) {
        ret.push(n2);
        toTest.push(n2);
      }
    }
  }

  return ret;
}
