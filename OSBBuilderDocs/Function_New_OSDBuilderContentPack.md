# Function: New-OSDBuilderContentPack

```yaml
---
title: "Function: New-OSDBuilderContentPack"
type: "Public Cmdlet"
module_file: "New-OSDBuilderContentPack.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathContentPacks"
    - "$SetOSDBuilderPathContent"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Test-Path"
  - "Copy-Item"
  - "Move-Item"
  - "Remove-Item"
  - "Get-ChildItem"
---
```

**Synopsis**: Creates a new OSDBuilder Content Pack.
**Description**: Generates a new Content Pack for use with OSDBuilder, allowing modular application of drivers, scripts, registry settings, and more.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuildercontentpack](https://osdbuilder.osdeploy.com/module/functions/new-osdbuildercontentpack)

**Syntax**:
```powershell
function New-OSDBuilderContentPack {
    [CmdletBinding()]
    param (
        [string]$Name,
        [string]$Description
    )
}
```

**Parameters**:
*   **`-Name`**: `[string]` - Name of the Content Pack.
*   **`-Description`**: `[string]` - Description of the Content Pack.

**Output**: Path to the created Content Pack directory.
