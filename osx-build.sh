killall `basename $PWD`; 
/Library/Application\ Support/Titanium/sdk/osx/1.1.0/tibuild.py .
cp info.plist ./Pomodoly.app/Contents
rm ./Pomodoly.app/Contents/osx-build.sh
open *.app
