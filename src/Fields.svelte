<script lang="ts">
  import DataList from './DataList.svelte';
  import { fields, tiles } from './stores';

  import { portalInField, linkInField } from './utils';

  export let portalID: PortalGUID = null;
  export let linkID: LinkGUID = null;
  export let activeID: FieldGUID | false = false;
  export let tileID: TileID = null;

  let fieldList = [];
  $: {
    if (tileID) {
      const tile = $tiles[tileID];
      if (!tile) fieldList = [];
      else
        fieldList = tile.entities.filter((e) => e[0] == 'r').map((e) => e[1]);
      fieldList = fieldList.filter((a) => $fields[a]);
    } else {
      fieldList = Object.keys($fields).filter(
        (guid) =>
          (!portalID || portalInField(portalID, guid)) &&
          (!linkID || linkInField(linkID, guid))
      );
    }
    fieldList.sort(
      (a, b) => $fields[b].options.timestamp - $fields[a].options.timestamp
    );
  }
</script>

<DataList
  type="field"
  items={fieldList.map((guid) => [
    guid,
    $fields[guid].options.timestamp,
    { team: $fields[guid].options.data.team },
  ])}
  {activeID}
  on:select
/>
