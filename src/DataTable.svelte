<script lang="ts">
  export let properties: {
    [prop: string]: any;
  } = {};
</script>

<div class="grid">
  {#each Object.entries(properties) as [key, value]}
    <slot name="key" {key}><div>{key}</div></slot>
    <slot name="value" {key}>
      <div title={value}>{value}</div>
    </slot>
  {/each}
</div>

<style type="text/css">
  .grid {
    display: grid;
    grid-template-columns: max-content auto;
    grid-gap: 4px;
    font-family: monospace;
  }
  .grid > :global(div) {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 30em;
  }
</style>
