<script lang="ts">
  import { links } from './stores';

  import DataTable from './DataTable.svelte';

  import Portals from './Portals.svelte';
  import Fields from './Fields.svelte';

  import Tiles from './Tiles.svelte';

  import { timestampToString } from './utils';

  export let guid: LinkGUID = null;

  let link: IITC.Link = null;
  $: {
    if (guid && $links[guid]) {
      link = $links[guid];
    } else {
      link = null;
    }
  }

  $: properties = !link
    ? {}
    : {
        guid: link.options.guid,
        timestamp: timestampToString(link.options.timestamp),
        team: link.options.team,
        oGuid: link.options.data.oGuid,
        oLatE6: link.options.data.oLatE6,
        oLngE6: link.options.data.oLngE6,
        dGuid: link.options.data.dGuid,
        dLatE6: link.options.data.dLatE6,
        dLngE6: link.options.data.dLngE6,
      };
</script>

<div>
  {#if link}
    <h3>Link</h3>
    <DataTable {properties} />

    <h3>Portals</h3>
    <Portals on:select linkID={guid} />

    <h3>Fields</h3>
    <Fields on:select linkID={guid} />

    <h3>Tiles</h3>
    <Tiles on:select linkID={guid} />
  {/if}
</div>
