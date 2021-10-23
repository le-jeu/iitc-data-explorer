# Data explorer for IITC

## Install

Last build: [dataExplorer.user.js](https://github.com/le-jeu/iitc-data-explorer/raw/dist/dataExplorer.user.js)

## Features

 - List of loaded portal, link and field entities.
 - Details of a portal/link/field entity
   - own properties
   - lists of portals/links/fields related to the selected entity
   - list of tiles that contains the entity and highlight those tiles (keep track of tiles loaded in the last 5min)
   - highlight S2 cells [IITC-CE/wiki/Intel-Data#tiles](https://github.com/IITC-CE/ingress-intel-total-conversion/wiki/Intel-Data#tiles)
     - link: cells of relevant level (wtr to the link length)
     - tiles: cells that match tile level and tile content
 - List of a tile (intel) content

![coveringTilesS2](https://github.com/le-jeu/iitc-data-explorer/raw/master/doc/sample_link_tiles_s2.png)

The link is about 3401km long.
The relevant S2 level is 4.
Any 4-level S2 cells containing the link is highlighted.

After scrolling the map at level 4,5 and 7, all tiles of level 4/5/7 that contains the link data are highlighted and match the frontier of the set of S2 cells.
In other word, any tile that does not intersect the S2 cells does not contains the link data.

## Build

Install the dependencies...

```bash
npm install
```

then build

```bash
npm run dev
# or
npm run build
```

## Note

This is a project from the template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.
