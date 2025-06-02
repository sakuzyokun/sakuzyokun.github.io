@echo off
title Temp Cache Cleanup Tool
color 0A

:: 一時停止防止
setlocal EnableDelayedExpansion

echo ================================
echo   Temp キャッシュ削除ツール
echo ================================
echo.

:: --- キャッシュ削除確認 ---
set /p cache_confirm=キャッシュとTempファイルを削除しますか？ (Y/n): 
if /i "!cache_confirm!"=="Y" (
    echo.
    echo ユーザーのTempフォルダを掃除中...
    del /f /s /q "%TEMP%\*"
    for /d %%i in ("%TEMP%\*") do rd /s /q "%%i"

    echo システムのTempフォルダを掃除中...
    del /f /s /q "C:\Windows\Temp\*"
    for /d %%i in ("C:\Windows\Temp\*") do rd /s /q "%%i"

    echo Prefetchファイルを削除中...
    del /f /s /q "C:\Windows\Prefetch\*"

    echo Windows Updateのキャッシュを掃除中...
    net stop wuauserv >nul
    del /f /s /q "C:\Windows\SoftwareDistribution\Download\*"
    net start wuauserv >nul

    echo キャッシュ関連の掃除完了！
) else (
    echo キャッシュの削除をスキップしました。
)

echo.

:: --- ゴミ箱削除確認 ---
set /p trash_confirm=ゴミ箱を空にしますか？ (Y/n): 
if /i "!trash_confirm!"=="Y" (
    echo ゴミ箱を空にしています...
    rd /s /q %systemdrive%\$Recycle.Bin
    echo ゴミ箱を空にしました！
) else (
    echo ゴミ箱削除をスキップしました。
)

echo.
echo お掃除作業完了！
pause
