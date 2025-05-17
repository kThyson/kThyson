# Function: Get-OSDBuilder

```yaml
---
title: "Function: Get-OSDBuilder"
type: "Public Cmdlet"
module_file: "Get-OSDBuilder.ps1"
scope_dependencies:
  reads:
    - "$global:GetOSDBuilder"
    - "$global:SetOSDBuilder"
    - "$global:GetOSDBuilderHome"
    - "$global:GetOSDBuilder.JsonLocal"
    - "$global:GetOSDBuilder.JsonGlobal"
    - "$env:ProgramData"
    - "$env:SystemDrive"
    - "Registry: HKCU:\\Software\\OSDeploy\\GetOSDBuilderHome"
cmdlet_dependencies:
  - "Initialize-OSDBuilder"
  - "Test-Path"
  - "Get-Content"
  - "ConvertFrom-Json"
---
```

**Synopsis**: Returns the current OSDBuilder environment configuration and state.
**Description**: Returns a custom object containing all global variables and configuration settings for the current OSDBuilder session. If the environment is not initialized, it calls `Initialize-OSDBuilder` automatically.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/get-osdbuilder](https://osdbuilder.osdeploy.com/module/functions/get-osdbuilder)

**Syntax**:
```powershell
function Get-OSDBuilder {
    [CmdletBinding()]
    param ()
}
```

**Output**: PSCustomObject representing the OSDBuilder environment.
