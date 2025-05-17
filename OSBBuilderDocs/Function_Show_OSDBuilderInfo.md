# Function: Show-OSDBuilderInfo

```yaml
---
title: "Function: Show-OSDBuilderInfo"
type: "Public Cmdlet"
module_file: "Show-OSDBuilderInfo.ps1"
scope_dependencies:
  reads:
    - "$global:GetOSDBuilder"
    - "$global:SetOSDBuilder"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Out-GridView"
---
```

**Synopsis**: Displays OSDBuilder environment information in a user-friendly format.
**Description**: Presents the current OSDBuilder configuration, paths, and settings in a GridView or formatted output for easy review.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/show-osdbuilderinfo](https://osdbuilder.osdeploy.com/module/functions/show-osdbuilderinfo)

**Syntax**:
```powershell
function Show-OSDBuilderInfo {
    [CmdletBinding()]
    param ()
}
```

**Output**: None (displays information interactively).
