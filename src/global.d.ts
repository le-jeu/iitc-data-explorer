/// <reference types="svelte" />
/// <reference types="iitc" />

import type * as iitc from './types/iitc';

declare global {
  const addCSSs: () => void;

  type PortalGUID = iitc.PortalGUID;
  type LinkGUID = iitc.LinkGUID;
  type FieldGUID = iitc.FieldGUID;

  // expose globally subset of IITC namespace
  namespace IITC {
    type Portal = iitc.IITC.Portal;
    type Link = iitc.IITC.Link;
    type Field = iitc.IITC.Field;
  }
}
