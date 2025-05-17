# Function: Import-OSMedia

```yaml
---
title: "Function: Import-OSMedia"
type: "Public Cmdlet"
module_file: "Import-OSMedia.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSImport"
    - "$SetOSDBuilderPathOSMedia"
    - "$SetOSDBuilderPathContent"
    - "$SetOSDBuilderPathUpdates"
    - "$SetOSDBuilderPathMount"
    - "$SetOSDBuilderPathTemplates"
    - "$SetOSDBuilderPathTasks"
    - "$SetOSDBuilderPathFeatureUpdates"
    - "$SetOSDBuilderPathContentPacks"
    - "$SetOSDBuilderAllowContentPacks"
    - "$SetOSDBuilderAllowGlobalOptions"
    - "$SetOSDBuilderImportOSMediaAllowUnsupportedOS"
    - "$SetOSDBuilderImportOSMediaSkipGrid"
    - "$SetOSDBuilderImportOSMediaSkipUpdates"
    - "$SetOSDBuilderImportOSMediaSkipDrivers"
    - "$SetOSDBuilderImportOSMediaSkipFeatures"
    - "$SetOSDBuilderImportOSMediaSkipLanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipNetFX3"
    - "$SetOSDBuilderImportOSMediaSkipEdge"
    - "$SetOSDBuilderImportOSMediaSkipAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinRE"
    - "$SetOSDBuilderImportOSMediaSkipWinPE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEADK"
    - "$SetOSDBuilderImportOSMediaSkipWinPEDaRT"
    - "$SetOSDBuilderImportOSMediaSkipWinPEAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinRE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinRELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinRELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinRELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinRELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderImportOSMediaSkipWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinRELanguagePacks"
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

**Synopsis**: Imports OS installation media into OSDBuilder.
**Description**: Copies and prepares Windows installation media for servicing and customization. Supports a wide range of options for skipping or including specific content, features, and updates.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/import-osmedia](https://osdbuilder.osdeploy.com/module/functions/import-osmedia)

**Syntax**:
```powershell
function Import-OSMedia {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath,
        [switch]$SkipGrid,
        [switch]$SkipUpdates,
        [switch]$SkipDrivers,
        [switch]$SkipFeatures,
        [switch]$SkipLanguagePacks,
        [switch]$SkipNetFX3,
        [switch]$SkipEdge,
        [switch]$SkipAppx,
        [switch]$SkipWinRE,
        [switch]$SkipWinPE,
        [switch]$AllowUnsupportedOS
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source Windows installation media.
*   **`-DestinationPath`**: `[string]` - Path to the destination directory.
*   **`-SkipGrid`**: `[switch]` - Skip GridView selection.
*   **`-SkipUpdates`**: `[switch]` - Skip update integration.
*   **`-SkipDrivers`**: `[switch]` - Skip driver integration.
*   **`-SkipFeatures`**: `[switch]` - Skip feature integration.
*   **`-SkipLanguagePacks`**: `[switch]` - Skip language pack integration.
*   **`-SkipNetFX3`**: `[switch]` - Skip .NET Framework 3.5 integration.
*   **`-SkipEdge`**: `[switch]` - Skip Microsoft Edge integration.
*   **`-SkipAppx`**: `[switch]` - Skip AppX package integration.
*   **`-SkipWinRE`**: `[switch]` - Skip Windows Recovery Environment integration.
*   **`-SkipWinPE`**: `[switch]` - Skip Windows PE integration.
*   **`-AllowUnsupportedOS`**: `[switch]` - Allow unsupported OS imports.

**Output**: PSCustomObject representing the imported OS media.
