import { MyceliumError, ConfigUtils } from "@myceliumhq/common-all";
import _ from "lodash";
import { Migrations } from "./types";
import { MigrationUtils, PATH_MAP } from "./utils";
import { DEPRECATED_PATHS } from ".";
import { DConfig } from "@myceliumhq/common-server";

export const CONFIG_MIGRATIONS: Migrations = {
  version: "0.83.0",
  changes: [
    {
      /**
       * This is the migration that was done to clean up all legacy config namespaces.
       */
      name: "migrate config",
      func: async ({ myceliumConfig, wsConfig, wsService }) => {
        try {
          await DConfig.createBackup(wsService.wsRoot, "migrate-configs");
        } catch (error) {
          return {
            data: {
              myceliumConfig,
              wsConfig,
            },
            error: new MyceliumError({
              message:
                "Backup failed during config migration. Exiting without migration.",
            }),
          };
        }

        const defaultV5Config = ConfigUtils.genDefaultConfig();
        const rawMyceliumConfig = DConfig.getRaw(wsService.wsRoot);

        // remove all null properties
        const cleanMyceliumConfig = MigrationUtils.deepCleanObjBy(
          rawMyceliumConfig,
          _.isNull
        );

        if (_.isUndefined(cleanMyceliumConfig.commands)) {
          cleanMyceliumConfig.commands = {};
        }

        if (_.isUndefined(cleanMyceliumConfig.workspace)) {
          cleanMyceliumConfig.workspace = {};
        }

        if (_.isUndefined(cleanMyceliumConfig.preview)) {
          cleanMyceliumConfig.preview = {};
        }

        if (_.isUndefined(cleanMyceliumConfig.publishing)) {
          cleanMyceliumConfig.publishing = {};
        }

        // legacy paths to remove from config;
        const legacyPaths: string[] = [];
        // migrate each path mapped in current config version
        PATH_MAP.forEach((value, key) => {
          const { target: legacyPath, preserve } = value;
          let iteratee = value.iteratee;
          let valueToFill;
          let alreadyFilled;

          if (iteratee !== "skip") {
            alreadyFilled = _.has(cleanMyceliumConfig, key);
            const maybeLegacyConfig = _.get(cleanMyceliumConfig, legacyPath);
            if (_.isUndefined(maybeLegacyConfig)) {
              // legacy property doesn't have a value.
              valueToFill = _.get(defaultV5Config, key);
            } else {
              // there is a legacy value.
              // check if this mapping needs special treatment.
              if (_.isUndefined(iteratee)) {
                // assume identity mapping.
                iteratee = _.identity;
              }
              valueToFill = iteratee(maybeLegacyConfig);
            }
          }

          if (!alreadyFilled && !_.isUndefined(valueToFill)) {
            // if the property isn't already filled, fill it with determined value.
            _.set(cleanMyceliumConfig, key, valueToFill);
          }

          // these will later be used to delete.
          // only push if we aren't preserving target.
          if (!preserve) {
            legacyPaths.push(legacyPath);
          }
        });

        // set config version.
        _.set(cleanMyceliumConfig, "version", 5);

        // add deprecated paths to legacyPaths
        // so they could be unset if they exist
        legacyPaths.push(...DEPRECATED_PATHS);

        // remove legacy property from config after migration.
        legacyPaths.forEach((legacyPath) => {
          _.unset(cleanMyceliumConfig, legacyPath);
        });

        // recursively populate missing defaults
        const migratedConfig = _.defaultsDeep(
          cleanMyceliumConfig,
          defaultV5Config
        );

        return { data: { myceliumConfig: migratedConfig, wsConfig } };
      },
    },
  ],
};

export const MIGRATION_ENTRIES = [CONFIG_MIGRATIONS];
