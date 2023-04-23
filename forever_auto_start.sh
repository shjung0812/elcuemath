#!/bin/bash

#dir="$(cd "$( dirname "$0")" && pwd -P)"
#echo $dir


cd ../home/morgan/web/cdct
now=`date +%Y%m%d-%H%M%S`
sudo forever start -o ./log/foreverlog/${now}out.log cdctapp.js


