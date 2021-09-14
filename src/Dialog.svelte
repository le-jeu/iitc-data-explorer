<script lang="ts">
import {onMount, onDestroy} from "svelte";

export let options : DialogOptions = {};
let div: HTMLDivElement;

onMount(() => {
	dialog(Object.assign(options, {
		html: div,
	}))
});
</script>

<div bind:this={div}>
	<slot/>
</div>
