@echo off
title Temp Cache Cleanup Tool
color 0A

:: �ꎞ��~�h�~
setlocal EnableDelayedExpansion

echo ================================
echo   Temp �L���b�V���폜�c�[��
echo ================================
echo.

:: --- �L���b�V���폜�m�F ---
set /p cache_confirm=�L���b�V����Temp�t�@�C�����폜���܂����H (Y/n): 
if /i "!cache_confirm!"=="Y" (
    echo.
    echo ���[�U�[��Temp�t�H���_��|����...
    del /f /s /q "%TEMP%\*"
    for /d %%i in ("%TEMP%\*") do rd /s /q "%%i"

    echo �V�X�e����Temp�t�H���_��|����...
    del /f /s /q "C:\Windows\Temp\*"
    for /d %%i in ("C:\Windows\Temp\*") do rd /s /q "%%i"

    echo Prefetch�t�@�C�����폜��...
    del /f /s /q "C:\Windows\Prefetch\*"

    echo Windows Update�̃L���b�V����|����...
    net stop wuauserv >nul
    del /f /s /q "C:\Windows\SoftwareDistribution\Download\*"
    net start wuauserv >nul

    echo �L���b�V���֘A�̑|�������I
) else (
    echo �L���b�V���̍폜���X�L�b�v���܂����B
)

echo.

:: --- �S�~���폜�m�F ---
set /p trash_confirm=�S�~������ɂ��܂����H (Y/n): 
if /i "!trash_confirm!"=="Y" (
    echo �S�~������ɂ��Ă��܂�...
    rd /s /q %systemdrive%\$Recycle.Bin
    echo �S�~������ɂ��܂����I
) else (
    echo �S�~���폜���X�L�b�v���܂����B
)

echo.
echo ���|����Ɗ����I
pause
