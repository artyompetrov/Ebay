Remove-Item -Recurse -Force .\Ebay\Temp\
Remove-Item -Recurse -Force .\Ebay\GeneratedController\
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate -i /local/Ebay/Shared/Contracts/Ebay.yaml -g aspnetcore -o /local/Ebay/Temp/GeneratedController --additional-properties=aspnetCoreVersion=6.0,buildTarget=library,nullableReferenceTypes=true,packageName=Ebay.GeneratedController,operationResultTask=true
Rename-Item  .\Ebay\Temp\GeneratedController\src\Ebay.GeneratedController\ GeneratedController
Remove-Item -Recurse -Force .\Ebay\Temp\GeneratedController\src\GeneratedController\.gitignore
Remove-Item -Recurse -Force .\Ebay\Temp\GeneratedController\src\GeneratedController\Ebay.GeneratedController.nuspec
Copy-Item .\Ebay\Temp\GeneratedController\src\GeneratedController\ -Destination .\Ebay\ -Recurse
Remove-Item -Recurse -Force .\Ebay\Temp\

