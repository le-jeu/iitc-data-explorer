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

<table>
	{#each fieldList as guid (guid)}
	<tr class:active={guid == activeID}>
		<td class="raw" on:click={() => onClick(guid)}>{guid}</td>
		<td class="raw">{timestampToString($fields[guid].options.timestamp)}</td>
	</tr>
	{/each}
</table>

<style>
.active {
	color: green;
}
</style>