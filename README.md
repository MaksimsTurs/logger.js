# logger.js
Small and simple logging library to log the information in to files and console.

## Table of Contents
  + [Documentation](#documentation)
    + [Installation](#installation)
    + [Creating a logger](#creating-a-logger)
    + [Log into console and file](#log-into-console-and-file)
    + [Custom prefix color](#custom-prefix-color)
    + [Custom prefix format](#custom-prefix-format)

## [Documentation](#documentation)
### [Installation](#installation)
```
npm i @maksims/logger.js
```
### [Creating a logger](#creating-a-logger)
```js
import Logger from "@maksims/logger.js";

export const logger = new Logger<"dev" | "prod">({
  // By setting "mode", we can filter out exactly what needs to be logged.
  // For example, when the "mode" has value "dev" only log calls that use
  // "dev" filter will be executed.
  mode: process.env.MODE,
  file: {
    //  With this option we set the dir path in which the log files will be served.
    dirPath: `${process.cwd()}/logs`
  }
});
```
### [Log into console and file](#log-into-console-and-file)
```js
import { logger } from "index.js";

function doStuff() {
  // ...do stuff

  // This info messages will be logged only in "dev" mode!
  logger.in(["dev"]).console.info("info:dev");
  // This warn messages will be logged only in "prod" mode!
  logger.in(["prod"]).console.warn("warn:prod", { code: 400 });
  // This error messages will be logged  in both "dev" and "prod" mode!
  logger.in(["dev", "prod"]).console.error("error:dev:prod", [1, 2, 3]);
  
  // ...do stuff
};

doStuff();
```
```js
import { logger } from "index.js";

function doStuff() {
  // ...do stuff

  // This info messages will be logged only in "dev" mode!
  logger.in(["dev"]).file.info("info:dev");
  // This warn messages will be logged only in "prod" mode!
  logger.in(["prod"]).file.warn("warn:prod", { code: 400 });
  // This error messages will be logged in both "dev" and "prod" mode!
  logger.in(["dev", "prod"]).file.error("error:dev:prod", [1, 2, 3]);
  
  // ...do stuff
};

doStuff();
```
You can call log function directly without filter to log specific information in any mode.
```js
import { logger } from "index.js"

logger.console.info("This message will be logged in any mode!");
```
## [Custom prefix color](#custom-prefix-color)
You can specify custom color for all three log levels (info, warn and error).
```js
const logger = new Logger<"prod", "dev">({
  // ... default options
  styles: {
    colors: {
      info: Logger.colorizer.bold().font().rgb(100, 100, 255),
      error: Logger.colorizer.bold().font().rgb(255, 100, 100),
      warn: Logger.colorizer.bold().font().rgb(200, 200, 100)
    }
  }
})
```
## [Custom prefix format](#custom-prefix-format)

You can specify custom time format for all three log levels (info, warn and error).
The libarary support 4 format vars, `hh` (hour), `mm` (minutes), `ss` (seconds) and `lvl` (log level).
```js
const logger = new Logger<"prod", "dev">({
  // ... default options
  styles: {
    format: "lvl hh::mm::ss"
  }
})

logger.console.info("Test the custom time format.")
```
This will log follow message.
```
  INFO 12::54::56 Test the custom time format.
```
