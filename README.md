# Create Stencil

> Note that you will need to use npm 6 or higher.

Run:

```
npm i -g npm
```

To install latest version of `npm`

## Starters

The create-stencil CLI offers the following starters for bootstrapping your project:

- `component` - allows one to spin up a component library containing one or more Stencil components. Best suited for
teams/individuals looking to reuse components across one or more applications.
- `app` - allows one to spin up an application, complete with routing. This is a **community-driven** project,
and is not formally owned by the Stencil team
- `ionic-pwa` - allows one to spin up an Ionic PWA, complete with tabs layout and routing. This is a **community-driven** project.

## Usage


### Interactive mode

```
npm init stencil
```

### Command mode

```
npm init stencil <starter> <projectName>
```

Example:

```
npm init stencil component my-stencil-library
```

### Using a proxy

If you are behind a proxy, configure `https_proxy` environment variable.

## Built-in starters

- [app (community-maintained)](https://github.com/stencil-community/stencil-app-starter)
- [ionic-pwa (community-maintained)](https://github.com/stencil-community/stencil-ionic-starter)
- [component](https://github.com/ionic-team/stencil-component-starter)

## Developing locally

If you want to add features, clone this repo, open terminal:

#### Install dependencies

```bash
npm install
```

Then, compile and run the starter:

```bash
npm run dev
```

And it will help you test out your changes.


## Citations

Created by William M. Riley:
* [Twitter](https://twitter.com/splitinfinities)
* [Github](https://github.com/splitinfinities)


## Related

* [Stencil Documentation](https://stenciljs.com/)
* [Ionic](https://ionicframework.com/)
* [Ionic Discord](https://ionic.link/discord)
* [Ionicons](http://ionicons.com/)


## License
* MIT
