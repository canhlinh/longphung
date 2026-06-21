import * as migration_20260621_101319_initial from './20260621_101319_initial';
import * as migration_20260621_105440_wholesale_customers from './20260621_105440_wholesale_customers';
import * as migration_20260621_110918_import_fields from './20260621_110918_import_fields';
import * as migration_20260621_125954_price_tiers_array from './20260621_125954_price_tiers_array';

export const migrations = [
  {
    up: migration_20260621_101319_initial.up,
    down: migration_20260621_101319_initial.down,
    name: '20260621_101319_initial',
  },
  {
    up: migration_20260621_105440_wholesale_customers.up,
    down: migration_20260621_105440_wholesale_customers.down,
    name: '20260621_105440_wholesale_customers',
  },
  {
    up: migration_20260621_110918_import_fields.up,
    down: migration_20260621_110918_import_fields.down,
    name: '20260621_110918_import_fields',
  },
  {
    up: migration_20260621_125954_price_tiers_array.up,
    down: migration_20260621_125954_price_tiers_array.down,
    name: '20260621_125954_price_tiers_array'
  },
];
