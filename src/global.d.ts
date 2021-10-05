/// <reference types="svelte" />
/// <reference types="leaflet" />
/// <reference types="iitc" />

const L: typeof L;

const addCSSs: () => void;

type PortalID = string;
type LinkID = string;
type FieldID = string;

type IITCPortal = IITC.Portal;
type IITCLink = IITC.Link;
type IITCField = IITC.Field;
