# Function: New-OSBuildMultiLang

```yaml
---
title: "Function: New-OSBuildMultiLang"
type: "Public Cmdlet"
module_file: "New-OSBuildMultiLang.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSBuilds"
    - "$SetOSDBuilderPathOSMedia"
    - "$SetOSDBuilderPathContent"
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

**Synopsis**: Creates a new multi-language OS build.
**Description**: Generates a new OS build with support for multiple languages by applying language packs and customizations to a base OS image.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osbuildmultilang](https://osdbuilder.osdeploy.com/module/functions/new-osbuildmultilang)

**Syntax**:
```powershell
function New-OSBuildMultiLang {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath,
        [string[]]$Languages
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source OS image.
*   **`-DestinationPath`**: `[string]` - Path to the destination directory.
*   **`-Languages`**: `[string[]]` - Array of language codes to include in the build.

**Output**: PSCustomObject representing the new multi-language OS build.
