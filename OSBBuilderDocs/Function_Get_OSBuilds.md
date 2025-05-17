# Function: Get-OSBuilds

```yaml
---
title: "Function: Get-OSBuilds"
type: "Public Cmdlet"
module_file: "Get-OSBuilds.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSBuilds"
    - "$AllOSDUpdates (from Get-OSDUpdates)"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-OSDUpdates"
  - "Get-ChildItem"
  - "Import-Clixml"
  - "Out-GridView"
---
```

**Synopsis**: Returns all Operating Systems in OSDBuilder\\OSBuilds.
**Description**: Returns all Operating Systems located in the `$SetOSDBuilderPathOSBuilds` directory as a PowerShell Custom Object. Each object contains detailed metadata about the OS build, including version, architecture, installed updates, and revision status relative to other builds of the same family.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/get-osbuilds](https://osdbuilder.osdeploy.com/module/functions/get-osbuilds)

**Syntax**:
```powershell
function Get-OSBuilds {
    [CmdletBinding()]
    param (
        [switch]$GridView,
        [string]$Updates
    )
}
```

**Parameters**:
*   **`-GridView`**: `[switch]` - Displays the results in an interactive GridView window. Selected items can be passed through the pipeline.
*   **`-OSArch`**: `[string]` - Filter OSBuilds by architecture. Accepted Values: `x64`, `x86`. Default: `x64`.
*   **`-Newest`**: `[switch]` - Returns only the latest OSBuild.
*   **`-OSInstallationType`**: `[string]` - Filter OSBuilds by installation type. Accepted Values: `Client`, `Server`.
*   **`-OSMajorVersion`**: `[string]` - Filter OSBuilds by major version. Accepted Values: `10`.
*   **`-OSReleaseId`**: `[string]` - Filter OSBuilds by Release ID. Accepted Values: `24H2`, `23H2`, `22H2`, `21H2`, `21H1`, `20H2`, `2004`, `1909`, `1903`, `1809`.
*   **`-Revision`**: `[string]` - Filter OSBuilds by revision status. Accepted Values: `OK`, `Superseded`.
*   **`-Updates`**: `[string]` - Filter OSBuilds by update status. Accepted Values: `OK`, `Update`.

**Key Operations**:
1.  Calls `Get-OSDBuilder` and `Get-OSDUpdates`.
2.  Scans `$SetOSDBuilderPathOSBuilds` for valid OSBuild directories (containing metadata XMLs).
3.  Extracts metadata from `Get-WindowsImage.xml`, `CurrentVersion.xml`, and `Sessions.xml`.
4.  Calculates properties like `MediaType` ('OSBuild'), `OSMFamily`, `UpdateOS`, `ReleaseId`, `UBR`, `Revision` ('OK' for newest in family, 'Superseded' otherwise), and `Updates` ('OK' if all applicable updates are installed, 'Update' otherwise).
5.  Applies parameter filters.
6.  Returns PSCustomObjects representing the OSBuilds, optionally via `Out-GridView`.

**Output**: Array of PSCustomObjects.
