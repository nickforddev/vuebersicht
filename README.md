# Vuebersicht

Inspired by [Uebersicht](https://github.com/felixhageloh/uebersicht), built with Vue, Electron, & TypeScript.

Add custom widgets to your desktop background, built as Vue single-file components, either in TypeScript or JavaScript.

![Vuebersicht](./screenshots/vs-menu.jpg)

Comes with an Uebersicht-like menu

![Vuebersicht Vue Dev Tools](./screenshots/vs-devtools.jpg)

...and Chromium / Vue Dev Tools

## Widgets

Widgets are automatically imported from the `./src/widgets` directory, each widget should follow the file naming convention of `<foo>.widget.vue`. You may construct widgets using multiple Vue components, and nest `.widget.vue` files in directories, just make sure the root component of the widget has a filename ending in `.widget.vue`, and child components do not.

- [Vue Single File Components docs](https://vuejs.org/v2/guide/single-file-components.html)
- [Vue TypeScript Class-Style Component docs](https://class-component.vuejs.org/)

## Settings

There is a Settings panel in the Vuebersicht toolbar that allows you to change the primary color used by widgets.

![Vuebersicht Custom Color](./screenshots/vs-custom-color.jpg)
![Vuebersicht Custom Color](./screenshots/vs-custom-color-2.jpg)

## Utilities

### `run(command)`

- Decription: Run a shell command asynchronously.
- Params: `command: string`
- Returns: `Promise<stdout|stderr>`

example:

```js
import { run } from '@/utils'

...
  try {
    const stdout = await run('ls -la')
    console.log(stdout)
  } catch(stderr) {
    throw stderr
  }
```

### `sleep(milliseconds)`

- Description: Wait for an aribitrary amount of time asynchronously.
- Params: `milliseconds: number`
- Returns: `Promise<void>`

example:

```js
import { sleep } from '@/utils'

...
  await sleep(1000) // wait for 1 sec
  foo()
```

## Limitations

This is still just experimental. Because of the nature of nature of the current build tooling, I haven't yet found a way to enable some important features of the original [Uebersicht](https://github.com/felixhageloh/uebersicht) application, hot-reloading in production builds, for instance. For now, it is recommended to run this experimental application in development mode.

I have yet to really test for OS support (other than MacOS), though I hear that it does work in Ubuntu at least. If you have time to test in your environment please open an issue if it does not run, and I'll look into supporting it.

## Project setup

```bash
yarn install # or npm install
```

### API keys

Vuebersicht currently ships with a Weather widget that uses 2 APIs, Google Geocoder API (for getting your approximate location), and OpenWeatherMap API (to get local weather data for that location). You'll need to create these API keys and add them to an untracked file called `.env.local`, in the root directory of the project:

```js
GOOGLE_API_KEY = "<google geocoder api key>"
WEATHER_API_KEY = "<openweathermap api key>"
```

- [Create a Google Geocoder API key](https://developers.google.com/maps/documentation/geocoding/get-api-key)
- [Create an OpenWeatherMap API key](https://openweathermap.org/appid)

### Start the application

```bash
yarn serve # or npm run serve
```

<!-- ### Production build

```bash
yarn build
```

### Run unit tests

```bash
yarn test:unit
``` -->

### Lints and fixes files

```bash
yarn lint # or npm run lint
```

#### Thanks

Major shoutout to [@felixhageloh](https://github.com/felixhageloh) for his amazing work on [Uebersicht](https://github.com/felixhageloh/uebersicht), which is an incredible project that I find both inspiring and humbling. Vuebersicht is in no way meant to be a competitor or a replacement for Uebersicht, if anything it is intended to be a modest tribute to the original, an experimental toy project.

Core libraries used to make this possible:

- [TypeScript](https://github.com/microsoft/TypeScript)
- [Electron](https://github.com/electron/electron)
- [Vue.js](https://github.com/vuejs/vue)
- [Webpack](https://github.com/webpack/webpack)

And others used to build some of the widgets:

- [chart.js](https://github.com/chartjs/Chart.js)
- [v-calendar](https://github.com/nathanreyes/v-calendar)
- [vue-weather-widget](https://github.com/dipu-bd/vue-weather-widget)
