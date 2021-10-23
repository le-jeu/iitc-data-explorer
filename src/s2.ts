type Face = number;
type LatLng = { lat: number; lng: number };
type XYZ = [number, number, number];
type UV = [number, number];
type ST = [number, number];
type IJ = [number, number];
type Level = number;

export function LatLngToXYZ(latLng: LatLng): XYZ {
  const d2r = Math.PI / 180.0;

  const phi = latLng.lat * d2r;
  const theta = latLng.lng * d2r;

  const cosphi = Math.cos(phi);

  return [Math.cos(theta) * cosphi, Math.sin(theta) * cosphi, Math.sin(phi)];
}

export function XYZToLatLng(xyz: XYZ): LatLng {
  const r2d = 180.0 / Math.PI;

  const lat = Math.atan2(xyz[2], Math.sqrt(xyz[0] * xyz[0] + xyz[1] * xyz[1]));
  const lng = Math.atan2(xyz[1], xyz[0]);

  return { lat: lat * r2d, lng: lng * r2d };
}

function largestAbsComponent(xyz: XYZ) {
  const temp = [Math.abs(xyz[0]), Math.abs(xyz[1]), Math.abs(xyz[2])];

  if (temp[0] > temp[1]) {
    if (temp[0] > temp[2]) {
      return 0;
    } else {
      return 2;
    }
  } else {
    if (temp[1] > temp[2]) {
      return 1;
    } else {
      return 2;
    }
  }
}

function faceXYZToUV(face: Face, xyz: XYZ): UV {
  let u: number, v: number;

  switch (face) {
    case 0:
      u = xyz[1] / xyz[0];
      v = xyz[2] / xyz[0];
      break;
    case 1:
      u = -xyz[0] / xyz[1];
      v = xyz[2] / xyz[1];
      break;
    case 2:
      u = -xyz[0] / xyz[2];
      v = -xyz[1] / xyz[2];
      break;
    case 3:
      u = xyz[2] / xyz[0];
      v = xyz[1] / xyz[0];
      break;
    case 4:
      u = xyz[2] / xyz[1];
      v = -xyz[0] / xyz[1];
      break;
    case 5:
      u = -xyz[1] / xyz[2];
      v = -xyz[0] / xyz[2];
      break;
    default:
      throw { error: 'Invalid face' };
  }

  return [u, v];
}

function XYZToFaceUV(xyz: XYZ): [Face, UV] {
  let face = largestAbsComponent(xyz);

  if (xyz[face] < 0) {
    face += 3;
  }

  const uv = faceXYZToUV(face, xyz);

  return [face, uv];
}

function FaceUVToXYZ(face: Face, uv: UV): XYZ {
  const u = uv[0];
  const v = uv[1];

  switch (face) {
    case 0:
      return [1, u, v];
    case 1:
      return [-u, 1, v];
    case 2:
      return [-u, -v, 1];
    case 3:
      return [-1, -v, -u];
    case 4:
      return [v, -1, -u];
    case 5:
      return [v, u, -1];
    default:
      throw { error: 'Invalid face' };
  }
}

function STToUV(st: ST): UV {
  function quadSTtoUV(st: number) {
    if (st >= 0.5) {
      return (1 / 3.0) * (4 * st * st - 1);
    } else {
      return (1 / 3.0) * (1 - 4 * (1 - st) * (1 - st));
    }
  }

  return [quadSTtoUV(st[0]), quadSTtoUV(st[1])];
}

function UVToST(uv: UV): ST {
  function quadUVtoST(uv: number) {
    if (uv >= 0) {
      return 0.5 * Math.sqrt(1 + 3 * uv);
    } else {
      return 1 - 0.5 * Math.sqrt(1 - 3 * uv);
    }
  }

  return [quadUVtoST(uv[0]), quadUVtoST(uv[1])];
}

function STToIJ(st: ST, order: Level): IJ {
  const maxSize = 1 << order;

  function singleSTtoIJ(st: number) {
    const ij = Math.floor(st * maxSize);
    return Math.max(0, Math.min(maxSize - 1, ij));
  }

  return [singleSTtoIJ(st[0]), singleSTtoIJ(st[1])];
}

function IJToST(ij: IJ, order: Level, offsets: IJ): ST {
  const maxSize = 1 << order;

  return [(ij[0] + offsets[0]) / maxSize, (ij[1] + offsets[1]) / maxSize];
}

// hilbert space-filling curve
// based on http://blog.notdot.net/2009/11/Damn-Cool-Algorithms-Spatial-indexing-with-Quadtrees-and-Hilbert-Curves
// note: rather then calculating the final integer hilbert position, we just return the list of quads
// this ensures no precision issues whth large orders (S3 cell IDs use up to 30), and is more
// convenient for pulling out the individual bits as needed later
function pointToHilbertQuadList(x: number, y: number, order: Level) {
  const hilbertMap = {
    a: [
      [0, 'd'],
      [1, 'a'],
      [3, 'b'],
      [2, 'a'],
    ],
    b: [
      [2, 'b'],
      [1, 'b'],
      [3, 'a'],
      [0, 'c'],
    ],
    c: [
      [2, 'c'],
      [3, 'd'],
      [1, 'c'],
      [0, 'b'],
    ],
    d: [
      [0, 'a'],
      [3, 'c'],
      [1, 'd'],
      [2, 'd'],
    ],
  };

  let currentSquare = 'a';
  const positions = [];

  for (let i = order - 1; i >= 0; i--) {
    const mask = 1 << i;

    const quad_x = x & mask ? 1 : 0;
    const quad_y = y & mask ? 1 : 0;

    const t = hilbertMap[currentSquare][quad_x * 2 + quad_y];

    positions.push(t[0]);

    currentSquare = t[1];
  }

  return positions;
}

function cross(a: XYZ, b: XYZ): XYZ {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a: XYZ, b: XYZ) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function simple_crossing(a: XYZ, b: XYZ, c: XYZ, d: XYZ) {
  const ab = cross(a, b);
  const acb = -dot(ab, c);
  const bda = dot(ab, d);
  if (acb * bda <= 0) return false;

  const cd = cross(c, d);
  const cbd = -dot(cd, b);
  const dac = dot(cd, a);
  return acb * cbd > 0 && acb * dac > 0;
}

interface S2Region {}

export class S2Polyline implements S2Region {
  points: XYZ[];

  constructor(points?: XYZ[]) {
    this.points = points || [];
  }

  empty() {
    return this.points.length == 0;
  }
}

export class S2RegionCover {
  region: S2Polyline;
  level: number;

  getCoveringPoint(point: XYZ) {
    const [face, uv] = XYZToFaceUV(point);
    const st = UVToST(uv);
    const ij = STToIJ(st, this.level);
    return S2Cell.FromFaceIJ(face, ij, this.level);
  }

  getCoveringLine(a: XYZ, b: XYZ): S2Cell[] {
    const ret: S2Cell[] = [];
    const start = this.getCoveringPoint(a);
    const frontier = {};
    const stack = [start];
    while (stack.length) {
      const s = stack.pop();
      if (s.toString() in frontier) continue;
      frontier[s.toString()] = true;

      const corners = s.getCornerXYZ();

      if (
        corners.some((p, i) => simple_crossing(a, b, p, corners[(i + 1) % 4]))
      ) {
        ret.push(s);
        for (const ns of s.getNeighbors()) {
          stack.push(ns);
        }
      }
    }
    return ret;
  }

  getCovering(region: S2Polyline, level: Level): S2Cell[] {
    this.region = region;
    this.level = level;
    if (this.region.empty()) return [];

    const ret: { [id: string]: S2Cell } = {};
    for (const xyz of this.region.points) {
      const s = this.getCoveringPoint(xyz);
      ret[s.toString()] = s;
    }

    for (let i = this.region.points.length - 1; i > 0; i--) {
      const covering = this.getCoveringLine(
        this.region.points[i],
        this.region.points[i - 1]
      );
      for (const key in covering) ret[key] = covering[key];
    }
    return Object.values(ret);
  }
}

// S2Cell class
export class S2Cell {
  face: Face;
  ij: IJ;
  level: Level;

  //static method to construct
  static FromLatLng(latLng: LatLng, level: Level) {
    const xyz = LatLngToXYZ(latLng);

    const faceuv = XYZToFaceUV(xyz);
    const st = UVToST(faceuv[1]);

    const ij = STToIJ(st, level);

    return S2Cell.FromFaceIJ(faceuv[0], ij, level);
  }

  static FromFaceIJ(face: Face, ij: IJ, level: Level) {
    const cell = new S2Cell();
    cell.face = face;
    cell.ij = ij;
    cell.level = level;

    return cell;
  }

  toString() {
    return (
      'F' +
      this.face +
      'ij[' +
      this.ij[0] +
      ',' +
      this.ij[1] +
      ']@' +
      this.level
    );
  }

  getLatLng() {
    const st = IJToST(this.ij, this.level, [0.5, 0.5]);
    const uv = STToUV(st);
    const xyz = FaceUVToXYZ(this.face, uv);

    return XYZToLatLng(xyz);
  }

  getCornerXYZ(): XYZ[] {
    const result: XYZ[] = [];
    const offsets: IJ[] = [
      [0.0, 0.0],
      [0.0, 1.0],
      [1.0, 1.0],
      [1.0, 0.0],
    ];

    for (let i = 0; i < 4; i++) {
      const st = IJToST(this.ij, this.level, offsets[i]);
      const uv = STToUV(st);
      result.push(FaceUVToXYZ(this.face, uv));
    }
    return result;
  }

  getCornerLatLngs() {
    return this.getCornerXYZ().map(XYZToLatLng);
  }

  getFaceAndQuads() {
    const quads = pointToHilbertQuadList(this.ij[0], this.ij[1], this.level);

    return [this.face, quads];
  }

  getNeighbors() {
    function fromFaceIJWrap(face: Face, ij: IJ, level: Level) {
      const maxSize = 1 << level;
      if (ij[0] >= 0 && ij[1] >= 0 && ij[0] < maxSize && ij[1] < maxSize) {
        // no wrapping out of bounds
        return S2Cell.FromFaceIJ(face, ij, level);
      } else {
        // the new i,j are out of range.
        // with the assumption that they're only a little past the borders we can just take the points as
        // just beyond the cube face, project to XYZ, then re-create FaceUV from the XYZ vector

        let st = IJToST(ij, level, [0.5, 0.5]);
        let uv = STToUV(st);
        const xyz = FaceUVToXYZ(face, uv);
        const faceuv = XYZToFaceUV(xyz);
        face = faceuv[0];
        uv = faceuv[1];
        st = UVToST(uv);
        ij = STToIJ(st, level);
        return S2Cell.FromFaceIJ(face, ij, level);
      }
    }

    const face = this.face;
    const i = this.ij[0];
    const j = this.ij[1];
    const level = this.level;

    return [
      fromFaceIJWrap(face, [i - 1, j], level),
      fromFaceIJWrap(face, [i, j - 1], level),
      fromFaceIJWrap(face, [i + 1, j], level),
      fromFaceIJWrap(face, [i, j + 1], level),
    ];
  }
}
