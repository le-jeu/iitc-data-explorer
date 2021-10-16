<script lang="ts">
  import { onDestroy } from 'svelte';

  import DataList from './DataList.svelte';

  import { tiles } from './stores';

  import { tileIDToTileParam } from './utils';

  export let portalID: PortalGUID = null;
  export let linkID: LinkGUID = null;
  export let fieldID: FieldGUID = null;
  export let activeID: TileID | false = false;

  let tileList = [];

  $: {
    tileList = Object.keys($tiles).filter(
      (tid) =>
        (!portalID || $tiles[tid].entities.some((e) => e[1] == portalID)) &&
        (!linkID || $tiles[tid].entities.some((e) => e[1] == linkID)) &&
        (!fieldID || $tiles[tid].entities.some((e) => e[1] == fieldID))
    );
    tileList.sort((a, b) => $tiles[b].time - $tiles[a].time);
  }

  let tilesPolygon = window.L.layerGroup().addTo(window.map);
  $: {
    tilesPolygon.clearLayers();
    if (portalID || linkID || fieldID) {
      const maxTilesPerEdge =
        window.TILE_PARAMS.TILES_PER_EDGE[
          window.TILE_PARAMS.TILES_PER_EDGE.length - 1
        ];
      for (const tid of tileList) {
        const tileParam = tileIDToTileParam(tid);
        const params = {
          tilesPerEdge:
            window.TILE_PARAMS.TILES_PER_EDGE[tileParam.zoom] ||
            maxTilesPerEdge,
        } as MapZoomTileParameters;

        const latNorth = tileToLat(tileParam.y, params);
        const latSouth = tileToLat(tileParam.y + 1, params);
        const lngWest = tileToLng(tileParam.x, params);
        const lngEast = tileToLng(tileParam.x + 1, params);
        window.L.rectangle(
          [
            [latSouth, lngWest],
            [latNorth, lngEast],
          ],
          { color: 'purple', interactive: false }
        ).addTo(tilesPolygon);
      }
    }
  }

  onDestroy(() => {
    tilesPolygon.remove();
  });
</script>

<DataList
  type="tile"
  items={tileList.map((guid) => [guid, $tiles[guid].time, false])}
  {activeID}
  on:select
/>
