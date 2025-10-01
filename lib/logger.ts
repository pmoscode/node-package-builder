import { Logger } from 'tslog';
import { ILogObj } from 'tslog/types/interfaces';

/**
 * Instantiates the Logger for a given name. The name is usually the class name, so that it makes it easier to debug the code.
 *
 * @param name Name of the instantiated logger
 */
export function getLogger(name: string) {
    return new Logger<ILogObj>({
        name: name,
    });
}
