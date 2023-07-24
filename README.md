# The create-stencil CLI

create-stencil is a CLI for creating new Stencil projects based on predefined templates, or "starters".
It is the official CLI maintained by the Stencil team, and is recommended for all new projects.

## Prerequisites

The create-stencil CLI requires `npm` version 6 or higher to be installed.
For instructions for installing or upgrading npm, please see the [npm Documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). 

## Starters

The create-stencil CLI offers the following starters for bootstrapping your project:

- `component` - allows one to spin up a component library containing one or more Stencil components. Best suited for
teams/individuals looking to reuse components across one or more applications. ([Source Code](https://github.com/ionic-team/stencil-component-starter))
- `app` - allows one to spin up an application, complete with routing. This is a **community-driven** project,
and is not formally owned by the Stencil team. ([Source Code](https://github.com/stencil-community/stencil-app-starter))
- `ionic-pwa` - allows one to spin up an Ionic PWA, complete with tabs layout and routing. This is a **community-driven** project,
and is not formally owned by the Stencil team. ([Source Code](https://github.com/stencil-community/stencil-ionic-starter))

## Usage

The create-stencil CLI can be run in one of two modes - Interactive Mode or Command Mode.

### Interactive Mode

Interactive Mode allows a user to interactively select options for creating a new Stencil project.
create-stencil can be started in Interactive Mode by running:
```console
$ npm init stencil
```

Running the CLI in Interactive Mode on your machine will ask you which starter you'd like to use:
```console
$ npm init stencil

✔ Select a starter project.

Starters marked as [community] are developed by the Stencil Community,
rather than Ionic. For more information on the Stencil Community, please see
https://github.com/stencil-community › - Use arrow-keys. Return to submit.
❯   component                Collection of web components that can be used anywhere
    app [community]          Minimal starter for building a Stencil app or website
    ionic-pwa [community]    Ionic PWA starter with tabs layout and routes
```

Followed by a name for your new project:
```console
✔ Project name > my-stencil-library
```

After confirming your selections, your project will be created.
In this example, new component library starter will have been created in a newly created `my-stencil-library` directory:
```console
✔ Confirm? … yes
✔ All setup  in 29 ms

  We suggest that you begin by typing:

  $ cd my-stencil-library
  $ npm install
  $ npm start

  You may find the following commands will be helpful:

  $ npm start
    Starts the development server.

  $ npm run build
    Builds your project in production mode.

  $ npm test
    Starts the test runner.


  Further reading:

   - https://github.com/ionic-team/stencil-component-starter
   - https://stenciljs.com/docs

  Happy coding! 🎈
```

### Command Mode

Command Mode allows you to create a new Stencil project by specifying all project options upfront.

To run the CLI in Command Mode, a starter and project name must be specified:
```
npm init stencil [starter] [project-name]
```

An example of creating a component starter with the name "my-stencil-library" is shown below:
```
npm init stencil component my-stencil-library
```
In the example above, new component library starter will have been created in a newly created `my-stencil-library` directory:

### Additional Flags

**Note:** When passing flags to the create-stencil CLI, a double dash ('--') must be placed between `npm init stencil`
and the flag(s) passed to the CLI:
```console
$ npm init stencil -- --help
```

#### `--help`, `-h`

The `--help` flag shows usage examples for the CLI.

#### `--info`

The `--info` will print the current version of the CLI.

### Environment Variables

#### `https_proxy`

If you are behind a proxy, the `https_proxy` environment variable can be set when running the CLI:
```console
$ https_proxy=https://[IP_ADDRESS] npm init stencil
```

Stencil uses [https-proxy-agent](https://github.com/TooTallNate/proxy-agents/tree/main/packages/https-proxy-agent)
under the hood to connect to the specified proxy server.
The value provided for `https_proxy` will be passed directly to the constructor for a new
[`HttpsProxyAgent` instance](https://github.com/TooTallNate/proxy-agents/tree/main/packages/https-proxy-agent#api).

## Citations

Original project was created by William M. Riley:
* [Twitter](https://twitter.com/splitinfinities)
* [Github](https://github.com/splitinfinities)

## Related Links

* The [Stencil Documentation](https://stenciljs.com/) site has more information on using Stencil.
* Check out the [Stencil Discord](https://chat.stenciljs.com/) for help and general Stencil discussion!
