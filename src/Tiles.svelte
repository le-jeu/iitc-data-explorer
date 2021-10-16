<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { entityInTile, getTileList, getTileTime, timestampToString } from './utils';

  const dispatch = createEventDispatcher();

  export let portalID: PortalGUID = null;
  export let linkID: LinkGUID = null;
  export let fieldID: FieldGUID = null;
  export let activeID: TileID | false = false;

  let tileList = [];

  $: {
    tileList = getTileList().filter(
      (tid) =>
        (!portalID || entityInTile(portalID, tid)) &&
        (!linkID || entityInTile(linkID, tid)) &&
        (!fieldID || entityInTile(fieldID, tid))
    );
    tileList.sort(
      (a, b) => getTileTime(b) - getTileTime(a)
    );
  }

  function onClick(guid: FieldGUID) {
    dispatch('select', { type: 'tile', guid: guid });
  }
</script>

<div class="grid">
  {#each tileList as tid (tid)}
    <div class:active={tid == activeID} on:click={() => onClick(tid)}>
      {tid}
    </div>
    <div class:active={tid == activeID} class="date">
      {timestampToString(getTileTime(tid))}
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
