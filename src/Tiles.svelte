<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  import { tiles } from './stores';

  import { tileIDToTileParam, timestampToString } from './utils';

  const dispatch = createEventDispatcher();

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

  function onClick(guid: FieldGUID) {
    dispatch('select', { type: 'tile', guid: guid });
  }

  onDestroy(() => {
    tilesPolygon.remove();
  });
</script>

<div class="grid">
  {#each tileList as tid (tid)}
    <div class:active={tid == activeID} on:click={() => onClick(tid)}>
      {tid}
    </div>
    <div class:active={tid == activeID} class="date">
      {timestampToString($tiles[tid].time)}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: 4px;
    font-family: monospace;
  }

  .grid div {
    white-space: nowrap;
    max-width: 30em;
  }

  .date {
    margin-left: auto;
  }

  .active {
    color: green;
  }
</style>
