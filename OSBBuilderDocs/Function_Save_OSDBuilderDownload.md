# Function: Save-OSDBuilderDownload

```yaml
---
title: "Function: Save-OSDBuilderDownload"
type: "Public Cmdlet"
module_file: "Save-OSDBuilderDownload.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathUpdates"
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

**Synopsis**: Downloads Microsoft Update packages for use with OSDBuilder.
**Description**: Downloads and stores Microsoft Update packages (`.msu` and `.cab` files) in the OSDBuilder Updates directory for servicing images.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/save-osdbuilderdownload](https://osdbuilder.osdeploy.com/module/functions/save-osdbuilderdownload)

**Syntax**:
```powershell
function Save-OSDBuilderDownload {
    [CmdletBinding()]
    param (
        [string]$UpdateUrl,
        [string]$DestinationPath
    )
}
```

**Parameters**:
*   **`-UpdateUrl`**: `[string]` - URL to the Microsoft Update package.
*   **`-DestinationPath`**: `[string]` - Path to the destination directory.

**Output**: Path to the downloaded update file.
