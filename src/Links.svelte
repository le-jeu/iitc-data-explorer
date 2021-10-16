<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { links } from './stores';

  import { getTile, portalInLink, linkInField, timestampToString } from './utils';

  const dispatch = createEventDispatcher();

  export let portalID: PortalGUID = null;
  export let activeID: LinkGUID | false = false;
  export let fieldID: FieldGUID = null;
  export let tileID: TileID = null;

  let linkList = [];
  $: {
    if (tileID) {
      const tile = getTile(tileID);
      if (!tile) linkList = [];
      else linkList = tile.gameEntities.filter((e) => e[2][0] == 'e').map((p) => p[0]);
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

  function onClick(guid: LinkGUID) {
    dispatch('select', { type: 'link', guid: guid });
  }
</script>

<div class="grid">
  {#each linkList as guid (guid)}
    <div
      class:active={guid == activeID}
      class="raw"
      on:click={() => onClick(guid)}
    >
      {guid}
    </div>
    <div class:active={guid == activeID} class="raw date">
      {timestampToString($links[guid].options.timestamp)}
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
