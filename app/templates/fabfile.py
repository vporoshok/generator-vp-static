#!/usr/bin/env
# -*- coding: utf-8 -*-

from fabric.api import env, cd, put, sudo
from fabric.contrib.project import rsync_project

try:
    from gntp.notifier import mini as note

except ImportError:
    def note(*args):
        pass


dest = '/srv/www'
name = '<%= _.slugify(projectName) %>'

env.hosts = ['home.vprshk.ru:10322']


def install():
    with cd('/etc/nginx/sites-available'):
        put('nginx.conf', name, use_sudo=True)

    sudo('ln -s /etc/nginx/sites-available/%s /etc/nginx/sites-enabled/'
         % name)
    sudo('service nginx reload')


def deploy():
    rsync_project(('/srv/www/%s' % name), '<%= _.slugify(projectName) %>/')

    note('logcol WUI deployed')
