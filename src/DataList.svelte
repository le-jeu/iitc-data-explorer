<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { timestampToString } from './utils';
  import { chatJumpToDate } from './iitc-utils';

  const dispath = createEventDispatcher();

  export let items: [
    PortalGUID | LinkGUID | FieldGUID | TileID,
    number,
    string | false
  ][];
  export let activeID: string | false;
  export let selectedID: string = null;
  export let type: 'portal' | 'link' | 'field' | 'tile';

  function onClick(guid: PortalGUID | LinkGUID | FieldGUID | TileID) {
    dispath('select', { type: type, guid: guid });
  }
</script>

<div class="grid">
  {#each items as item}
    <div
      class="guid"
      class:raw={!item[2]}
      class:selected={selectedID == item[0]}
      class:active={activeID == item[0]}
      on:click={() => onClick(item[0])}
    >
      {item[2] || item[0]}
    </div>
    <div
      class="date raw"
      class:selected={selectedID == item[0]}
      class:active={activeID == item[0]}
      on:dblclick={() => chatJumpToDate(item[1])}
    >
      {timestampToString(item[1])}
    </div>
  {/each}
</div>

<style type="text/css">
  .grid {
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: 4px;
    box-sizing: border-box;
    padding: 0.5em;
    border: 1px solid #69a;
    background-color: #0001;
    max-width: 100%;
    width: max-content;
  }

  .grid div {
    white-space: nowrap;
    max-width: 30em;
  }

  .grid div:nth-child(2n + 1) {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .raw {
    font-family: monospace;
  }

  .grid .guid {
    cursor: pointer;
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
