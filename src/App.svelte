<script lang="ts">
import Explorer from "./Explorer.svelte";

import { portals, links, fields, selectedPortal } from "./stores";

$portals = window.portals;
$links = window.links;
$fields = window.fields;
$selectedPortal = window.selectedPortal;

window.addHook('mapDataRefreshEnd', () => {
  $portals = window.portals;
  $links = window.links;
  $fields = window.fields;
});

window.addHook('portalAdded', (d) => {
  $portals[d.portal.options.guid] = d.portal;
});
window.addHook('linkAdded', (d) => {
  $links[d.link.options.guid] = d.link;
});
window.addHook('fieldAdded', (d) => {
  $fields[d.field.options.guid] = d.field;
});

window.addHook('portalSelected', (d) => {
  $selectedPortal = d.selectedPortalGuid;
});


function openExplorer() {
  new Explorer({
    target: document.body,
  });
}
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a on:click={openExplorer}>DataExplorer</a>