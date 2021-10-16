<script lang="ts">
  import DataTable from './DataTable.svelte';

  import Portals from './Portals.svelte';
  import Links from './Links.svelte';
  import Fields from './Fields.svelte';

  import { getTile, getTileTime, timestampToString } from './utils';


  export let tid: TileID = null;

  let tile: RequestTile = null;
  $: {
    if (tid)
    	tile = getTile(tid);
    else tile = null;
  }

  let properties = {}

  $: {
  	if (!tile) properties = {};
  	else {
  		const [zoom, x, y, minlvl, maxlvl, maxhealth] = tid.split("_");
  		properties = {
  			id: tid,
        time: timestampToString(getTileTime(tid)),
        zoom, x, y, minlvl, maxlvl, maxhealth
  		};
  	}
  }
</script>

<div>
  {#if tile}
    <h3>Tile</h3>
    <DataTable {properties} />

    <h3>Portals</h3>
    <Portals on:select tileID={tid} />

    <h3>Links</h3>
    <Links on:select tileID={tid} />

    <h3>Fields</h3>
    <Fields on:select tileID={tid} />
  {/if}
</div>
