<script lang="ts">
import { portals } from "./stores";

import Links from "./Links.svelte";
import Fields from "./Fields.svelte";

import { timestampToString } from "./utils";

export let guid = null;

let portal = null;
$: {
	if (guid && $portals[guid]) {
		portal = $portals[guid];
	} else {
		portal = null;
	}
}

const properties = {
	guid: (opt) => opt.guid,
	timestamp: (opt) => timestampToString(opt.timestamp),
	team: (opt) => opt.team,
	latE6: (opt) => opt.data.latE6,
	lngE6: (opt) => opt.data.lngE6,
	level: (opt) => opt.level,
	health: (opt) => opt.data.health,
	resCount: (opt) => opt.data.resCount,
	image: (opt) => opt.data.image,
	title: (opt) => opt.data.title,
	ornaments: (opt) => opt.data.ornaments,
	mission: (opt) => opt.data.mission,
	mission50plus: (opt) => opt.data.mission50plus,
	artifactBrief: (opt) => JSON.stringify(opt.data.artifactBrief),
	mods: (opt) => JSON.stringify(opt.data.mods),
	resonators: (opt) => JSON.stringify(opt.data.resonators),
	owner: (opt) => opt.data.owner,
	artifactDetail: (opt) => JSON.stringify(opt.data.artifactDetail),
	history: (opt) => opt.data.history && opt.data.history._raw || 0,
};

</script>
<div>
	{#if portal}
	<h3 on:click={() => window.renderPortalDetails(guid)}>Portal ↻</h3>
	<table>
		{#each Object.entries(properties) as [key, v]}
		<tr>
			<td>{key}</td>
			{#if key == "image"}
			<td><a title={'<img src="' + v(portal.options) + '" style="width: 100px; height=100px"/>'} href={v(portal.options)}>{v(portal.options)}</a></td>
			{:else}
			<td title={v(portal.options)}>{v(portal.options)}</td>
			{/if}
		</tr>
		{/each}
	</table>
	<h3>Links</h3>
	<Links on:select portalID={guid} />

	<h3>Fields</h3>
	<Fields on:select portalID={guid} />
	{/if}
</div>

<style type="text/css">
	table td:last-child {
		display: inline-block;
		max-width: 25em;
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	h3:hover {
		text-decoration: underline;
		cursor: pointer;
	}
</style>