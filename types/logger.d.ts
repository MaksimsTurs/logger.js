import Colorizer from "@maksims/colorizer.js";

export default Logger;
declare class Logger<T extends string | number> {
  constructor(options: LoggerOptions<T>)

  static colorizer(): Colorizer

  in(modes: Iterable<T>): Logger<T>
  
  console: LogWrappers<void>
  file: LogWrappers<Promise<void>>
}

type LogWrappers<R = any> = {
  info: (message: string, ...data: any[]) => R
  warn: (message: string, ...data: any[]) => R
  error: (message: string, ...data: any[]) => R
};

type LoggerFileOptions = {
  dirPath: string
  formattingSpace?: number
};

type LoggerPrefixStyleOptions = {
  info?: Colorizer
  warn?: Colorizer
  error?: Colorizer
};

type LoggerStyleOptions = {
  format?: string
  colors?: LoggerPrefixStyleOptions
};

type LoggerOptions<T extends string | number> = {
  mode: T
  styles?: LoggerStyleOptions
  file?: LoggerFileOptions
};
