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
                    'backbone',
                    'font awesome',
                    'lodash',
                ],
                default: [
                    'font awesome',
                    'lodash'
                ]
            }
        ];

        this.prompt(prompts, function (props) {
            this.projectName = props.projectName;
            this.backbone = isChecked('backbone', props.modules);
            this.font_awesome = isChecked('font awesome', props.modules);
            this.lodash = isChecked('lodash', props.modules) || this.backbone;

            done();
        }.bind(this));
    },

    app: function () {
        this.mkdir('layout/img');
        this.mkdir('layout/jade/base')
        this.mkdir('layout/js')
        this.mkdir('layout/less')
        this.mkdir('layout/mockup')

        this.template('layout/jade/base/base.jade', 'layout/jade/base/base.jade');
        this.template('layout/jade/index.jade', 'layout/jade/index.jade');
        this.template('layout/js/script.js', 'layout/js/script.js');
        this.template('layout/js/_config.js', 'layout/js/_config.js');
        this.template('layout/js/_modernizr.js', 'layout/js/_modernizr.js');
        this.template('layout/less/const.less', 'layout/less/const.less');
        this.template('layout/less/mixin.less', 'layout/less/mixin.less');
        this.template('layout/less/style.less', 'layout/less/style.less');
        this.template('layout/content.json', 'layout/content.json');

        this.template('_bowerrc', '.bowerrc');
        this.template('_editorconfig', '.editorconfig');
        this.template('_gitignore', '.gitignore');
        this.template('_jshintrc', '.jshintrc');
        this.template('_tern-project', '.tern-project');

        this.template('bower.json', 'bower.json');
        this.template('fabfile.py', 'fabfile.py');
        this.template('fabconf.json', 'fabconf.json');
        this.template('gulpfile.js', 'gulpfile.js');
        this.template('nginx.conf', 'nginx.conf');
        this.template('package.json', 'package.json');
    }
});

module.exports = VpStaticGenerator;
