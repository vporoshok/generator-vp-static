#!/usr/bin/env
# -*- coding: utf-8 -*-

import json

from ftplib import FTP

from fabric import colors
from fabric.api import task, roles, env, cd, put, sudo
from fabric.contrib.project import rsync_project

try:
    from gntp.notifier import mini as note

except ImportError:
    def note(*args):
        pass


config = json.load(open('fabconf.json'))

env.roledefs = config['roles']


@task
@roles('rpi')
def rpi_init():
    with cd('/etc/nginx/sites-available'):
        put('nginx.conf', 'frontend', use_sudo=True)

    sudo('ln -s /etc/nginx/sites-available/%s /etc/nginx/sites-enabled/'
         % config['name'])
    sudo('service nginx reload')


@task
@roles('rpi')
def rpi_deploy():
    rsync_project(('/srv/www/%s' % config['name']), 'frontend/')

    note('logcol WUI deployed')


def _connectToFTP():
    print colors.green("** Connecting to the server **")

    ftp = FTP(host=env.host, user=env.user, passwd=env.passwd)

    return ftp

