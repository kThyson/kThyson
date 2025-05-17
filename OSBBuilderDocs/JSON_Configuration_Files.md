# JSON Configuration Files

OSDBuilder allows for customization of its default settings through JSON configuration files. This provides a way to persist preferred defaults without modifying the module scripts.

1.  **Local Configuration File**:
    *   **Path**: `$global:GetOSDBuilder.Home\OSDBuilder.json` (e.g., `C:\OSDBuilder\OSDBuilder.json`).
    *   **Purpose**: Stores user-specific or instance-specific default settings.
    *   **Precedence**: Settings in this file typically override those from the global configuration file and the hardcoded defaults in `Initialize-OSDBuilder`.

2.  **Global Configuration File** (Optional):
    *   **Path**: `$env:ProgramData\OSDeploy\OSDBuilder.json`.
    *   **Purpose**: Can be used to set system-wide defaults if multiple users or OSDBuilder instances share a machine.
    *   **Loading**: Loaded only if `$global:SetOSDBuilder.AllowGlobalOptions` is `$true`.

**Structure of `OSDBuilder.json`**:
The JSON file contains key-value pairs where the keys correspond to the property names in the `$global:SetOSDBuilder` hashtable.

**Example `OSDBuilder.json` content**:
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
