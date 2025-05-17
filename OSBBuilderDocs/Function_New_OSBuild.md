# Function: New-OSBuild

```yaml
---
title: "Function: New-OSBuild"
type: "Public Cmdlet"
module_file: "New-OSBuild.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSBuilds"
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
    - "$SetOSDBuilderNewOSBuildCreateISO"
    - "$SetOSDBuilderNewOSBuildCreateUSB"
    - "$SetOSDBuilderNewOSBuildCreateVHD"
    - "$SetOSDBuilderNewOSBuildTaskEnableNetFX3"
    - "$SetOSDBuilderNewOSBuildTaskEnableEdge"
    - "$SetOSDBuilderNewOSBuildTaskEnableAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinRE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEADK"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEDaRT"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinRE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinRELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinRELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinRELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinRELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPELanguagePacks"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinRE"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinREAppx"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinREFonts"
    - "$SetOSDBuilderNewOSBuildTaskEnableWinPEWinREWinPEWinREWinPEWinREWinPEWinREWinPEWinRELanguagePacks"
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

**Synopsis**: Creates a new customized OS build.
**Description**: Generates a new OS build by applying customizations, updates, and content packs to a base OS image. Supports a wide range of options for enabling or skipping specific features and content.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osbuild](https://osdbuilder.osdeploy.com/module/functions/new-osbuild)

**Syntax**:
```powershell
function New-OSBuild {
    [CmdletBinding()]
    param (
        [string]$SourcePath,
        [string]$DestinationPath,
        [switch]$CreateISO,
        [switch]$CreateUSB,
        [switch]$CreateVHD,
        [switch]$TaskEnableNetFX3,
        [switch]$TaskEnableEdge,
        [switch]$TaskEnableAppx,
        [switch]$TaskEnableWinRE,
        [switch]$TaskEnableWinPE,
        [switch]$TaskEnableWinPEADK,
        [switch]$TaskEnableWinPEDaRT,
        [switch]$TaskEnableWinPEAppx,
        [switch]$TaskEnableWinPEFonts,
        [switch]$TaskEnableWinPELanguagePacks,
        [switch]$TaskEnableWinPEWinRE,
        [switch]$TaskEnableWinPEWinREAppx,
        [switch]$TaskEnableWinPEWinREFonts,
        [switch]$TaskEnableWinPEWinRELanguagePacks
    )
}
```

**Parameters**:
*   **`-SourcePath`**: `[string]` - Path to the source OS image.
*   **`-DestinationPath`**: `[string]` - Path to the destination directory.
*   **`-CreateISO`**: `[switch]` - Create an ISO file for the build.
*   **`-CreateUSB`**: `[switch]` - Create a bootable USB for the build.
*   **`-CreateVHD`**: `[switch]` - Create a VHD for the build.
*   **`-TaskEnableNetFX3`**: `[switch]` - Enable .NET Framework 3.5.
*   **`-TaskEnableEdge`**: `[switch]` - Enable Microsoft Edge.
*   **`-TaskEnableAppx`**: `[switch]` - Enable AppX packages.
*   **`-TaskEnableWinRE`**: `[switch]` - Enable Windows Recovery Environment.
*   **`-TaskEnableWinPE`**: `[switch]` - Enable Windows PE.
*   **`-TaskEnableWinPEADK`**: `[switch]` - Enable Windows PE ADK components.
*   **`-TaskEnableWinPEDaRT`**: `[switch]` - Enable Windows PE DaRT components.
*   **`-TaskEnableWinPEAppx`**: `[switch]` - Enable Windows PE AppX packages.
*   **`-TaskEnableWinPEFonts`**: `[switch]` - Enable Windows PE fonts.
*   **`-TaskEnableWinPELanguagePacks`**: `[switch]` - Enable Windows PE language packs.
*   **`-TaskEnableWinPEWinRE`**: `[switch]` - Enable Windows PE WinRE.
*   **`-TaskEnableWinPEWinREAppx`**: `[switch]` - Enable Windows PE WinRE AppX packages.
*   **`-TaskEnableWinPEWinREFonts`**: `[switch]` - Enable Windows PE WinRE fonts.
*   **`-TaskEnableWinPEWinRELanguagePacks`**: `[switch]` - Enable Windows PE WinRE language packs.

**Output**: PSCustomObject representing the new OS build.
