<script lang="ts">
  import Explorer from './Explorer.svelte';
  import FieldCovering from './FieldCovering.svelte';

  import { portals, links, fields, tiles, selectedPortal } from './stores';

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

  let lastRefresh = 0;
  window.addHook('mapDataRefreshStart', () => {
    lastRefresh = Date.now();
  });
  window.addHook('mapDataRefreshEnd', () => {
    const ts = $tiles;
    const toDelete = [];
    // add some delay
    const oldAge = lastRefresh - 1000 * 60 * 5;
    for (const id in ts) {
      if (ts[id].time < oldAge) toDelete.push(id);
    }
    for (const id of toDelete) delete ts[id];
    $tiles = ts;
  });

  const oldPushRenderQueue = window.MapDataRequest.prototype.pushRenderQueue;
  window.MapDataRequest.prototype.pushRenderQueue = function (
    id,
    data: RequestTile,
    status
  ) {
    oldPushRenderQueue.call(this, id, data, status);
    $tiles[id] = {
      time: Date.now(),
      entities: data.gameEntities.map((e) => [e[2][0], e[0]]),
    };
  };

  function openExplorer() {
    const exp = new Explorer({
      target: document.body,
    });
    exp.$on('close', () => exp.$destroy());
  }

  function openFieldCovering() {
    const fc = new FieldCovering({
      target: document.body,
    });
    fc.$on('close', () => fc.$destroy());
  }
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a on:click={openExplorer}>DataExplorer</a>
<!-- svelte-ignore a11y-missing-attribute -->
<a on:click={openFieldCovering}>FieldCovering</a>
