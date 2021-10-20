/// <reference types="svelte" />

import type * as iitc from './types/iitc';

import { LatLng } from 'leaflet';

declare global {
  const addCSSs: () => void;

  type PortalGUID = iitc.PortalGUID;
  type LinkGUID = iitc.LinkGUID;
  type FieldGUID = iitc.FieldGUID;

  type TileID = string;

  // expose globally subset of IITC namespace
  namespace IITC {
    type Portal = iitc.IITC.Portal;
    type Link = iitc.IITC.Link;
    type Field = iitc.IITC.Field;
  }

  namespace S2 {
    type Face = 0 | 1 | 2 | 3 | 4 | 5;
    type IJ = [number, number];
    type Quad = 0 | 1 | 2 | 3;
    class S2Cell {
      face: Face;
      ij: IJ;
      level: number;
      static FromLatLng(latLng: LatLng, level: number): S2Cell;
      static FromFaceIJ(face: Face, ij: IJ, level: number): S2Cell;
      toString(): string;
      getLatLng(): LatLng;
      getCornerLatLngs(): [LatLng, LatLng, LatLng, LatLng];
      getFaceAndQuads(): [Face, Quad[]];
      getNeighbors(): [S2Cell, S2Cell, S2Cell, S2Cell];
    }
  }

  var MapDataRequest: typeof iitc.MapDataRequest;

  interface DataCache extends iitc.DataCache {
    _cache: {
      [key: string]: {
        time: number;
        expire: number;
        dataStr: string;
      };
    };
  }

  type IntelGameEntity =
    | iitc.Intel.PortalDetails
    | iitc.Intel.LinkDetails
    | iitc.Intel.FieldDetails;

  interface RequestTile {
    gameEntities: IntelGameEntity[];
  }

  interface TileInfo {
    time: number;
    entities: (['p', PortalGUID] | ['e', LinkGUID] | ['r', FieldGUID])[];
  }
}
