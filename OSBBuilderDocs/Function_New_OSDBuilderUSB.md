# Function: New-OSDBuilderUSB

```yaml
---
title: "Function: New-OSDBuilderUSB"
type: "Public Cmdlet"
module_file: "New-OSDBuilderUSB.ps1"
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

**Synopsis**: Creates a new bootable USB from an OS build.
**Description**: Generates a bootable USB drive from a customized OS build directory.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderusb](https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderusb)

**Syntax**:
```powershell
function New-OSDBuilderUSB {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source OS build directory.
*   **`-DestinationPath`**: `[string]` - Path to the destination USB drive.

**Output**: Path to the created USB drive.
