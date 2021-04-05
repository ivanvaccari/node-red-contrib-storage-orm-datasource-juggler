const DataSource = require("loopback-datasource-juggler").DataSource;
const crypto = require("crypto");

/**
 * Models to be created with relative db schema
 */
const modelDefinitions = {
    Flows: {
        json: String,
        createdAt: Date,
        appName: String,
        deleted: Boolean,
        revision: String
    },
    Credentials: {
        json: String,
        createdAt: Date,
        appName: String,
        deleted: Boolean,
        revision: String
    },
    Settings: {
        json: String,
        createdAt: Date,
        appName: String,
        deleted: Boolean,
        revision: String
    },
    Sessions: {
        json: String,
        createdAt: Date,
        appName: String,
        deleted: Boolean,
        revision: String
    },
    LibraryEntry: {
        json: String,
        meta: String,
        type: String,
        path: String,
        createdAt: Date,
        appName: String,
        deleted: Boolean,
        revision: String
    }
};

const defaultOptions = {
    // collection prefix name
    collectionPrefix: "",

    // app name.
    appName: require("os").hostname(),

    // update the previous flows record instead of create a new one every time changes are deployed
    overwriteFlows: false,

    // same as overwriteFlows, but for credentials
    overwriteCredentials: false,

    // same as overwriteFlows, but for nodered settings
    overwriteSettings: true,

    // same as overwriteFlows, but for sessions
    overwriteSessions: true
};

let options = null;
const models = {
    Flows: null,
    Credentials: null,
    Settings: null,
    Sessions: null,
    LibraryEntry: null
};

let dataSource = null;

/**
 * Init this plugin
 *
 * @param {Object} settings Nodered settings json
 */
const init = (settings) => {
    if (!settings.storageModuleOptions || !settings.storageModuleOptions.connector || !settings.storageModuleOptions.connectorConfig) {
        return Promise.reject(new Error("StorageModule init failed. You must define storageModuleOptions.connector, storageModuleOptions.connectorConfig"));
    }

    // merge default options with passed ones
    options = Object.assign({}, defaultOptions, settings.storageModuleOptions || {});

    // make sure something exist in appNAme
    options.appName = options.appName || require("os").hostname();

    // create the datasource, connect to it and then create the models.
    settings.storageModuleOptions.connectorConfig.connector = settings.storageModuleOptions.connector;
    dataSource = new DataSource("lb-ds-ju", settings.storageModuleOptions.connectorConfig);
    return dataSource.connect()
        .then(() => {
            models.Flows = dataSource.define(options.collectionPrefix + "Flows", modelDefinitions.Flows);
            models.Credentials = dataSource.define(options.collectionPrefix + "Credentials", modelDefinitions.Credentials);
            models.Settings = dataSource.define(options.collectionPrefix + "Settings", modelDefinitions.Settings);
            models.Sessions = dataSource.define(options.collectionPrefix + "Sessions", modelDefinitions.Sessions);
            models.LibraryEntry = dataSource.define(options.collectionPrefix + "LibraryEntry", modelDefinitions.LibraryEntry);
        });
};

/**
 *
 * @param {*} model Model where to perform the find operation
 * @param {*} onEmpty Object to resolve if nothig is found on the db. If nothing is pased, a 404 error is thrown.
 * @param {*} name Model name for logging purposes
 */
const get = (model, onEmpty, name) => {
    return new Promise((resolve, reject) => {
        const filter = {
            where: {
                appName: options.appName,
                deleted: false
            },

            // these two filters make sure we always get the last written record
            order: "createdAt DESC",
            limit: 1
        };

        model.find(filter, (error, record) => {
            if (error) return reject(error);
            if (record.length === 0) {
                if (onEmpty) {
                    return resolve(onEmpty);
                }
                return reject(new Error("404, " + name + " not found."));
            }

            resolve(JSON.parse(record[0].json));
        });
    });
};

/**
 * Save something on the db.
 *
 * @param {Model} model Model where to perform the create/update operation
 * @param {Object} data The data to be persistes
 * @param {Boolean} overwrite Overwrite existing records (match by appName) or always create a new one, leaving a "logically/soft deleted" backup of old stuff on the db
 * @param {String} name Model name for logging purposes
 */
const save = (model, data, overwrite, name) => {
    return new Promise((resolve, reject) => {
        const stringifiedJson = JSON.stringify(data);
        const revision = crypto.createHash("md5").update(stringifiedJson).digest("hex");

        const record = {
            json: stringifiedJson,
            createdAt: new Date(),
            appName: options.appName,
            deleted: false,
            revision: revision
        };

        if (overwrite) {
            const find = {
                appName: record.appName,
                deleted: false
            };
            model.upsertWithWhere(find, record, (error, result) => {
                if (error) return reject(error);
                resolve();
            });
        } else {
            model.create(record, (error, createdRecord) => {
                if (error) return reject(error);

                // set the old records as deleted, masking them out from future searches.
                // Keeping this here will indirectly make a historical log of past records
                const updateFiler = {
                    id: { nin: [createdRecord.id] },
                    deleted: false
                };
                model.updateAll(updateFiler, { deleted: true }, (error, result) => {
                    if (error) return reject(error);

                    resolve();
                });
            });
        }
    });
};
const getFlows = () => {
    return get(models.Flows, [], "Flows");
};

const saveFlows = (flows) => {
    return save(models.Flows, flows, options.overwriteFlows, "Flows");
};

const getCredentials = () => {
    return get(models.Credentials, {}, "Credentials");
};

const saveCredentials = (credentials) => {
    return save(models.Credentials, credentials, options.overwriteCredentials, "Credentials");
};

const getSettings = () => {
    return get(models.Settings, {}, "Settings");
};

const saveSettings = (settings) => {
    return save(models.Settings, options.overwriteSettings, "Settings");
};

const getSessions = () => {
    return get(models.Sessions, {}, "Sessions");
};

const saveSessions = (sessions) => {
    return save(models.Sessions, sessions, options.overwriteSessions, "Sessions");
};

const getLibraryEntry = (type, path) => {
    return new Promise((resolve, reject) => {
        const filter = {
            where: {
                appName: options.appName,
                deleted: false,
                type: type,
                path: path
            },
            order: "createdAt DESC",
            limit: 1
        };

        models.LibraryEntry.find(filter, (error, record) => {
            if (error) return reject(error);
            if (record.length === 0) return resolve({});

            resolve(JSON.parse(record[0].json));
        });
    });
};

const saveLibraryEntry = (type, path, meta, body) => {
    return new Promise((resolve, reject) => {
        const stringifiedJson = JSON.stringify(body);
        const revision = crypto.createHash("md5").update(stringifiedJson).digest("hex");

        const record = {
            json: stringifiedJson,
            meta: JSON.stringify(meta),
            type: type,
            path: path,
            createdAt: new Date(),
            appName: options.appName,
            deleted: false,
            revision: revision
        };

        models.LibraryEntry.create(record, (error, createdRecord) => {
            if (error) return reject(error);

            const updateFiler = {
                id: { nin: [createdRecord.id] }
            };
            models.LibraryEntry.updateAll(updateFiler, { deleted: true }, (error, result) => {
                if (error) return reject(error);

                resolve();
            });
        });
    });
};

const jugglerStorage = {
    init: init,
    getFlows: getFlows,
    saveFlows: saveFlows,
    getCredentials: getCredentials,
    saveCredentials: saveCredentials,
    getSettings: getSettings,
    saveSettings: saveSettings,
    getSessions: getSessions,
    saveSessions: saveSessions,
    getLibraryEntry: getLibraryEntry,
    saveLibraryEntry: saveLibraryEntry
};

module.exports = jugglerStorage;
