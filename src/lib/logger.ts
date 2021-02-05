import { ISettingsParam, Logger } from 'tslog';

const loggerConfig: ISettingsParam = {
    dateTimeTimezone: 'Europe/Berlin',
    //dateTimePattern: 'day.month.year hour:minute:second.millisecond',
    displayFunctionName: false,
    displayFilePath: 'hidden',
};

export function getLogger(name: string) {
    const conf: ISettingsParam = {
        name: name,
    };

    return new Logger({ ...loggerConfig, ...conf });
}
