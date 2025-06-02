@echo off
:MENU
cls
echo ========== Windows便利ランチャー Ver.1.2 ==========
echo [01] メモ帳
echo [02] 電卓
echo [03] ペイント
echo [04] Internet Explorer（強制起動）
echo [05] 既定ブラウザでWebページを開く
echo [06] コントロールパネル
echo [07] アプリと機能（アンインストール）
echo [08] ネットワーク接続（アダプタ設定）
echo [09] サービス管理
echo [10] デバイスマネージャ
echo [11] システム情報
echo [12] Windowsアップデート
echo [13] タスクマネージャ
echo [14] スタートアップフォルダ（自動起動）
echo [15] スタートメニューの共通フォルダ（全ユーザー）
echo [16] スタートメニューの個人フォルダ（現在のユーザー）
echo [17] システムの復元
echo [18] ファイアウォール設定
echo [19] ユーザーアカウント設定
echo [20] PowerShellを管理者で起動
echo [21] Windowsの「ファイル名を指定して実行」
echo [22] レジストリエディタ
echo [23] ディスクの管理
echo ================================================
set /p choice=番号を入力してください（0で終了）: 

REM === アプリ系 ===
if "%choice%"=="01" start notepad
if "%choice%"=="02" start calc
if "%choice%"=="03" start mspaint
if "%choice%"=="04" (
  if exist "%ProgramFiles%\Internet Explorer\iexplore.exe" (
    start "" "%ProgramFiles%\Internet Explorer\iexplore.exe"
  ) else (
    echo IEはインストールされていないか削除されています
    pause
  )
)
if "%choice%"=="05" start "" "https://www.google.com"

REM === 設定・管理ツール ===
if "%choice%"=="06" start control
if "%choice%"=="07" start appwiz.cpl
if "%choice%"=="08" start ncpa.cpl
if "%choice%"=="09" start services.msc
if "%choice%"=="10" start devmgmt.msc
if "%choice%"=="11" start msinfo32
if "%choice%"=="12" start ms-settings:windowsupdate
if "%choice%"=="13" start taskmgr
if "%choice%"=="14" start shell:startup
if "%choice%"=="15" start shell:common start menu
if "%choice%"=="16" start shell:start menu
if "%choice%"=="17" start rstrui.exe
if "%choice%"=="18" start firewall.cpl
if "%choice%"=="19" control userpasswords2
if "%choice%"=="20" powershell -Command "Start-Process PowerShell -Verb RunAs"
if "%choice%"=="21" start Run
if "%choice%"=="22" start regedit
if "%choice%"=="23" start diskmgmt.msc

REM === 終了 ===
if "%choice%"=="0" exit
goto MENU
