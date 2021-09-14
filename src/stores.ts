import { writable } from 'svelte/store';

export const portals = writable({});
export const links = writable({});
export const fields = writable({});

export const selectedPortal = writable(null);