'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var isChecked = function (key, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === key) return true;
    }
    return false;
}

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

        var prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'What is the project name?'
            }, {
                type: 'checkbox',
                name: 'modules',
                message: 'What additional modules include?',
                choices: [
                    'bootstrap',
                    'backbone'
                ],
                default: [
                    'bootstrap'
                ]
            }
        ];

        this.prompt(prompts, function (props) {
            this.projectName = props.projectName;
            this.bootstrap = isChecked('bootstrap', props.modules);
            this.backbone = isChecked('backbone', props.modules);

            done();
        }.bind(this));
    },

    app: function () {
        this.mkdir('layout');
        this.mkdir('layout/images');
        this.mkdir(this.projectName)

        this.template('_bower.json', 'bower.json');
        this.template('_gulpfile.js', 'gulpfile.js');
        this.template('_index.jade', 'layout/index.jade');
        this.template('_base.jade', 'layout/base/base.jade');
        this.template('_mixin.less', 'layout/mixin.less');
        this.template('_package.json', 'package.json');
        this.template('_script.js', 'layout/script.js');
        this.template('_style.less', 'layout/style.less');
    },

    projectfiles: function () {
        this.copy('tern-project', '.tern-project');
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
    }
});

module.exports = VpStaticGenerator;
