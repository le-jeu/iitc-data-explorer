/// <reference types="svelte" />
/// <reference types="iitc" />

import type * as iitc from './types/iitc';

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

  interface DataCache extends iitc.DataCache {
    _cache: {
      [key: string]: {
        time: number, expire: number, dataStr: string
      }
    };
  }

  type IntelGameEntity = iitc.Intel.PortalDetails | iitc.Intel.LinkDetails | iitc.Intel.FieldDetails;

  interface RequestTile {
    gameEntities: IntelGameEntity[];
  }
}


