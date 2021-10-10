<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let options: DialogOptions = {};
  let div: HTMLDivElement;

  let dispatch = createEventDispatcher();

  onMount(() => {
    dialog(
      Object.assign(options, {
        html: div,
        closeCallback: () => {
          if (options.closeCallback) options.closeCallback();
          dispatch('close');
        },
      })
    );
  });
</script>

<div bind:this={div}>
  <slot />
</div>
