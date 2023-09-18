const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (config) => {
      // ts-loader is required to reference external typescript projects/files (non-transpiled)
      config.module.rules.push({
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: "tsconfig.json",
        },
      });
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /Configure maximumFileSizeToCacheInBytes to change this limit/,
      ];
      config.resolve.fallback = {
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert/"),
      };
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      ]);
      return config;
    },
  },
  babel: {
    presets: ["@babel/preset-react"],
  },
};
