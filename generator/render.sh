#!/bin/bash

# add `| tee /dev/pts/x` before gzip pipe to see progress!
mpv --no-config --vo=tct --vo-tct-256=yes --really-quiet --profile=sw-fast --vo-tct-width=160 --vo-tct-height=120 --volume=60 https://www.youtube.com/watch\?v\=FtutLA63Cp8 | gzip > source.gz
