<script lang="ts">
import { createEventDispatcher } from "svelte";

import { links } from "./stores";

import { portalInLink, linkInField, timestampToString } from "./utils";

const dispatch = createEventDispatcher();

export let portalID: PortalID = null;
export let activeID: LinkID | false = false;
export let fieldID: FieldID = null;

let linkList = [];
$: linkList = Object.keys($links).filter((guid) => (!portalID || portalInLink(portalID, guid)) && (!fieldID || linkInField(guid, fieldID)));

$: {
	linkList = Object.keys($links).filter((guid) => (!portalID || portalInLink(portalID, guid)) && (!fieldID || linkInField(guid, fieldID)));
	linkList.sort((a,b) => $links[b].options.timestamp - $links[a].options.timestamp);
}

function onClick(guid: LinkID) {
	dispatch('select', { type: 'link', guid: guid});
}

</script>

<table>
	{#each linkList as guid (guid)}
	<tr class:active={guid == activeID}>
		<td class="raw" on:click={() => onClick(guid)}>{guid}</td>
		<td class="raw">{timestampToString($links[guid].options.timestamp)}</td>
	</tr>
	{/each}
</table>

<style>
.active {
	color: green;
}
</style>