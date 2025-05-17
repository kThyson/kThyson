# Function: New-PEBuild

```yaml
---
title: "Function: New-PEBuild"
type: "Public Cmdlet"
module_file: "New-PEBuild.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathPEBuilds"
    - "$SetOSDBuilderPathContent"
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

**Synopsis**: Creates a new customized WinPE build.
**Description**: Generates a new WinPE build by applying customizations, drivers, and content packs to a base WinPE image.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-pebuild](https://osdbuilder.osdeploy.com/module/functions/new-pebuild)

**Syntax**:
```powershell
function New-PEBuild {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source WinPE image.
*   **`-DestinationPath`**: `[string]` - Path to the destination directory.

**Output**: PSCustomObject representing the new WinPE build.
