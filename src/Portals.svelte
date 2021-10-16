<script lang="ts">
  import DataList from './DataList.svelte';

  import { portals, selectedPortal, tiles } from './stores';

  export let activeID: PortalGUID | false = false;
  export let linkID: LinkGUID = null;
  export let fieldID: FieldGUID = null;
  export let tileID: TileID = null;

  let portalList = [];
  $: {
    if (linkID) {
      const link = window.links[linkID];
      if (!link) portalList = [];
      else portalList = [link.options.data.oGuid, link.options.data.dGuid];
    } else if (fieldID) {
      const field = window.fields[fieldID];
      if (!field) portalList = [];
      else portalList = field.options.data.points.map((p) => p.guid);
    } else if (tileID) {
      const tile = $tiles[tileID];
      if (!tile) portalList = [];
      else
        portalList = tile.entities.filter((e) => e[0] == 'p').map((e) => e[1]);
      portalList = portalList.filter((a) => $portals[a]);
    } else {
      portalList = Object.keys($portals);
      portalList.sort(
        (a, b) => $portals[b].options.timestamp - $portals[a].options.timestamp
      );
    }
  }
</script>

<DataList
  type="portal"
  items={portalList.map((guid) => [
    guid,
    $portals[guid].options.timestamp,
    $portals[guid].options.data.title,
  ])}
  selectedID={$selectedPortal}
  {activeID}
  on:select
/>
