<script lang="ts">
  import { onDestroy } from 'svelte';

  import Dialog from './Dialog.svelte';

  import Portal from './Portal.svelte';
  import Link from './Link.svelte';
  import Field from './Field.svelte';
  import Tile from './Tile.svelte';

  import Portals from './Portals.svelte';
  import Links from './Links.svelte';
  import Fields from './Fields.svelte';
  import Tiles from './Tiles.svelte';

  import { tiles, selectedPortal } from './stores';

  import { tileIDToTileParam, coveredS2CellsByTile } from './utils';

  let selectedType: 'portal' | 'link' | 'field' | 'tile' = null;
  let selectedGuid = null;

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
            }).addTo(hlLayer);

          break;
        case 'r':
          const field = window.fields[guid];
          if (field)
            window.L.geodesicPolygon(field.getLatLngs(), {
              stroke: false,
              fillColor: 'red',
            }).addTo(hlLayer);

          break;
      }
    }
    hlLayer.bringToFront();
  }

  function select(e: { detail?: { type: typeof selectedType; guid: string } }) {
    hlLayer.clearLayers();
    if (e.detail) {
      selectedType = e.detail.type;
      selectedGuid = e.detail.guid;
      switch (selectedType) {
        case 'portal':
          window.selectPortal(selectedGuid);
          break;
        case 'link':
          selectEntities([['e', selectedGuid]]);
          break;
        case 'field':
          selectEntities([['r', selectedGuid]]);
          break;
        case 'tile':
          const param = tileIDToTileParam(selectedGuid);
          const tile = $tiles[selectedGuid];
          if (tile) selectEntities(tile.entities);
          window.L.rectangle(
            [
              [param.latSouth, param.lngWest],
              [param.latNorth, param.lngEast],
            ],
            { color: 'purple' }
          ).addTo(hlLayer);
          for (const s2 of coveredS2CellsByTile(selectedGuid)) {
            window.L.geodesicPolygon(s2.getCornerLatLngs(), {
              color: 'yellow',
              fill: false,
            }).addTo(hlLayer);
          }
        default:
          break;
      }
    } else {
      selectedGuid = null;
      selectedType = null;
    }
  }

  function selectCurrentPortal() {
    if (window.selectedPortal) {
      selectedType = 'portal';
      selectedGuid = window.selectedPortal;
    }
  }

  let tab: 'portals' | 'links' | 'fields' | 'tiles' = 'portals';

  onDestroy(() => {
    selectEntities([]);
    hlLayer.remove();
  });
</script>

<Dialog
  options={{ title: 'Data Explorer', resizable: true, width: 'auto' }}
  on:close
>
  <div class="content">
    <div class="list">
      <ul class="tablist">
        <li on:click={() => (tab = 'portals')} class:active={tab == 'portals'}>
          Portals
        </li>
        <li on:click={() => (tab = 'links')} class:active={tab == 'links'}>
          Links
        </li>
        <li on:click={() => (tab = 'fields')} class:active={tab == 'fields'}>
          Fields
        </li>
        <li on:click={() => (tab = 'tiles')} class:active={tab == 'tiles'}>
          Tiles
        </li>
        {#if $selectedPortal}
          <li
            on:click={selectCurrentPortal}
            class:selected={selectedType == 'portal' &&
              selectedGuid == $selectedPortal}
          >
            Current portal
          </li>
        {/if}
      </ul>
      {#if tab == 'portals'}
        <Portals
          on:select={select}
          activeID={selectedType == 'portal' && selectedGuid}
        />
      {:else if tab == 'links'}
        <Links
          on:select={select}
          activeID={selectedType == 'link' && selectedGuid}
        />
      {:else if tab == 'fields'}
        <Fields
          on:select={select}
          activeID={selectedType == 'field' && selectedGuid}
        />
      {:else if tab == 'tiles'}
        <Tiles
          on:select={select}
          activeID={selectedType == 'tile' && selectedGuid}
        />
      {/if}
    </div>
    {#if selectedType}
      <div class="card">
        {#if selectedType == 'portal'}
          <Portal on:select={select} guid={selectedGuid} />
        {:else if selectedType == 'link'}
          <Link on:select={select} guid={selectedGuid} />
        {:else if selectedType == 'field'}
          <Field on:select={select} guid={selectedGuid} />
        {:else if selectedType == 'tile'}
          <Tile on:select={select} tid={selectedGuid} />
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
    font-weight: bold;
  }

  .tablist li:nth-child(n + 2)::before {
    content: '| ';
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
