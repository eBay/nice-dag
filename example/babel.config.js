module.exports = function(api) {
  const presets = ['react-app'];
  const plugins = [];
  if (api.env('development')) {
    plugins.push('react-hot-loader/babel');
  }
  plugins.push('@babel/plugin-proposal-optional-chaining');
  return { presets, plugins };
};
