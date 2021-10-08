<script lang="ts">
export let properties: string[] = [];

</script>
<div class="grid">
	{#each properties as key}
		<slot name="key" {key}><div></div></slot>
		<slot name="value" {key}><div></div></slot>
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