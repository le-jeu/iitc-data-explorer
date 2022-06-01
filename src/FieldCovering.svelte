<script lang="ts">
  import { onDestroy } from 'svelte';

  import Dialog from './Dialog.svelte';

  import Fields from './Fields.svelte';

  import { approxS2FieldCovering } from './utils';

  let selectedGuid = null;
  let minLevel = 4;
  let maxLevel = 13;
  let maxCells = 1000;
  let mergeCells = true;

  let hlLayer = window.L.featureGroup().addTo(window.map);

  let selectedEntities = [];
  function selectEntities(entities: TileInfo['entities']) {
    hlLayer.clearLayers();
    selectedEntities = entities;
    for (const e of selectedEntities) {
      const [type, guid] = e;
      switch (type) {
        case 'p':
          break;
        case 'e':
          const link = window.links[guid];
          if (link)
            window.L.geodesicPolyline(link.getLatLngs(), {
              color: 'red',
              interactive: false,
            }).addTo(hlLayer);

          break;
        case 'r':
          const field = window.fields[guid];
          if (field)
            window.L.geodesicPolygon(field.getLatLngs(), {
              stroke: false,
              fillColor: 'red',
              interactive: false,
            }).addTo(hlLayer);

          break;
      }
    }
    hlLayer.bringToFront();
  }

  function select(e: { detail?: { type: 'field'; guid: string } }) {
    hlLayer.clearLayers();
    if (e.detail) {
      switch (e.detail.type) {
        case 'field':
          selectedGuid = e.detail.guid;
          selectEntities([['r', selectedGuid]]);
          for (const s2 of approxS2FieldCovering(
            selectedGuid,
            minLevel,
            maxLevel,
            maxCells,
            mergeCells
          )) {
            window.L.geodesicPolygon(s2.getCornerLatLngs(), {
              color: 'purple',
              interactive: false,
            }).addTo(hlLayer);
          }
          break;
        default:
          break;
      }
      hlLayer.bringToFront();
    } else {
      selectedGuid = null;
    }
  }

  onDestroy(() => {
    selectEntities([]);
    hlLayer.remove();
  });
</script>

<Dialog
  options={{ title: 'Field Covering', resizable: true, width: 'auto' }}
  on:close
>
  <div class="content">
    <div class="options">
      <table>
        <tr><th>Min lvl</th><th>Max lvl</th><th>#Cells</th><th>Merge</th></tr>
        <tr>
          <td><input bind:value={minLevel} type="number" /></td>
          <td><input bind:value={maxLevel} type="number" /></td>
          <td><input bind:value={maxCells} type="number" /></td>
          <td><input bind:checked={mergeCells} type="checkbox" /></td>
        </tr>
      </table>
    </div>
    <div class="list">
      <Fields on:select={select} activeID={selectedGuid} />
    </div>
  </div>
</Dialog>

<style type="text/css">
  .content {
    display: grid;
  }

  .content > div {
    background-color: #0003;
    border-radius: 10px;
    padding: 0.5em;
  }

  @media (max-width: 700px) {
    .content > div {
      box-sizing: border-box;
      width: calc(100vw - 24px);
    }
  }
</style>
