<script lang="ts">
import { fields } from "./stores";

import Portals from "./Portals.svelte";
import Links from "./Links.svelte";

import { timestampToString } from "./utils";

export let guid = null;

let field = null;
$: {
	if (guid && $fields[guid]) {
		field = $fields[guid];
	} else {
		field = null;
	}
}

const properties = {
	guid: (opt) => opt.guid,
	timestamp: (opt) => timestampToString(opt.timestamp),
	team: (opt) => opt.team,
	"points[0].guid": (opt) => opt.data.points[0].guid,
	"points[0].latE6": (opt) => opt.data.points[0].latE6,
	"points[0].lngE6": (opt) => opt.data.points[0].lngE6,
	"points[1].guid": (opt) => opt.data.points[1].guid,
	"points[1].latE6": (opt) => opt.data.points[1].latE6,
	"points[1].lngE6": (opt) => opt.data.points[1].lngE6,
	"points[2].guid": (opt) => opt.data.points[2].guid,
	"points[2].latE6": (opt) => opt.data.points[2].latE6,
	"points[2].lngE6": (opt) => opt.data.points[2].lngE6,
};

</script>
<div>
	{#if field}
	<h3>Field</h3>
	<table>
		{#each Object.entries(properties) as [key, v]}
		<tr>
			<td>{key}</td>
			<td>{v(field.options)}</td>
		</tr>
		{/each}
	</table>
	<h3>Portals</h3>
	<Portals on:select fieldID={guid} />

	<h3>Links</h3>
	<Links on:select fieldID={guid} />
	{/if}
</div>