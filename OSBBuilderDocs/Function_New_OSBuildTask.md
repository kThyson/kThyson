# Function: New-OSBuildTask

```yaml
---
title: "Function: New-OSBuildTask"
type: "Public Cmdlet"
module_file: "New-OSBuildTask.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathTasks"
    - "$SetOSDBuilderPathTemplates"
    - "$SetOSDBuilderPathContent"
    - "$SetOSDBuilderPathUpdates"
    - "$SetOSDBuilderPathMount"
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

**Synopsis**: Creates a new OS build task JSON file.
**Description**: Generates a new JSON task file that defines a set of customizations and parameters for use with `New-OSBuild` or `New-PEBuild`.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osbuildtask](https://osdbuilder.osdeploy.com/module/functions/new-osbuildtask)

**Syntax**:
```powershell
function New-OSBuildTask {
    [CmdletBinding()]
    param (
        [string]$TaskName,
        [string]$Description,
        [hashtable]$Parameters
    )
}
```

**Parameters**:
*   **`-TaskName`**: `[string]` - Name of the task.
*   **`-Description`**: `[string]` - Description of the task.
*   **`-Parameters`**: `[hashtable]` - Customization parameters for the task.

**Output**: Path to the created JSON task file.
