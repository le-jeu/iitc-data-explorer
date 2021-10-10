<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { portals, selectedPortal } from './stores';

  import { timestampToString } from './utils';

  const dispath = createEventDispatcher();

  export let activeID: PortalGUID | false = false;
  export let linkID: LinkGUID = null;
  export let fieldID: FieldGUID = null;

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
    } else {
      portalList = Object.keys($portals);
      portalList.sort(
        (a, b) => $portals[b].options.timestamp - $portals[a].options.timestamp
      );
    }
  }

  function onClick(guid: PortalGUID) {
    dispath('select', { type: 'portal', guid: guid });
  }
</script>

<div class="grid">
  {#each portalList as guid (guid)}
    <div
      class:selected={guid == $selectedPortal}
      class:active={guid == activeID}
      class:raw={!$portals[guid].options.data.title}
      title={guid}
      on:click={() => onClick(guid)}
    >
      {$portals[guid].options.data.title || guid}
    </div>
    <div
      class:selected={guid == $selectedPortal}
      class:active={guid == activeID}
      class="raw date"
    >
      {timestampToString($portals[guid].options.timestamp)}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: 4px;
  }

  .grid div:nth-child(2n + 1) {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .grid div {
    white-space: nowrap;
    max-width: 30em;
  }

  .grid div.raw {
    font-family: monospace;
  }

  .date {
    margin-left: auto;
  }

  .selected {
    color: red;
  }

  .active {
    color: green;
  }
</style>
