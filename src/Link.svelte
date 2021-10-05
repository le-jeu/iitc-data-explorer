<script lang="ts">
import { links } from "./stores";

import Portals from "./Portals.svelte";
import Fields from "./Fields.svelte";

import { timestampToString } from "./utils";

export let guid: LinkID = null;

let link: IITCLink = null;
$: {
	if (guid && $links[guid]) {
		link = $links[guid];
	} else {
		link = null;
	}
}

const properties: {
	[prop: string]: (opt: any) => any
} = {
	guid: (opt) => opt.guid,
	timestamp: (opt) => timestampToString(opt.timestamp),
	team: (opt) => opt.team,
	oGuid: (opt) => opt.data.oGuid,
	oLatE6: (opt) => opt.data.oLatE6,
	oLngE6: (opt) => opt.data.oLngE6,
	dGuid: (opt) => opt.data.dGuid,
	dLatE6: (opt) => opt.data.dLatE6,
	dLngE6: (opt) => opt.data.dLngE6,
};

</script>
<div>
	{#if link}
	<h3>Link</h3>
	<table class="raw">
		{#each Object.entries(properties) as [key, v]}
		<tr>
			<td>{key}</td>
			<td>{v(link.options)}</td>
		</tr>
		{/each}
	</table>
	<h3>Portals</h3>
	<Portals on:select linkID={guid} />

	<h3>Fields</h3>
	<Fields on:select linkID={guid} />
	{/if}
</div>