/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import sane, { Watcher } from 'sane'
import { app, BrowserWindow, Display, powerMonitor, protocol, screen, Tray } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { createWindow, destroyMenu, createMenu, sleep } from './electron/utils'
// import pkg from '../package.json'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let allWindows: BrowserWindow[] = []
let appIcon: Tray | null
let watcher: Watcher | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  const internalDisplayWindow = allWindows[0]
  if (internalDisplayWindow === null) {
    allWindows[0] = createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await sleep(200) // hack to fix transparent background in some linux desktop environments
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  const displays = screen.getAllDisplays()
  const internalDisplays: Display[] = []
  const externalDisplays: Display[] = []

  displays.forEach(display => {
    const isExternalDisplay = display.bounds.x !== 0 || display.bounds.y !== 0
    if (isExternalDisplay) {
      externalDisplays.push(display)
    } else {
      internalDisplays.push(display)
    }
  })

  allWindows = [
    ...internalDisplays.map(createWindow),
    ...externalDisplays.map(externalDisplay => createWindow(externalDisplay)),
  ]

  const widgetsFolderPath = path.resolve(__dirname, '../src/widgets')
  const iconPath = path.resolve(__dirname, '../src/assets/logo.png')

  app.setAboutPanelOptions({
    applicationName: 'Vuebersicht',
    // applicationVersion: pkg.version,
    iconPath,
  })
  app.dock.hide()

  const internalDisplayWindow = allWindows[0]
  appIcon = await createMenu(internalDisplayWindow)

  // we need to refresh the tray menu when widgets are added or removed
  watcher = sane(widgetsFolderPath, { glob: ['**/*.widget.vue'] })
  watcher
    .on('add', async () => {
      destroyMenu(appIcon as Tray)
      appIcon = await createMenu(internalDisplayWindow as BrowserWindow)
    })
    .on('delete', async () => {
      destroyMenu(appIcon as Tray)
      appIcon = await createMenu(internalDisplayWindow as BrowserWindow)
    })
  powerMonitor.on('resume', () => {
    ;(internalDisplayWindow as BrowserWindow).reload()
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
