# Create Stencil

> Note that you will need to use npm 6 or higher.

Run:

```
npm i -g npm
```

To install latest version of `npm`

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
npm init stencil app my-stencil-app
```

### Using a proxy

If you are behind a proxy, configure `https_proxy` environment variable. Additionally, if you are self-hosting a repository, you can set `STENCIL_DOWNLOAD_URL=https://your-on-prem-registry.com` in your npm config (`.npmrc`) file to download the starter app from this registry. The default is `https://github.com`.

## Built-in starters

- [app](https://github.com/ionic-team/stencil-app-starter)
- [components](https://github.com/ionic-team/stencil-component-starter)
- [ionic-pwa](https://github.com/ionic-team/ionic-pwa-toolkit)

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
* [Stencil Worldwide Slack](https://stencil-worldwide.slack.com)
* [Ionic](https://ionicframework.com/)
* [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/)
* [Ionicons](http://ionicons.com/)


## License
* MIT
