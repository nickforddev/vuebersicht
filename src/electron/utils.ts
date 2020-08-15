/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import glob from 'glob'
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
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

export function createWindow(): BrowserWindow {
  let win: BrowserWindow | null = new BrowserWindow({
    transparent: true,
    backgroundColor: '#00FFFFFF',
    width: 800,
    height: 600,
    frame: false,
    // movable: false,
    // minimizable: false,
    // maximizable: false,
    hasShadow: false,
    type: 'desktop',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      nodeIntegration: true,
    },
  })
  // win.setIgnoreMouseEvents(true)
  win.maximize()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

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
