import * as migration_20260621_140922_initial from './20260621_140922_initial';
import * as migration_20261125_071452_payload_3_94_upgrade from './20261125_071452_payload_3_94_upgrade';

export const migrations = [
  {
    up: migration_20260621_140922_initial.up,
    down: migration_20260621_140922_initial.down,
    name: '20260621_140922_initial',
  },
  {
    up: migration_20261125_071452_payload_3_94_upgrade.up,
    down: migration_20261125_071452_payload_3_94_upgrade.down,
    name: '20261125_071452_payload_3_94_upgrade'
  },
];
