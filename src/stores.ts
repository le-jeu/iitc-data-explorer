import { writable } from 'svelte/store';

export const portals = writable<typeof window.portals>({});
export const links = writable<typeof window.links>({});
export const fields = writable<typeof window.fields>({});
export const tiles = writable<{ [tid: TileID]: TileInfo }>({});

export const selectedPortal = writable(null);
