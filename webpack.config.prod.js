const path = require('path');
const { getConfig } = require('./webpack.common');

module.exports = env => {

  env = env || {};
  console.log('env=', env);

  return getConfig({
    appName: 'main_app',
    env: 'prod',
    prodPath: path.resolve('../../backend/public/assets/main_app'),
    prodPublicPath: '/assets/main_app/'
  });
};