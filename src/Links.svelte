<script lang="ts">
import { createEventDispatcher } from "svelte";

import { links } from "./stores";

import { portalInLink, linkInField, timestampToString } from "./utils";

const dispatch = createEventDispatcher();

export let fieldID = null;
export let portalID = null;

let selectedGuid = null;

let linkList = [];
$: linkList = Object.keys($links).filter((guid) => (!portalID || portalInLink(portalID, guid)) && (!fieldID || linkInField(guid, fieldID)));

$: {
	linkList = Object.keys($links).filter((guid) => (!portalID || portalInLink(portalID, guid)) && (!fieldID || linkInField(guid, fieldID)));
	linkList.sort((a,b) => $links[b].options.timestamp - $links[a].options.timestamp);
}

function onClick(guid) {
	dispatch('select', { type: 'link', guid: guid});
}

</script>

<table>
	{#each linkList as guid (guid)}
	<tr>
		<td on:click={() => onClick(guid)}>{guid}</td>
		<td>{timestampToString($links[guid].options.timestamp)}</td>
	</tr>
	{/each}
</table>

<style>
table td:last-child {
	white-space: nowrap;
}
</style>