/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import glob from 'glob'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import {
  app,
  shell,
  BrowserWindow,
  Menu,
  MenuItem,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
} from 'electron'

let win: BrowserWindow | null = null
let settingsWin: BrowserWindow | null = null

function loadWindow(browserWindow: BrowserWindow, route = '') {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    browserWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/${route}`)
    // if (!process.env.IS_TEST) browserWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    browserWindow.loadURL(`app://./index.html#${route}`)
  }
}

function createSettingsWindow(): BrowserWindow {
  settingsWin =
    settingsWin ||
    new BrowserWindow({
      width: 600,
      height: 400,
      webPreferences: {
        nodeIntegration: true,
      },
    })

  loadWindow(settingsWin, 'settings')

  settingsWin.on('closed', () => {
    settingsWin = null
    if (win) {
      win.reload()
    }
  })
  return settingsWin
}

export function createWindow(): BrowserWindow {
  win = new BrowserWindow({
    transparent: true,
    backgroundColor: '#00FFFFFF',
    width: 800,
    height: 600,
    frame: false,
    hasShadow: false,
    type: 'desktop',
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.maximize()

  loadWindow(win)

  win.on('closed', () => {
    win = null
  })
  return win
}

export function destroyMenu(appIcon: Tray) {
  appIcon.destroy()
}

export async function createMenu(win: BrowserWindow) {
  const widgetsFolderPath = path.resolve(__dirname, '../src/widgets')
  const faviconPath = path.resolve(__dirname, '../src/assets/favicon-16x16.png')
  const appIcon = new Tray(nativeImage.createFromPath(faviconPath))
  const widgets = glob.sync(`${widgetsFolderPath}/**/*.widget.vue`)

  const template = [
    {
      label: 'About Vuebersicht',
      click() {
        app.showAboutPanel()
        app.focus()
      },
    },
    { type: 'separator' },

    // widgets
    { label: 'Widgets', enabled: false },
    ...widgets.map((widgetPath: string) => {
      const name = widgetPath.split('/').pop()
      const menuItem = {
        label: name,
        submenu: [
          {
            label: 'Edit Widget',
            click() {
              shell.openPath(widgetPath)
            },
          },
          { type: 'separator' },
          {
            label: 'Hide widget',
            type: 'checkbox',
            checked: false,
            click(e: MenuItem) {
              win.webContents.send('data', {
                type: 'updateWidget',
                path: widgetPath,
                visible: !e.checked,
              })
            },
          },
        ],
      }
      return menuItem
    }),
    { type: 'separator' },

    // utils
    {
      label: 'Open Widgets Folder',
      click() {
        const widgetsFolderPath = path.resolve(__dirname, '../src/widgets')
        shell.openPath(widgetsFolderPath)
      },
    },
    {
      label: 'Refresh All Widgets',
      click() {
        win.reload()
      },
    },
    {
      label: 'Settings',
      click() {
        createSettingsWindow()
      },
    },
    {
      label: 'Open Dev Tools',
      click() {
        win.webContents.openDevTools({ mode: 'detach' })
        win.focus()
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Vuebersicht',
      click() {
        app.quit()
      },
    },
  ]

  const contextMenu = Menu.buildFromTemplate(template as [MenuItemConstructorOptions])

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
  return appIcon
}

export function sleep(duration: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration))
}
