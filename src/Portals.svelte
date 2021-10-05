<script lang="ts">
import { createEventDispatcher } from "svelte";

import { portals } from "./stores";

import { timestampToString } from "./utils";

const dispath = createEventDispatcher();

export let linkID: LinkID = null;
export let fieldID: FieldID = null;

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
		portalList.sort((a,b) => $portals[b].options.timestamp - $portals[a].options.timestamp);
	}
}

function onClick(guid: PortalID) {
	dispath("select", { type: "portal", guid: guid });
}

</script>

<table>
	{#each portalList as guid (guid)}
	<tr>
		<td class:raw={!$portals[guid].options.data.title} title={guid} on:click={() => onClick(guid)}>{$portals[guid].options.data.title || guid}</td>
		<td class="raw">{timestampToString($portals[guid].options.timestamp)}</td>
	</tr>
	{/each}
</table>

<style>
table td:first-child {
	display: inline-block;
	max-width: 25em;
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>