@echo off
:MENU
cls
echo ========== Windows�֗������`���[ Ver.1.2 ==========
echo [01] ������
echo [02] �d��
echo [03] �y�C���g
echo [04] Internet Explorer�i�����N���j
echo [05] ����u���E�U��Web�y�[�W���J��
echo [06] �R���g���[���p�l��
echo [07] �A�v���Ƌ@�\�i�A���C���X�g�[���j
echo [08] �l�b�g���[�N�ڑ��i�A�_�v�^�ݒ�j
echo [09] �T�[�r�X�Ǘ�
echo [10] �f�o�C�X�}�l�[�W��
echo [11] �V�X�e�����
echo [12] Windows�A�b�v�f�[�g
echo [13] �^�X�N�}�l�[�W��
echo [14] �X�^�[�g�A�b�v�t�H���_�i�����N���j
echo [15] �X�^�[�g���j���[�̋��ʃt�H���_�i�S���[�U�[�j
echo [16] �X�^�[�g���j���[�̌l�t�H���_�i���݂̃��[�U�[�j
echo [17] �V�X�e���̕���
echo [18] �t�@�C�A�E�H�[���ݒ�
echo [19] ���[�U�[�A�J�E���g�ݒ�
echo [20] PowerShell���Ǘ��҂ŋN��
echo [21] Windows�́u�t�@�C�������w�肵�Ď��s�v
echo [22] ���W�X�g���G�f�B�^
echo [23] �f�B�X�N�̊Ǘ�
echo ================================================
set /p choice=�ԍ�����͂��Ă��������i0�ŏI���j: 

REM === �A�v���n ===
if "%choice%"=="01" start notepad
if "%choice%"=="02" start calc
if "%choice%"=="03" start mspaint
if "%choice%"=="04" (
  if exist "%ProgramFiles%\Internet Explorer\iexplore.exe" (
    start "" "%ProgramFiles%\Internet Explorer\iexplore.exe"
  ) else (
    echo IE�̓C���X�g�[������Ă��Ȃ����폜����Ă��܂�
    pause
  )
)
if "%choice%"=="05" start "" "https://www.google.com"

REM === �ݒ�E�Ǘ��c�[�� ===
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

REM === �I�� ===
if "%choice%"=="0" exit
goto MENU
