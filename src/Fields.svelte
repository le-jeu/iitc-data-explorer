<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { fields, tiles } from './stores';

  import { portalInField, linkInField, timestampToString } from './utils';

  const dispatch = createEventDispatcher();

  export let portalID: PortalGUID = null;
  export let linkID: LinkGUID = null;
  export let activeID: FieldGUID | false = false;
  export let tileID: TileID = null;

  let fieldList = [];
  $: {
    if (tileID) {
      const tile = $tiles[tileID];
      if (!tile) fieldList = [];
      else
        fieldList = tile.entities.filter((e) => e[0] == 'r').map((e) => e[1]);
      fieldList = fieldList.filter((a) => $fields[a]);
    } else {
      fieldList = Object.keys($fields).filter(
        (guid) =>
          (!portalID || portalInField(portalID, guid)) &&
          (!linkID || linkInField(linkID, guid))
      );
    }
    fieldList.sort(
      (a, b) => $fields[b].options.timestamp - $fields[a].options.timestamp
    );
  }

  function onClick(guid: FieldGUID) {
    dispatch('select', { type: 'field', guid: guid });
  }
</script>

<div class="grid">
  {#each fieldList as guid (guid)}
    <div class:active={guid == activeID} on:click={() => onClick(guid)}>
      {guid}
    </div>
    <div class:active={guid == activeID} class="date">
      {timestampToString($fields[guid].options.timestamp)}
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
