# The Node Package Builder

![Pipeline](https://gitlab.com/pmoscode/node-package-builder/badges/master/pipeline.svg)
![coverage](https://gitlab.com/pmoscode/node-package-builder/badges/master/coverage.svg)

This simple helper gets handy if you have to manage multiple package.json versions in one Node project.

So, why would you need that? For example if you have an application, module or ... and you need to run it on different
architectures, like amd64, armV6, armV7, ... or you have multiple targets (native, cloud foundry, ...)

With NPB you can easily manage these challenges.

## Installation

Local installation:

```
npm install @pmoscode/node-package-builder
``` 

or

```
yarn add @pmoscode/node-package-builder --dev
```

Global installation:

```
npm install -g @pmoscode/node-package-builder
```

or

```
yarn global add @pmoscode/node-package-builder
```

## Example

**package.json**

Let's take this as an example:

```json
{
  "name": "my-app",
  "scripts": {
    "start": "node app.js",
    "test": "jest"
  },
  "version": "0.0.1",
  "engines": {
    "node": "0.8.x"
  },
  "license": "MIT"
}
```

**cf.json**

Here an example for an imaginary cloud foundry change (place it in "envs" folder):

```json
{
  "name": "cf-app",
  "subdomain": "myapp-cf",
  "scripts": {
    "start": "node app.js --some-parameters"
  },
  "dependencies": {
    "something-cf-specific": "1.0.3"
  }
}
```

After run (from the root of your project)

```
npb cf
```

you will get a modified **package.json**:

```json
{
  "name": "cf-app",
  "scripts": {
    "start": "node app.js --some-parameters",
    "test": "jest"
  },
  "version": "0.0.1",
  "engines": {
    "node": "0.8.x"
  },
  "license": "MIT",
  "dependencies": {
    "something-cf-specific": "1.0.3"
  }
}
```

## Restore original

When you run npb, it will create a backup of the original package.json. To restore this one, just run

```
npb
```

## CLI parameters

| Short  | Long  | Description  | Default  |
| --- | --- | --- | --- |
| --  | environment | The name of the environment to apply to package.json | \_\_reset__ (to restore the original package.json)  |
| -e | --env-dir | path to environment files | envs |
| -d | --dry-run | Shows only the result. No modification of package.json done | false |
| -b | --backup-name | Name of the package.json backup file. Restored when calling without any environment | .package.json  |
| -i | --include-environment | Inserts a field into the modified package.json which contains the used environment | false |
| -r | --replace | Replaces the package.json instead of a merge. For this, the environment package.json has to be complete. | false |
| -v | --verbose | Select level of verbosity (max: 2) | 0 |
| -- | --version | Shows current version | -- |

## Code documentation

Here you can find the Code documentation:
https://pmoscode.gitlab.io/node-package-builder/
