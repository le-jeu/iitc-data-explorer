<script lang="ts">
import { createEventDispatcher } from "svelte";

import { fields } from "./stores";

import { portalInField, linkInField, timestampToString } from "./utils";

const dispatch = createEventDispatcher();

export let portalID: PortalID = null;
export let linkID: LinkID = null;
export let activeID: FieldID | false = false;

let fieldList = [];

$: {
	fieldList = Object.keys($fields).filter((guid) => (!portalID || portalInField(portalID, guid)) && (!linkID || linkInField(linkID, guid)));
	fieldList.sort((a,b) => $fields[b].options.timestamp - $fields[a].options.timestamp);
}

function onClick(guid: FieldID) {
	dispatch('select', { type: 'field', guid: guid});
}

</script>

<div class="grid">
	{#each fieldList as guid (guid)}
		<div class:active={guid == activeID} on:click={() => onClick(guid)}>{guid}</div>
		<div class:active={guid == activeID} class="date">{timestampToString($fields[guid].options.timestamp)}</div>
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