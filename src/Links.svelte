<script lang="ts">
  import DataList from './DataList.svelte';

  import { links, tiles } from './stores';

  import { portalInLink, linkInField } from './utils';

  export let portalID: PortalGUID = null;
  export let activeID: LinkGUID | false = false;
  export let fieldID: FieldGUID = null;
  export let tileID: TileID = null;

  let linkList = [];
  $: {
    if (tileID) {
      const tile = $tiles[tileID];
      if (!tile) linkList = [];
      else linkList = tile.entities.filter((e) => e[0] == 'e').map((e) => e[1]);
      linkList = linkList.filter((a) => $links[a]);
    } else {
      linkList = Object.keys($links).filter(
        (guid) =>
          (!portalID || portalInLink(portalID, guid)) &&
          (!fieldID || linkInField(guid, fieldID))
      );
    }
    linkList.sort(
      (a, b) => $links[b].options.timestamp - $links[a].options.timestamp
    );
  }
</script>

<DataList
  type="link"
  items={linkList.map((guid) => [
    guid,
    $links[guid].options.timestamp,
    { team: $links[guid].options.data.team },
  ])}
  {activeID}
  on:select
/>
