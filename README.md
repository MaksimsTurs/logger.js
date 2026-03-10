# Logger.js

Small and simple logging library to log the information in to files and terminal.

## Table of Contents
  + [Documentation](#documentation)
    + [Creating a logger](#creating-a-logger)
    + [Log into terminal and file](#log-into-terminal-and-file)
    + [Custom time color](#custom-time-color)
    + [Custom time format](#custom-time-format)

## [Documentation](#documentation)
### [Creating a logger](#creating-a-logger)
```js
import Logger from "Logger.js";

export const logger = new Logger<"dev" | "prod">({
  // By setting "mode", we can filter out exactly what needs to be logged.
  // For example, when the "mode" has value "dev" only log calls that use
  // "dev" filter will be executed.
  mode: process.env.MODE,
  fileOptions: {
    //  With this option we set the dir path in which the log files will be served.
    dirPath: `${process.cwd()}/logs`
  }
});
```
### [Log into terminal and file](#log-into-terminal-and-file)
```js
import { logger } from "index.js";

function doStuff() {
  // ...do stuff

  // This info messages will be logged only in "dev" mode!
  logger.in(["dev"]).terminal.info("info:dev");
  // This warn messages will be logged only in "prod" mode!
  logger.in(["prod"]).terminal.warn("warn:prod", { code: 400 });
  // This error messages will be logged  in both "dev" and "prod" mode!
  logger.in(["dev", "prod"]).terminal.error("error:dev:prod", [1, 2, 3]);
  
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
Does not call `in` function when you want log specific messages in any mode.
```js
import { logger } from "index.js"

logger.terminal.info("This message will be logged in any mode!");
```
## [Custom time color](#custom-time-color)
You can specify custom color for all three log levels (info, warn and error).
```js
const logger = new Logger<"prod", "dev">({
  // ... default options
  styling: {
    colors: {
      info: Logger.colorizer.bold().font().rgb(100, 100, 255),
      error: Logger.colorizer.bold().font().rgb(255, 100, 100),
      warn: Logger.colorizer.bold().font().rgb(200, 200, 100)
    }
  }
})
```
## [Custom time format](#custom-time-format)

You can specify custom time format for all three log levels (info, warn and error).
The libarary support 4 format vars, `hh` (hour), `mm` (minutes), `ss` (seconds) and `lvl` (log level).
```js
const logger = new Logger<"prod", "dev">({
  // ... default options
  styling: {
    logFormat: "lvl hh::mm::ss"
  }
})

logger.terminal.info("Test the custom time format.")
```
This will log follow message.
```
  INFO 12::54::56 Test the custom time format.
```
