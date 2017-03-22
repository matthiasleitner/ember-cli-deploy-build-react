/* jshint node: true */
'use strict';

var Promise = require('ember-cli/lib/ext/promise');
var glob  = require('glob');
var DeployPluginBase = require('ember-cli-deploy-plugin');
var path = require('path');
const execSync = require('child_process').execSync;

module.exports = {
  name: 'ember-cli-deploy-build-react',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        environment: 'production',
        outputPath: 'tmp' + path.sep + 'deploy-dist'
      },

      build: function(context) {
        var self       = this;
        var outputPath = this.readConfig('outputPath');

        console.log(options, buildEnv)
        const buildCommand = this.readConfig('buildCommand');
        console.log(buildCommand);

        execSync(buildCommand);
        return this._logSuccess(outputPath).then(function(files) {
            files = files || [];

            return {
              distDir: outputPath,
              distFiles: files
            };
          })
          .catch(function(error) {
            self.log('build failed', { color: 'red' });
            return Promise.reject(error);
          });

      },
      _logSuccess: function(outputPath) {
        var self = this;
        var files = glob.sync('**/**/*', { nonull: false, nodir: true, cwd: outputPath });

        if (files && files.length) {
          files.forEach(function(path) {
            self.log('✔  ' + path, { verbose: true });
          });
        }
        self.log('build ok', { verbose: true });

        return Promise.resolve(files);
      }
    });
    return new DeployPlugin();
  }
};
