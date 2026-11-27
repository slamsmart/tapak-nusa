import * as migration_20261114_053312_initial from './20261114_053312_initial';
import * as migration_20261127_001655_province_coordinates from './20261127_001655_province_coordinates';
import * as migration_20261127_124836_users_auth from './20261127_124836_users_auth';
import * as migration_20261127_134932_add_user_avatar from './20261127_134932_add_user_avatar';

export const migrations = [
  {
    up: migration_20261114_053312_initial.up,
    down: migration_20261114_053312_initial.down,
    name: '20261114_053312_initial',
  },
  {
    up: migration_20261127_001655_province_coordinates.up,
    down: migration_20261127_001655_province_coordinates.down,
    name: '20261127_001655_province_coordinates',
  },
  {
    up: migration_20261127_124836_users_auth.up,
    down: migration_20261127_124836_users_auth.down,
    name: '20261127_124836_users_auth',
  },
  {
    up: migration_20261127_134932_add_user_avatar.up,
    down: migration_20261127_134932_add_user_avatar.down,
    name: '20261127_134932_add_user_avatar'
  },
];
