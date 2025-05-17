# Function: Update-OSMedia

```yaml
---
title: "Function: Update-OSMedia"
type: "Public Cmdlet"
module_file: "Update-OSMedia.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSMedia"
    - "$SetOSDBuilderPathUpdates"
    - "$SetOSDBuilderPathMount"
    - "$SetOSDBuilderPathTemplates"
    - "$SetOSDBuilderPathTasks"
    - "$SetOSDBuilderPathFeatureUpdates"
    - "$SetOSDBuilderPathContentPacks"
    - "$SetOSDBuilderAllowContentPacks"
    - "$SetOSDBuilderAllowGlobalOptions"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Test-Path"
  - "Copy-Item"
  - "Move-Item"
  - "Remove-Item"
  - "Get-ChildItem"
  - "Import-Clixml"
  - "Out-GridView"
---
```

**Synopsis**: Updates an existing OS media with the latest updates and customizations.
**Description**: Applies Microsoft updates and custom content to an existing OS media directory, producing an updated and serviced image.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/update-osmedia](https://osdbuilder.osdeploy.com/module/functions/update-osmedia)

**Syntax**:
```powershell
function Update-OSMedia {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source OS media directory.
*   **`-DestinationPath`**: `[string]` - Path to the destination directory.

**Output**: Path to the updated OS media directory.
