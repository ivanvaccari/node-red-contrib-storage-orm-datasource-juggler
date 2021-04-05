# node-red-contrib-storage-orm-datasource-juggler
A Nodered storage plugin to persist flows in a large set of databases, powered by thepowerful loopback-datasource-juggler ORM


# What is datasource-juggler?
From [loopback-datasource-juggler](https://github.com/strongloop/loopback-datasource-juggler) repo:
> An ORM/ODM that provides a common set of interfaces for interacting with databases, REST APIs, and other types of data sources. It was originally forked from JugglingDB.

With an ORM, you can access different DBMS with the same code, making easier for the developer to support multiple database systems.

This allow this plugin to store the nodered flows over a relatively large set of databases, like MongoDB, MySQL, MSSQL, PostgreSQL and many others (19 or even more, see [loopback database connectors](https://loopback.io/doc/en/lb3/Database-connectors.html))

# Usage
In your settings file, define these two properties:
```
{
    storageModule: require("ode-red-contrib-storage-orm-datasource-juggler"),
    storageModuleOptions: {
        connector: require("loopback-connector-mongodb"),
        connectorConfig: {
            // put here the configuration for your database, see https://loopback.io/doc/en/lb3/Database-connectors.html
        },
        collectionPrefix: "nodered",
        appName:'myAppName',
        overwriteFlows: false,
        overwriteCredentials: false,
        overwriteSettings: true,
        overwriteSessions: true
    }
}
```

# storageModuleOptions

```

// The db connector to be used for backend data storage.
// See https://loopback.io/doc/en/lb3/Database-connectors.html for the list of available connectors.
connector: require('loopback-connector-someDb')

// Db connector configuration opbject. Put here your db host and credentials
// See https://loopback.io/doc/en/lb3/Database-connectors.html for the options for each connector
connectorConfig: {}, 

// Collection prefix name
collectionPrefix: "",

// App name
appName: require("os").hostname(),

// Update the previous flows record instead of create a new one every time changes are deployed
overwriteFlows: false,

// Same as overwriteFlows, but for credentials
overwriteCredentials: false,

// Same as overwriteFlows, but for nodered settings
overwriteSettings: true,

// Same as overwriteFlows, but for sessions
overwriteSessions: true

```