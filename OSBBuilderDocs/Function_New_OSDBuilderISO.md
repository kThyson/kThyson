# Function: New-OSDBuilderISO

```yaml
---
title: "Function: New-OSDBuilderISO"
type: "Public Cmdlet"
module_file: "New-OSDBuilderISO.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSBuilds"
    - "$SetOSDBuilderPathContent"
    - "$SetOSDBuilderPathMount"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Test-Path"
  - "Copy-Item"
  - "Move-Item"
  - "Remove-Item"
  - "Get-ChildItem"
---
```

**Synopsis**: Creates a new ISO from an OS build.
**Description**: Generates a bootable ISO file from a customized OS build directory.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderiso](https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderiso)

**Syntax**:
```powershell
function New-OSDBuilderISO {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source OS build directory.
*   **`-DestinationPath`**: `[string]` - Path to the destination ISO file.

**Output**: Path to the created ISO file.
