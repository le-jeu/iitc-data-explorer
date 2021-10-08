<script lang="ts">
import Dialog from "./Dialog.svelte";

import Portal from "./Portal.svelte";
import Link from "./Link.svelte";
import Field from "./Field.svelte";

import Portals from "./Portals.svelte";
import Links from "./Links.svelte";
import Fields from "./Fields.svelte";

import { selectedPortal } from "./stores";

let selectedType : "portal" | "link" | "field" = null;
let selectedGuid = null;

function unselect() {
	let link: IITCLink;
	let field: IITCField;
	switch (selectedType) {
		case "portal":
			break;
		case "link":
			link = window.links[selectedGuid];
			if (link) link.setStyle({ color: COLORS[link.options.team] });
			break;
		case "field":
			field = window.fields[selectedGuid];
			if (field) field.setStyle({ fillColor: COLORS[field.options.team] });
			break;
	}
}

function select(e: { detail?: { type: typeof selectedType, guid: string }}) {
	unselect();
	if (e.detail) {
		selectedType = e.detail.type;
		selectedGuid = e.detail.guid;
		switch (selectedType) {
			case "portal":
				window.selectPortal(selectedGuid);
				break;
			case "link":
				const link = window.links[selectedGuid];
				if (link) link.setStyle({ color: 'red' });
				break;
			case "field":
				const field = window.fields[selectedGuid];
				if (field) {
					field.setStyle({ fillColor: 'red' });
					field.bringToFront();
				}
				break;
		}
	} else {
		selectedGuid = null;
		selectedType = null;
	}
}

function selectCurrentPortal() {
	if (window.selectedPortal) {
		selectedType = "portal";
		selectedGuid = window.selectedPortal;
	}
}

let tab : "portals" | "links" | "fields" = "portals";

</script>

<Dialog options={{title: "Data Explorer", resizable: true, width: 'auto' }}>
	<div class="content">
		<div class="list">
			<ul class="tablist">
				<li on:click={() => tab = "portals"} class:active={tab == "portals"}>Portals</li>
				<li on:click={() => tab = "links"} class:active={tab == "links"}>Links</li>
				<li on:click={() => tab = "fields"} class:active={tab == "fields"}>Fields</li>
				{#if $selectedPortal}
				<li on:click={selectCurrentPortal} class:selected={selectedType == "portal" && selectedGuid == $selectedPortal}>Current portal</li>
				{/if}
			</ul>
			{#if tab == "portals"}
			<Portals on:select={select} activeID={selectedType == "portal" && selectedGuid}/>
			{:else if tab == "links"}
			<Links on:select={select} activeID={selectedType == "link" && selectedGuid}/>
			{:else if tab == "fields"}
			<Fields on:select={select} activeID={selectedType == "field" && selectedGuid}/>
			{/if}
		</div>
		{#if selectedType}
		<div class="card">
			{#if selectedType == "portal"}
			<Portal on:select={select} guid={selectedGuid}/>
			{:else if selectedType == "link"}
			<Link on:select={select} guid={selectedGuid}/>
			{:else if selectedType == "field"}
			<Field on:select={select} guid={selectedGuid}/>
			{/if}
		</div>
		{/if}
	</div>
</Dialog>

<style type="text/css">
	.content {
		display: grid;
		grid-gap: 24px;
		grid-auto-flow: column;
	}

	.tablist {
		padding-left: 1em;
	}

	.tablist li {
		display: inline-block;
	}
	.tablist li.active {
		font-weight: bold;
	}

	.tablist li.selected {
		color: red;
		font-weight: bold
	}

	.tablist li:nth-child(n+2)::before {
    	content: "| ";
    }

    .content > div {
    	background-color: #0003;
    	border-radius: 10px;
    	padding: 0.5em;
    }

    .content :global(.grid) {
    	padding: .5em;
    	border: 1px solid #69a;
    	background-color: #0001;
    	box-sizing: border-box;
    }

	@media (max-width: 700px) {
		.content > div {
    		box-sizing: border-box;
			width: calc(100vw - 24px);
		}
	}
</style>