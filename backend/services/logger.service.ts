import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class LoggerService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private _output: Function;
  private collelationObj: any;

  constructor() {
    // eslint-disable-next-line no-console
    this._output = console.log;
  }

  setCorrelationId(correlationObject: any): void {
    this.collelationObj = correlationObject;
  }

  // The log() function is an alias to allow our Logger class to be used as a logger for AWS sdk calls
  log(message: string, data?: any, className?: string, correlationObject?: any): void {
    this.writeLog("info", message, data, className, correlationObject);
  }

  error(message: string, data?: any, className?: string, correlationObject?: any): void {
    this.writeLog("error", message, data, className, correlationObject);
  }

  info(message: string, data?: any, className?: string, correlationObject?: any): void {
    this.writeLog("info", message, data, className, correlationObject);
  }

  debug(message: string, data?: any, className?: string, correlationObject?: any): void {
    this.writeLog("debug", message, data, className, correlationObject);
  }

  trace(message: string, data?: any, className?: string, correlationObject?: any): void {
    this.writeLog("trace", message, data, className, correlationObject);
  }

  writeLog(level: string, message: string, data?: any, className?: string, correlationObject?: any): void {
    let dataOutput = data ?? {};
    if (dataOutput instanceof Error) {
      // Improved serialization for Error objects
      dataOutput = "Error message: " + dataOutput.message + "; Stack: " + dataOutput.stack;
    } else {
      try {
        // Ensure that we CAN JSON.stringify data objects, but don't do it yet
        JSON.stringify(dataOutput);
      } catch (jsonError) {
        // squealch stringify errors so that we can output the original log message
        dataOutput = "Unable to serialize error data";
      }
    }

    const outObject = {
      level: level,
      message: message,
      data: dataOutput,
      timestamp: new Date().toISOString(),
      location: className,
      correlationObject:
        correlationObject === undefined || Object.keys(correlationObject).length === 0 ? this.collelationObj : correlationObject
    };

    let outString: string;
    try {
      outString = JSON.stringify(outObject);
    } catch (err) {
      outString = `{"level":"error","message":"Error trying to serialize for logs; ${err}"}`;
    }

    this._output(outString);
  }
}
