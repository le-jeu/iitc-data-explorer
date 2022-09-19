<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let options: DialogOptions = {};
  let div: HTMLDivElement;

  let dispatch = createEventDispatcher();

  onMount(() => {
    const closeCallback = options.closeCallback;
    dialog(
      Object.assign(options, {
        html: div,
        closeCallback: () => {
          if (closeCallback) closeCallback();
          dispatch('close');
        },
      })
    );
  });
</script>

<div bind:this={div}>
  <slot />
</div>

<style>
  :global(.ui-dialog.full-width-dialog) {
    max-width: calc(100vw - 2px);
  }
</style>
