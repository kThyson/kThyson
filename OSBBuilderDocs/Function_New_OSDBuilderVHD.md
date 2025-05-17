# Function: New-OSDBuilderVHD

```yaml
---
title: "Function: New-OSDBuilderVHD"
type: "Public Cmdlet"
module_file: "New-OSDBuilderVHD.ps1"
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

**Synopsis**: Creates a new VHD from an OS build.
**Description**: Generates a bootable VHD file from a customized OS build directory.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuildervhd](https://osdbuilder.osdeploy.com/module/functions/new-osdbuildervhd)

**Syntax**:
```powershell
function New-OSDBuilderVHD {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source OS build directory.
*   **`-DestinationPath`**: `[string]` - Path to the destination VHD file.

**Output**: Path to the created VHD file.
