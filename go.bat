@echo off
call npx cap sync android
call ionic build
call npx cap sync android
call npx cap run android --target 192.168.0.10:5555