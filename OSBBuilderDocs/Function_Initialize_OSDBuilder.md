# Function: Initialize-OSDBuilder

```yaml
---
title: "Function: Initialize-OSDBuilder"
type: "Core Function"
module_file: "Initialize-OSDBuilder.ps1"
scope_dependencies:
  reads:
    - "Registry: HKCU:\\Software\\OSDeploy\\GetOSDBuilderHome"
    - "Registry: HKCU:\\Software\\OSDeploy\\OSBuilderPath (legacy)"
    - "$env:SystemDrive"
    - "$env:ProgramData"
    - "Local JSON: $global:GetOSDBuilder.JsonLocal (conditionally)"
    - "Global JSON: $global:GetOSDBuilder.JsonGlobal (conditionally)"
  writes:
    - "$global:GetOSDBuilderHome"
    - "$global:GetOSDBuilder"
    - "$global:SetOSDBuilder"
    - "Registry: HKCU:\\Software\\OSDeploy\\GetOSDBuilderHome"
    - "$global:GetOSDBuilderPathContentADK" # and other specific path globals
    - "$global:SetOSDBuilderPathContent" # and other specific path globals
cmdlet_dependencies:
  - "Get-ItemProperty"
  - "New-Item"
  - "Rename-ItemProperty"
  - "New-ItemProperty"
  - "Set-ItemProperty"
  - "Get-Content"
  - "ConvertFrom-Json"
  - "Test-Path"
---
```

**Synopsis**:
Initializes or re-initializes the OSDBuilder environment settings. This includes determining and setting the OSDBuilder home path, defining paths for various content types, and setting up global variables that store default configurations and operational parameters for the module.

**Description**:
This function is critical for the OSDBuilder module's operation. It first establishes the root directory (OSDBuilder Home) by checking the system registry or defaulting to `C:\OSDBuilder`. It then populates two key global hashtables: `$global:GetOSDBuilder` (for relatively static paths and informational data) and `$global:SetOSDBuilder` (for configurable default paths and cmdlet parameter defaults). These defaults can be further customized by loading settings from `OSDBuilder.json` files located in the OSDBuilder Home directory (local) and/or `$env:ProgramData\OSDeploy` (global). The function also handles some legacy path corrections and sets up more granular global path variables for convenience.

**Syntax**:
```powershell
function Initialize-OSDBuilder {
    [CmdletBinding()]
    param (
        #Sets the OSDBuilder Path in the Registry
        [string]$SetHome
    )
    # Internal logic for registry interaction, variable initialization, and JSON loading
}
```

**Parameters**:

*   **`-SetHome`**: `[string]`
    *   **Type**: `[string]`
    *   **Mandatory**: No
    *   **Description**: If provided, this path will be set as the OSDBuilder home directory in the registry (`HKCU:\Software\OSDeploy\GetOSDBuilderHome`). All other OSDBuilder paths will be relative to this new home directory.

**Key Operations**:

1.  **Registry Management for Home Path**:
    *   Ensures the `HKCU:\Software\OSDeploy` registry key exists.
    *   Migrates a legacy registry value `OSBuilderPath` to `GetOSDBuilderHome` if found.
    *   If `GetOSDBuilderHome` value doesn't exist, creates it.
    *   If the `-SetHome` parameter is used, updates `GetOSDBuilderHome` with the provided path.
    *   Reads the `GetOSDBuilderHome` value from the registry into `$global:GetOSDBuilderHome`. If it's still not set (e.g., first run), defaults to `"$env:SystemDrive\OSDBuilder"` and updates the registry.
2.  **Global Variable Initialization (`$global:GetOSDBuilder`)**:
    *   Creates an ordered hashtable `$global:GetOSDBuilder` and populates it with:
        *   `Home`: The resolved `$global:GetOSDBuilderHome`.
        *   `Initialize`: Set to `$true`.
        *   `JsonLocal`: Path to `<Home>\OSDBuilder.json`.
        *   `JsonGlobal`: Path to `$env:ProgramData\OSDeploy\OSDBuilder.json`.
3.  **Global Variable Initialization (`$global:SetOSDBuilder`)**:
    *   Creates an ordered hashtable `$global:SetOSDBuilder` and populates it with default settings:
        *   `AllowContentPacks`: `$true`
        *   `AllowGlobalOptions`: `$true`
        *   Paths relative to `<Home>`: `PathContent`, `PathContentPacks`, `PathFeatureUpdates`, `PathMount`, `PathOSBuilds`, `PathOSImport`, `PathOSMedia`, `PathPEBuilds`, `PathTasks`, `PathTemplates`, `PathUpdates`.
        *   Default boolean/string values for parameters of various public cmdlets (e.g., `ImportOSMediaAllowUnsupportedOS = $false`, `NewOSBuildCreateISO = $false`).
4.  **JSON Configuration Loading**:
    *   **Local JSON**: If `$global:GetOSDBuilder.JsonLocal` exists, its content is read, converted from JSON, and its properties are used to update the corresponding values in `$global:SetOSDBuilder`.
    *   **Global JSON**: If `$global:SetOSDBuilder.AllowGlobalOptions` is `$true` and `$global:GetOSDBuilder.JsonGlobal` exists, its content is loaded similarly, potentially overriding settings from the local JSON or defaults (order of precedence depends on exact loading logic, typically local overrides global).
5.  **Derived Path Initialization**:
    *   Populates specific path properties within `$global:GetOSDBuilder` based on `$global:SetOSDBuilder.PathContent` (e.g., `$global:GetOSDBuilder.PathContentADK = Join-Path $global:SetOSDBuilder.PathContent 'ADK'`).
6.  **Convenience Global Path Variables**:
    *   Sets individual global variables for many of the paths defined in `$global:GetOSDBuilder` and `$global:SetOSDBuilder` (e.g., `$global:GetOSDBuilderPathContentADK`, `$global:SetOSDBuilderPathContentPacks`).
7.  **Legacy Directory Corrections**:
    *   Checks for old directory names (e.g., `<Home>\Media`, `<Home>\OSDownload`, `<Content>\OSDUpdate`) and issues warnings or attempts to rename/move them to their current standard locations.

**Notes**:
*   This function is fundamental to setting up the OSDBuilder environment. It's usually called automatically by `Get-OSDBuilder` if the environment isn't already configured.
*   The use of global variables is extensive and central to how OSDBuilder functions share configuration and state.
*   The JSON configuration files provide a way to customize default behaviors without modifying the module scripts directly.
