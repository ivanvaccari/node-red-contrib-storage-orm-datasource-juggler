## node-red-contrib-storage-orm-datasource-juggler
A Nodered storage plugin to persist flows in a large set of databases, powered by thepowerful loopback-datasource-juggler ORM


## What is datasource-juggler?
From [loopback-datasource-juggler](https://github.com/strongloop/loopback-datasource-juggler) repo:
> An ORM/ODM that provides a common set of interfaces for interacting with databases, REST APIs, and other types of data sources. It was originally forked from JugglingDB.

With an ORM, you can access different DBMS with the same code, making easier for the developer to support multiple database systems.

This allow this plugin to store nodered flows over a relatively large set of databases: **MongoDB**, **MySQL**, **MSSQL**, **PostgreSQL**, **DB2**, **Oracle** and many others (more than 19 availabe, see [loopback database connectors](https://loopback.io/doc/en/lb3/Database-connectors.html))

## Usage
In your settings file, define these two properties:
```
{
    storageModule: require("node-red-contrib-storage-orm-datasource-juggler"),
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

## StorageModuleOptions
This is the list of available options with their defaults:

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


## MongoDB
To use MongoDb as storage system install the relative connector 

```
npm install loopback-connector-mongodb
```

Then set the appropriate configuration to your nodered settings file

```
{
    storageModule: require("node-red-contrib-storage-orm-datasource-juggler"),
    storageModuleOptions: {
        connector: require("loopback-connector-mongodb"),
        connectorConfig: {
            host: "localhost",
            port: 27017,
            user: "",
            password: "",
            database: "nodered"
        }
    }
}
```

#### Available properties

**database**, *String*, Database name   
**host**, *String*, Database host name   
**name**, *String*, Name of the datasource in the app   
**password**, *String*, Password to connect to database   
**port**, *Number*, Database TCP port   
**url**, *String*, Connection URL of form mongodb://user:password@host/db. Overrides other connection settings   
**user**, *String*, Username to connect to database   
**authSource**, *String* Optional. Authentification database name. Usually "admin" value   

See [Mongodb connector properites](https://loopback.io/doc/en/lb3/MongoDB-connector.html#connection-properties) for full list.


## MySQL
To use MySQL as storage system install the relative connector 

```
npm install loopback-connector-mysql
```

Then set the appropriate configuration to your nodered settings file

```
{
    storageModule: require("node-red-contrib-storage-orm-datasource-juggler"),
    storageModuleOptions: {
        connector: require("loopback-connector-mysql"),
        connectorConfig: {
            host: "localhost",
            port: 3306,
            user: "nodered",
            password: "nodered",
            database: "nodered"
        }
    }
}

```

#### Schema 

You must create the tables on the database before starting nodered. Run the sql script from **schemas/mysql.sql** with your favourite mysql client to create it. The script creates a **nodered** database, if you want to use another name, change the rows:

```
CREATE DATABASE `myName`;
USE `myName`;
```

#### Available properties

**collation**, *String*, Determines the charset for the connection. Default is utf8_general_ci.   
**connectionLimit**, *Number*, The maximum number of connections to create at once. Default is 10.   
**database**, *String*, Database name   
**debug**, *Boolean*, If true, turn on verbose mode to debug database queries and lifecycle.   
**host**, *String*, Database host name   
**password**, *String*, Password to connect to database   
**port**, *Number*, Database TCP port   
**socketPath**, *String*, The path to a unix domain socket to connect to. When used host and port are ignored.   
**supportBigNumbers**, *Boolean*, Enable this option to deal with big numbers (BIGINT and DECIMAL columns) in the database. Default is false.   
**timeZone**, *String*, The timezone used to store local dates. Default is ‘local’.   
**url**, *String*, Connection URL of form mysql://user:password@host/db. Overrides other connection settings.   
**username**, *String*, Username to connect to database   

See [MySql connector properites](https://loopback.io/doc/en/lb3/MySQL-connector.html#properties) for full list.

## MSSQL
TODO

## PostgreSQL
TODO

## Oracle
TODO

## Cloudant
TODO

### FAQ

- Q: Got the error **The flow credential file is encrypted, but the project's encryption key is missing or invalid**, what should i do? 
- A: Set the property **credentialSecret** to any string you want.

