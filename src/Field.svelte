<script lang="ts">
import { fields } from "./stores";

import DataTable from "./DataTable.svelte";

import Portals from "./Portals.svelte";
import Links from "./Links.svelte";

import { timestampToString } from "./utils";

export let guid: FieldID = null;

let field: IITCField = null;
$: {
	if (guid && $fields[guid]) {
		field = $fields[guid];
	} else {
		field = null;
	}
}

$: properties = !field ? {} : {
	guid: field.options.guid,
	timestamp: timestampToString(field.options.timestamp),
	team: field.options.team,
	"points[0].guid": field.options.data.points[0].guid,
	"points[0].latE6": field.options.data.points[0].latE6,
	"points[0].lngE6": field.options.data.points[0].lngE6,
	"points[1].guid": field.options.data.points[1].guid,
	"points[1].latE6": field.options.data.points[1].latE6,
	"points[1].lngE6": field.options.data.points[1].lngE6,
	"points[2].guid": field.options.data.points[2].guid,
	"points[2].latE6": field.options.data.points[2].latE6,
	"points[2].lngE6": field.options.data.points[2].lngE6,
};

</script>
<div>
	{#if field}
	<h3>Field</h3>
	<DataTable properties={Object.keys(properties)}>
		<div slot="key" let:key>{key}</div>
		<div slot="value" let:key title={properties[key]}>{properties[key]}</div>
	</DataTable>

	<h3>Portals</h3>
	<Portals on:select fieldID={guid} />

	<h3>Links</h3>
	<Links on:select fieldID={guid} />
	{/if}
</div>