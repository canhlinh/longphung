import * as migration_20260621_101319_initial from './20260621_101319_initial';

export const migrations = [
  {
    up: migration_20260621_101319_initial.up,
    down: migration_20260621_101319_initial.down,
    name: '20260621_101319_initial'
  },
];
