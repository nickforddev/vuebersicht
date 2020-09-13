// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const webpack = require('webpack')

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /node_modules\/axios/,
          resolve: { aliasFields: ['axios'] },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
          WEATHER_API_KEY: JSON.stringify(process.env.WEATHER_API_KEY),
        },
      }),
    ],
  },
}
