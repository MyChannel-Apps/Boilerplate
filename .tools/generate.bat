@echo off
del generated.log
(yuidoc --no-code --charset binary --helpers ./Theme/helpers/helpers.js --themedir ./Theme/ --config ./yuidoc.json ../) >> generated.log 2>&1
pause