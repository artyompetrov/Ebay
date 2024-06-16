if ($null -eq $env:PGPASSWORD) 
{
    $secureString = Read-Host "Enter postgres password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
    $env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}

$backupPath = "D:/YandexDisk/Backups/Ebay/$((Get-Date).ToString('yyyy-MM-dd-hh-mm-ss'))"
$extensionsBackupFileEbay = "${backupPath}/extensions_ebay.sql"
$extensionsBackupFileOdoo = "${backupPath}/extensions_odoo.sql"

New-Item -ItemType Directory -Path $backupPath

Write-Output "!!! creating backups"
C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=178.208.65.100 --port=15432 --username=ebay --dbname=ebay --command="COPY (SELECT 'CREATE EXTENSION IF NOT EXISTS ' || extname || ';' FROM pg_extension) TO STDOUT;" > $extensionsBackupFileEbay
C:\Program` Files\PostgreSQL\16\bin\pg_dump.exe --verbose --host=178.208.65.100 --port=15432 --username=ebay --format=c --compress=6 --file "${backupPath}/ebay" -n "public" ebay

C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=178.208.65.100 --port=15432 --username=ebay --dbname=odoo --command="COPY (SELECT 'CREATE EXTENSION IF NOT EXISTS ' || extname || ';' FROM pg_extension) TO STDOUT;" > $extensionsBackupFileOdoo
C:\Program` Files\PostgreSQL\16\bin\pg_dump.exe --verbose --host=178.208.65.100 --port=15432 --username=ebay --format=c --compress=6 --file "${backupPath}/odoo" -n "public" odoo

Write-Output "!!! stoping containers"
docker container stop ebay_server
docker container stop ebay_odoo

Write-Output "!!! drop local dbs"

C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=localhost --port=15432 --username=ebay --dbname=postgres --command="DROP DATABASE IF EXISTS ebay WITH (FORCE);"
C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=localhost --port=15432 --username=ebay --dbname=postgres --command="DROP DATABASE IF EXISTS odoo WITH (FORCE);"
Start-Sleep -Seconds 5 
C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=localhost --port=15432 --username=ebay --dbname=postgres --command="CREATE DATABASE ebay;"
C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=localhost --port=15432 --username=ebay --dbname=postgres --command="CREATE DATABASE odoo;"
Start-Sleep -Seconds 5 

Write-Output "!!! restoring backups localy"
C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=localhost --port=15432 --username=ebay --dbname=ebay --file="$extensionsBackupFileEbay"
C:\Program` Files\PostgreSQL\16\bin\psql.exe --host=localhost --port=15432 --username=ebay --dbname=odoo --file="$extensionsBackupFileOdoo"
Start-Sleep -Seconds 5 

C:\Program` Files\PostgreSQL\16\bin\pg_restore.exe --verbose --host=localhost --port=15432 --username=ebay --dbname=ebay --format=c "${backupPath}/ebay"
C:\Program` Files\PostgreSQL\16\bin\pg_restore.exe --verbose --host=localhost --port=15432 --username=ebay --dbname=odoo --format=c "${backupPath}/odoo"

Start-Sleep -Seconds 5 

Write-Output "!!! starting containers"
docker container start ebay_server
docker container start ebay_odoo

Write-Output "Backup files are in folder: " $backupPath
