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
      for (const tid of tileList) {
        const param = tileIDToTileParam(tid);
        window.L.rectangle(
          [
            [param.latSouth, param.lngWest],
            [param.latNorth, param.lngEast],
          ],
          { color: 'purple' }
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
