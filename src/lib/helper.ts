import {Logger} from 'tslog';

export function isBaseEnvironment(parsedArgs: any): boolean {
    return parsedArgs.environment.toLowerCase() == '__base__';
}

export function verboseParameters(logger: Logger, parsedArgs: any) {
    Object.keys(parsedArgs).forEach(key => {
        logger.info(`Key: ${key} ==> Value: ${parsedArgs[key]}`)
    })
}
