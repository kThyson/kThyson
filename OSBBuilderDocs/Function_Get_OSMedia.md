# Function: Get-OSMedia

```yaml
---
title: "Function: Get-OSMedia"
type: "Public Cmdlet"
module_file: "Get-OSMedia.ps1"
scope_dependencies:
  reads:
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Repair-GetOSDMediaTemplateDirectories"
---
```

**Synopsis**: Returns all Operating Systems in OSDBuilder\\OSImport and OSDBuilder\\OSMedia.
**Description**: Returns all Operating Systems located in the `$SetOSDBuilderPathOSImport` and `$SetOSDBuilderPathOSMedia` directories as PowerShell Custom Objects. Each object contains detailed metadata about the OS media, including version, architecture, installed updates, revision status, and media type (OSImport or OSMedia).
**Link**: [https://osdbuilder.osdeploy.com/module/functions/get-osmedia](https://osdbuilder.osdeploy.com/module/functions/get-osmedia)

**Syntax**:
```powershell
function Get-OSMedia {
    [CmdletBinding()]
    )
}
```

**Parameters**:
*   **`-GridView`**: `[switch]` - Displays results in GridView.
*   **`-OSArch`**: `[string]` - Filter by architecture.
*   **`-Newest`**: `[switch]` - Returns only the latest for each family.
*   **`-OSInstallationType`**: `[string]` - Filter by installation type.
*   **`-OSMajorVersion`**: `[string]` - Filter by major version. Accepted Values: `10`.
*   **`-OSReleaseId`**: `[string]` - Filter by Release ID.
*   **`-Revision`**: `[string]` - Filter by revision status. Accepted Values: `OK`, `Superseded`.
*   **`-Updates`**: `[string]` - Filter by update status. Accepted Values: `OK`, `Update`.

**Key Operations**:
1.  Calls `Get-OSDBuilder` and `Get-OSDUpdates`.
2.  Scans `$SetOSDBuilderPathOSImport` and `$SetOSDBuilderPathOSMedia` for valid media directories.
3.  Extracts metadata from `Get-WindowsImage.xml`, `CurrentVersion.xml`, and `Sessions.xml`.
4.  Calculates properties like `MediaType` ('OSImport' or 'OSMedia'), `OSMFamily`, `UpdateOS`, `ReleaseId`, `UBR`, `Revision`, and `Updates`. Assigns `OSMGuid` if missing and updates XML.
5.  Calls `Repair-GetOSDMediaTemplateDirectories`.
6.  Applies parameter filters.
7.  Returns PSCustomObjects representing the media, optionally via `Out-GridView`.

**Output**: Array of PSCustomObjects.
