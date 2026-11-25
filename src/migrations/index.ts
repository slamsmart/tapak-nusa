import * as migration_20261114_053312_initial from './20261114_053312_initial';

export const migrations = [
  {
    up: migration_20261114_053312_initial.up,
    down: migration_20261114_053312_initial.down,
    name: '20261114_053312_initial'
  },
];
