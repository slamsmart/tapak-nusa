import * as migration_20261114_053312_initial from './20261114_053312_initial';
import * as migration_20261127_001655_province_coordinates from './20261127_001655_province_coordinates';

export const migrations = [
  {
    up: migration_20261114_053312_initial.up,
    down: migration_20261114_053312_initial.down,
    name: '20261114_053312_initial',
  },
  {
    up: migration_20261127_001655_province_coordinates.up,
    down: migration_20261127_001655_province_coordinates.down,
    name: '20261127_001655_province_coordinates'
  },
];
