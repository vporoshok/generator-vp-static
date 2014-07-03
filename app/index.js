'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var VpStaticGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous VpStatic generator!'));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What is the project name?'
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('src');
    this.mkdir('images');

    this.template('_bower.json', 'bower.json');
    this.template('_gulpfile.js', 'gulpfile.js');
    this.template('_index.jade', 'src/index.jade');
    this.template('_layout.jade', 'src/layout.jade');
    this.template('_mixin.less', 'src/mixin.less');
    this.template('_package.json', 'package.json');
    this.template('_script.js', 'src/script.js');
    this.template('_style.less', 'src/style.less');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = VpStaticGenerator;
