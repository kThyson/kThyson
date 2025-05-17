title: "Function: Get-PEBuilds"
type: "Public Cmdlet"
module_file: "Get-PEBuilds.ps1"
scope_dependencies:
  reads:
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Out-GridView"
# Function: Get-PEBuilds

```yaml
---
title: "Function: Get-PEBuilds"
type: "Public Cmdlet"
module_file: "Get-PEBuilds.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathPEBuilds"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-ChildItem"
  - "Import-Clixml"
  - "Out-GridView"
---
```

**Synopsis**: Returns all Operating Systems in OSDBuilder\\PEBuilds.
**Description**: Returns all PE (Preinstallation Environment) builds located in the `$SetOSDBuilderPathPEBuilds` directory as PowerShell Custom Objects. Each object contains detailed metadata about the PE build.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/get-pebuilds](https://osdbuilder.osdeploy.com/module/functions/get-pebuilds)

**Syntax**:
```powershell
function Get-PEBuilds {
    [CmdletBinding()]
    param (
        [switch]$GridView
    )
}
```

**Parameters**:
*   **`-GridView`**: `[switch]` - Displays results in GridView.

**Key Operations**:
1.  Calls `Get-OSDBuilder`.
2.  Scans `$SetOSDBuilderPathPEBuilds` for valid PEBuild directories.
3.  Extracts metadata from `Get-WindowsImage.xml` and `CurrentVersion.xml`.
4.  Calculates properties like `MediaType` ('PEBuild'), `OSMFamily`, `UpdateOS`, `ReleaseId`, `UBR`, etc.
5.  Returns PSCustomObjects representing the PEBuilds, optionally via `Out-GridView`.

**Output**: Array of PSCustomObjects.
