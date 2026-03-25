import STRING from "./const/STRING.const.js";
import REGEXP from "./const/REGEXP.const.js";

import pckg from "../package.json" with { type: "json" };

import Colorizer from "@maksims/colorizer.js";

import fsSync from "node:fs";
import fsAsync from "node:fs/promises";

import createTimeString from "./utils/create-time-string.util.js";
import createFileName from "./utils/create-file-name.util.js";
import { isObject, isPathExists, isPathExistsSync, isAlphabetic } from "./utils/is.util.js";

/**
 *  @typedef {Object} LoggerFileOptions
 *  @property {string} dirPath
 *  @property {number} [formattingSpace]
 */

/**
 *  @typedef {Object} LoggerPrefixStyleOptions
 *  @property {Colorizer} [info]
 *  @property {Colorizer} [warn]
 *  @property {Colorizer} [error]
 */

/**
 *  @typedef {Object} LoggerStyleOptions
 *  @property {string} [format]
 *  @property {LoggerPrefixStyleOptions} [colors]
 */

/**
 *  @template T
 *  @typedef {Object} LoggerOptions
 *  @property {T} mode
 *  Mode in which you'r programm are currently running, for example "dev" or "prod".
 *  @property {LoggerStyleOptions} [styles]
 *  Options for styling log messages and prefixes.
 *  @property {LoggerFileOptions} [file]
 *  Options for file logging.
 */

/**
 *  @template T
 */
export default class Logger {
  /**
   *  @param {LoggerOptions<T>} options 
   */
  constructor(options) {
    this.options = options;

    if(options.file?.dirPath && !isPathExistsSync(options.file.dirPath)) {
      fsSync.mkdir(options.file.dirPath, (error) => {
        if(error) {
          throw new Error(error.message);
        }
      });
    }
  }
  /**
   *  @returns {Colorizer}
   */
  static colorizer() {
    return new Colorizer();
  };
  /**
   *  @param {Iterable<T>} modes
   *  returns {Logger}
   */
  in(modes) {
    this.#currModes = new Set(modes);
    return this;
  };

  console = {
    /**
     *  @param {string} message
     *  @param {any[]} date
     *  @returns {void}
     */
    info: (message, ...data) => {
      if(this.#shouldLog()) {
        this.#intoConsole(STRING.LOG_LEVEL.INFO, message, data);
      }

      this.#currModes = undefined;
    },
    /**
     *  @param {string} message
     *  @param {any[]} date
     *  @returns {void}
     */
    warn: (message, ...data) => {
      if(this.#shouldLog()) {
        this.#intoConsole(STRING.LOG_LEVEL.WARN, message, data);
      }

      this.#currModes = undefined;
    },
    /**
     *  @param {string} message
     *  @param {any[]} date
     *  @returns {void}
     */
    error: (message, ...data) => {
      if(this.#shouldLog()) {
        this.#intoConsole(STRING.LOG_LEVEL.ERROR, message, data);
      }

      this.#currModes = undefined;
    }
  };

  file = {
    /**
     *  @param {string} message
     *  @param {any[]} date
     *  @returns {Promise<void>}
     */
    info: async (message, ...data) => {
      if(this.#shouldLog()) {
        await this.#intoFile(STRING.LOG_LEVEL.INFO, message, data);
      }

      this.#currModes = undefined;
    },
    /**
     *  @param {string} message
     *  @param {any[]} date
     *  @returns {Promise<void>}
     */
    warn: async (message, ...data) => {
      if(this.#shouldLog()) {
        await this.#intoFile(STRING.LOG_LEVEL.WARN, message, data);
      }

      this.currModes = undefined;
    },
    /**
     *  @param {string} message
     *  @param {any[]} date
     *  @returns {Promise<void>}
     */
    error: async (message, ...data) => {
      if (this.#shouldLog()) {
        await this.#intoFile(STRING.LOG_LEVEL.ERROR, message, data);
      }

      this.#currModes = undefined;
    }
  }
  /**
   *  @type {LoggerOptions<T>}
   */
  #options = undefined;
  /**
   *  @type {Set<T> | undefined}
   */
  #currModes = undefined;
  /**
   *  @returns {boolean}
   */
  #shouldLog() {
    return !this.#currModes || this.#currModes?.has(this.#options.mode);
  };
  /**
   *  @param {string} level
   *  @param {string} message
   *  @param {any[]} data 
   */
  async #intoFile(level, message, data) {
    if(!this.options?.file?.dirPath) {
      throw new TypeError(`The "fileOptions.dirPath" is typeof ${typeof this.options?.file?.dirPath} but must be string!`);
    }

    const { file } = this.options;

    const fileName = createFileName();
    const formatted = this.#formatFileMessage(level, message, data);
    const filePath = `${file.dirPath}/${fileName}.txt`;

    if(!(await isPathExists(filePath))) {
      await fsAsync.writeFile(filePath, formatted, { encoding: "ascii" });
    } else {
      await fsAsync.appendFile(filePath, formatted, { encoding: "ascii" });
    }
  }

  /**
   *  @param {string} level
   *  @param {string} message
   *  @param {any[]} data 
   *  @returns {void}
   */
  #intoConsole(level, message, data) {
    const formatted = this.#formatConsoleMessage(level, message);

    switch(level) {
      case STRING.LOG_LEVEL.ERROR:
        console.error(formatted, ...data);
      break;
      case STRING.LOG_LEVEL.WARN:
        console.warn(formatted, ...data);
      break;
      case STRING.LOG_LEVEL.INFO:
        console.info(formatted, ...data);
      break;
    }
  }
  /**
   *  @param {string} level
   *  @param {string} message
   *  @returns {string}
   */
  #formatConsoleMessage(level, message) {
    return `${this.#colorize(level, this.#parseLogFormat(level))} ${message}`;
  };
  /**
   *  @param {string} level
   *  @param {string} message
   *  @param {any[]} data
   *  @returns {string}
   */
  #formatFileMessage(level, message, data) {
    let logMessage = `${this.#parseLogFormat(level)} ${message} `;
    
    const { file } = this.options;

    for(let index = 0; index < data.length; index++) {
      if(isObject(data[index]) || isArray(data[index])) {
        logMessage += JSON.stringify(data[index], null, file.formattingSpace);
      } else if(data[index]?.toString) {
        logMessage += data[index].toString();
      } else {
        logMessage += data[index];
      }
    }

    logMessage += "\n";

    return logMessage;
  };
  /**
   *  @param {string} level
   *  @param {string} message 
   */
  #colorize(level, message) {
    const { styles } = this.options;

    if(!styles.colors) {
      return message;
    }

    switch (level) {
      case STRING.LOG_LEVEL.ERROR:
        if(styles.colors.error) {
          return styles.colors.error.text(message);
        }
      
        return message;
      case STRING.LOG_LEVEL.INFO:
        if(styles.colors.info) {
          return styles.colors.info.text(message);
        }

        return message;
      case STRING.LOG_LEVEL.WARN:
        if(styles.colors.warn) {
          return styles.colors.warn.text(message);
        }

        return message;
      default:
        return message;
    }
  }
  /**
   *  @param {string} [level=""]
   *  @returns {string}
   */
  #parseLogFormat(level = "") {
    REGEXP.TOKENS.lastIndex = 0

    const date = createTimeString();
    const format = this.options?.styles?.format;

    if(!format) {
      return `[${level} ${date}]:`;
    }

    let parsed = "";

    while(REGEXP.TOKENS.lastIndex < format.length) {
      if(isAlphabetic(format[REGEXP.TOKENS.lastIndex])) {
        const match = REGEXP.TOKENS.exec(format);

        if(match?.at(0)) {
          const value = match[0];

          switch(value) {
            case "lvl":
              parsed += level;
              break;
            case "hh":
              parsed += `${date[0]}${date[1]}`;
              break;
            case "mm":
              parsed += `${date[3]}${date[4]}`;
              break;
            case "ss":
              parsed += `${date[6]}${date[7]}`;
              break;
            case "tt":
              parsed += `00`;
              break;
          }
        } else {
          console.warn(`[Logger.js ${pckg.version}]: Unknown token ${format[REGEXP.TOKENS.lastIndex]} on col ${REGEXP.TOKENS.lastIndex}!`);
          REGEXP.TOKENS.lastIndex++;
        }
      } else {
        parsed += format[REGEXP.TOKENS.lastIndex];
        REGEXP.TOKENS.lastIndex++;
      }
    }

    return parsed;
  }
}

