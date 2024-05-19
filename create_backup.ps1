if ($null -eq $env:PGPASSWORD) 
{
    $secureString = Read-Host "Enter postgres password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
    $env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}

$backupPath = "./$((Get-Date).ToString('yyyy-MM-dd-hh-mm-ss'))"

New-Item -ItemType Directory -Path $backupPath

C:\Program` Files\PostgreSQL\16\bin\pg_dump.exe --verbose --host=178.208.65.100 --port=15432 --username=ebay --format=c --compress=6 --file "${backupPath}/ebay" -n "public" ebay
C:\Program` Files\PostgreSQL\16\bin\pg_dump.exe --verbose --host=178.208.65.100 --port=15432 --username=ebay --format=c --compress=6 --file "${backupPath}/odoo" -n "public" odoo
