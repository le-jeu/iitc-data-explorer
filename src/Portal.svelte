<script lang="ts">
  import { portals } from './stores';

  import DataTable from './DataTable.svelte';

  import Links from './Links.svelte';
  import Fields from './Fields.svelte';

  import { timestampToString } from './utils';

  export let guid: PortalGUID = null;

  let portal: IITC.Portal = null;
  $: {
    if (guid && $portals[guid]) {
      portal = $portals[guid];
    } else {
      portal = null;
    }
  }

  $: properties = !portal
    ? {}
    : {
        guid: portal.options.guid,
        timestamp: timestampToString(portal.options.timestamp),
        team: portal.options.team,
        latE6: portal.options.data.latE6,
        lngE6: portal.options.data.lngE6,
        level: portal.options.level,
        health: portal.options.data.health,
        resCount: portal.options.data.resCount,
        image: portal.options.data.image,
        title: portal.options.data.title,
        ornaments: portal.options.data.ornaments,
        mission: portal.options.data.mission,
        mission50plus: portal.options.data.mission50plus,
        artifactBrief: JSON.stringify(portal.options.data.artifactBrief),
        mods: JSON.stringify(portal.options.data.mods),
        resonators: JSON.stringify(portal.options.data.resonators),
        owner: portal.options.data.owner,
        artifactDetail: JSON.stringify(portal.options.data.artifactDetail),
        history:
          (portal.options.data.history && portal.options.data.history._raw) ||
          0,
      };

  $: titles = !portal
    ? {}
    : {
        image:
          '<img src="' +
          portal.options.data.image +
          '" style="width: 100px; height=100px"/>',
      };
</script>

<div>
  {#if portal}
    <h3 on:click={() => window.renderPortalDetails(guid)}>Portal ↻</h3>
    <DataTable {properties}>
      <div slot="value" let:key title={titles[key] || properties[key]}>
        {#if key == 'image'}
          <a href={properties[key]}>{properties[key]}</a>
        {:else}
          {properties[key]}
        {/if}
      </div>
    </DataTable>

    <h3>Links</h3>
    <Links on:select portalID={guid} />

    <h3>Fields</h3>
    <Fields on:select portalID={guid} />
  {/if}
</div>

<style type="text/css">
  h3:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
