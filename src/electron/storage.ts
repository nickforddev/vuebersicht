// // eslint-disable-next-line import/no-extraneous-dependencies
// import electron from 'electron'
// import path from 'path'
// import fs from 'fs'

// interface Options {
//   configName: string
//   defaults: Record<string, unknown>
// }

// function parseDataFile(filePath: string, defaults: unknown) {
//   try {
//     return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
//   } catch (error) {
//     return defaults
//   }
// }

// class Store {
//   path: string
//   data: Record<string, unknown>

//   constructor(opts: Options) {
//     const userDataPath = (electron.app || electron.remote.app).getPath('userData')
//     this.path = path.join(userDataPath, `${opts.configName}.json`)
//     this.data = parseDataFile(this.path, opts.defaults)
//   }

//   get(key: string) {
//     return this.data[key]
//   }

//   set(key: string, val: unknown) {
//     this.data[key] = val
//     fs.writeFileSync(this.path, JSON.stringify(this.data))
//   }
// }

// export default Store
