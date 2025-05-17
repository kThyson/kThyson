# Example OSDBuilder.json content

```json
{
  "PathUpdates": "D:\\OSDBuilder_Content\\Updates",
  "NewOSBuildCreateISO": true,
  "UpdateOSMediaDownload": true,
  "ImportOSMediaSkipGrid": false,
  "NewOSBuildTaskEnableNetFX3": true
}
```

In this example:
*   The default path for storing downloaded updates would be changed to `D:\OSDBuilder_Content\Updates`.
*   `New-OSBuild` would default to creating an ISO.
*   `Update-OSMedia` would default to downloading missing updates.
*   `Import-OSMedia` would default to showing the GridView for OS selection.
*   `New-OSBuildTask` would default to enabling .NET Framework 3.5.
