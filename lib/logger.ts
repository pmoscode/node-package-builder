import { ISettingsParam, Logger } from 'tslog';

/**
 * The logger configuration
 */
const loggerConfig: ISettingsParam = {
    dateTimeTimezone: 'Europe/Berlin',
    displayFunctionName: false,
    displayLoggerName: false,
    displayFilePath: 'hidden',
};

/**
 * Instantiates the Logger for a given name. The name is usually the class name, so that it makes it easier to debug the code.
 *
 * @param name Name of the instantiated logger
 */
export function getLogger(name: string) {
    const conf: ISettingsParam = {
        name: name,
    };

    return new Logger({ ...loggerConfig, ...conf });
}
