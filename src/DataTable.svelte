<script lang="ts">
  export let properties: {
    [prop: string]: any;
  };

  export let titles: {
    [prop: string]: string;
  } = {};
</script>

<div class="grid">
  {#each Object.entries(properties) as [key, value]}
    <div><slot name="key" {key}>{key}</slot></div>
    <div title={titles[key] || value}>
      <slot name="value" {key}>
        {value}
      </slot>
    </div>
  {/each}
</div>

<style>
  div.grid {
    display: grid;
    grid-template-columns: max-content auto;
    grid-gap: 4px;
    box-sizing: border-box;
    padding: 0.5em;
    border: 1px solid #69a;
    background-color: #0001;
    max-width: 100%;
    width: max-content;

    font-family: monospace;
  }
  div.grid > div {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 30em;
  }
</style>
