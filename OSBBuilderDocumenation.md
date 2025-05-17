```markdown
# OSDBuilder Module Comprehensive Documentation

This document contains the complete generated documentation for the OSDBuilder PowerShell module, based on the provided script files. It is structured to consolidate all information into a single file while maintaining clear separation and metadata for each documented component.

---

# Module Manifest: OSDBuilder.psd1

```yaml
---
title: "Module Manifest: OSDBuilder.psd1"
type: "Module Manifest"
---
```

This file defines the metadata and structure of the OSDBuilder PowerShell module.

*   **`RootModule`**: `OSDBuilder.psm1`
    *   Specifies the primary script file for the module.
*   **`ModuleVersion`**: `24.10.8.1`
    *   The version number of this module.
*   **`CompatiblePSEditions`**: `Desktop`
    *   Indicates the module is compatible with PowerShell Desktop editions.
*   **`GUID`**: `adda1fa3-c13e-408b-b83f-f22b9cb3fd47`
    *   A unique identifier for the module.
*   **`Author`**: `David Segura`
*   **`CompanyName`**: `David Segura`
*   **`Copyright`**: `(c) 2024 David Segura. All rights reserved.`
*   **`Description`**:
    ```
    https://osdbuilder.osdeploy.com

    Requirements:
    PowerShell Module OSD 24.10.8.1 or newer
    ```
*   **`PowerShellVersion`**: `5.1`
    *   The minimum PowerShell version required.
*   **`RequiredModules`**:
    *   Specifies dependencies on other modules.
    ```powershell
    @{ModuleName = 'OSD'; ModuleVersion = '24.10.8.1'; Guid = '9fe5b9b6-0224-4d87-9018-a8978529f6f5'}
    ```
    *   This indicates a dependency on the `OSD` module, version `24.10.8.1` or newer.
*   **`FunctionsToExport`**:
    *   Lists all functions that are made publicly available when the module is imported.
    ```
    'Get-OSBuilds', 'Get-OSDBuilder', 'Get-OSMedia', 'Get-PEBuilds',
    'Import-OSMedia', 'Initialize-OSDBuilder', 'New-OSBuild',
    'New-OSBuildMultiLang', 'New-OSBuildTask', 'New-OSDBuilderContentPack',
    'New-OSDBuilderISO', 'New-OSDBuilderUSB', 'New-OSDBuilderVHD',
    'New-PEBuild', 'New-PEBuildTask', 'Save-OSDBuilderDownload',
    'Show-OSDBuilderInfo', 'Update-OSMedia'
    ```
*   **`CmdletsToExport`**: (None explicitly listed, typically for binary cmdlets)
*   **`VariablesToExport`**: (None explicitly listed)
*   **`AliasesToExport`**:
    *   Defines shorter or alternative names for exported functions.
    ```
    'Get-DownOSDBuilder', 'Get-OSBuilder', 'New-OSBMediaISO',
    'New-OSBMediaUSB', 'Show-OSBMediaInfo'
    ```
*   **`PrivateData`**:
    *   Contains additional metadata, often used by PowerShell Gallery.
    *   **`PSData`**:
        *   `Tags`: Keywords for discoverability (`OSD`, `OSDeploy`, `OSDBuilder`, etc.).
        *   `LicenseUri`: Link to the module's license.
        *   `ProjectUri`: Link to the module's project page (e.g., GitHub).
        *   `IconUri`: Link to an icon for the module.
        *   `ReleaseNotes`: Link to the module's release notes.

---

# Root Module Script: OSDBuilder.psm1

```yaml
---
title: "Root Module Script: OSDBuilder.psm1"
type: "Module Script"
---
```

The `OSDBuilder.psm1` script is the main executable file for the OSDBuilder module. Its primary responsibilities are to load all necessary function definitions and to export the public interface of the module.

**Key Operations**:

1.  **Function Discovery and Loading**:
    *   It defines two arrays, `$OSDPublicFunctions` and `$OSDPrivateFunctions`.
    *   `$OSDPublicFunctions` is populated by finding all `.ps1` files in the `$PSScriptRoot\Public\` directory (and its subdirectories).
    *   `$OSDPrivateFunctions` is populated by finding all `.ps1` files in the `$PSScriptRoot\Private\` directory (and its subdirectories). The `AllFunctions.ps1` file, containing the bulk of the core logic, would typically reside here or be structured similarly.
    *   It then iterates through the combined list of these discovered script files and dot-sources each one (`. $Import.FullName`). This action loads all functions defined within those files into the module's scope.
    *   Includes basic error handling to report if a function script fails to import.

2.  **Exporting Public Functions**:
    *   `Export-ModuleMember -Function $OSDPublicFunctions.BaseName`: This command explicitly exports only the functions whose script basenames were collected in `$OSDPublicFunctions`. This ensures that only functions intended to be part of the public API are directly callable by the user after importing the module.

3.  **Alias Creation**:
    *   `New-Alias -Name <AliasName> -Value <FunctionName> -Force -ErrorAction SilentlyContinue`: This creates several convenient aliases for some of the public functions.
        *   `Get-OSBuilder` for `Get-OSDBuilder`
        *   `New-OSBMediaISO` for `New-OSDBuilderISO`
        *   `New-OSBMediaUSB` for `New-OSDBuilderUSB`
        *   `Show-OSBMediaInfo` for `Show-OSDBuilderInfo`
        *   `Get-DownOSDBuilder` for `Save-OSDBuilderDownload`
    *   The script also contains commented-out legacy aliases (e.g., `ImportOSD` for `Import-OSMedia`), suggesting a history of name changes.

4.  **General Export**:
    *   `Export-ModuleMember -Function * -Alias *`: This is a broader export statement that ensures all functions (including any not explicitly listed if the previous export was more restrictive) and all aliases defined within the module's scope are exported.

In essence, `OSDBuilder.psm1` acts as the assembler and publisher for the module, bringing together all its components and defining what the user can directly interact with.

---

# README

(As provided in `README.md`)

# OSDBuilder
PowerShell Module
https://osdbuilder.osdeploy.com

---

# Initialization and Configuration

The OSDBuilder module relies on a specific initialization process and configuration settings, primarily managed by `Initialize-OSDBuilder.ps1` and utilized by `Get-OSDBuilder.ps1`.

---

## Function: Initialize-OSDBuilder

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

---

## Global Configuration Variables

OSDBuilder extensively uses two primary global hashtables, initialized by `Initialize-OSDBuilder`, to manage its configuration and state:

1.  **`$global:GetOSDBuilder`**:
    *   **Purpose**: Stores relatively static information, resolved paths, module details, and fetched public data.
    *   **Key Properties (Examples)**:
        *   `Home`: The root path of the OSDBuilder installation (e.g., `C:\OSDBuilder`).
        *   `JsonLocal`: Full path to the local `OSDBuilder.json` configuration file.
        *   `JsonGlobal`: Full path to the global `OSDBuilder.json` configuration file.
        *   `PSModuleOSD`, `PSModuleOSDBuilder`: PowerShell module objects for the loaded OSD and OSDBuilder modules.
        *   `VersionOSD`, `VersionOSDBuilder`: Locally installed versions of these modules.
        *   `PublicJsonURL`: URL to fetch public module information.
        *   `PublicJson`: The fetched data from `PublicJsonURL`.
        *   `VersionOSDPublic`, `VersionOSDBuilderPublic`: Latest public versions of the modules.
        *   `PathContentADK`, `PathContentDaRT`, `PathContentDrivers`, etc.: Full paths to specific subdirectories within the `Content` folder.

2.  **`$global:SetOSDBuilder`**:
    *   **Purpose**: Stores configurable settings that dictate the default behavior of OSDBuilder cmdlets and the primary paths for various components. These values can be overridden by parameters passed to cmdlets or by settings in the JSON configuration files.
    *   **Key Properties (Examples)**:
        *   `AllowContentPacks`: `[bool]` Whether to automatically process Content Packs.
        *   `AllowGlobalOptions`: `[bool]` Whether to load settings from the global `OSDBuilder.json`.
        *   `PathContent`: Path to the main `Content` directory (e.g., `<Home>\Content`).
        *   `PathContentPacks`: Path to the `ContentPacks` directory.
        *   `PathFeatureUpdates`: Path for downloaded Feature Updates.
        *   `PathMount`: Path for temporary WIM mounting.
        *   `PathOSBuilds`, `PathOSImport`, `PathOSMedia`, `PathPEBuilds`: Output paths for different types of builds/media.
        *   `PathTasks`, `PathTemplates`: Paths for task and template JSON files.
        *   `PathUpdates`: Path for downloaded Microsoft updates.
        *   `ImportOSMediaSkipGrid`: `[bool]` Default for the `-SkipGrid` parameter in `Import-OSMedia`.
        *   `NewOSBuildCreateISO`: `[bool]` Default for the `-CreateISO` parameter in `New-OSBuild`.
        *   Many other properties corresponding to default values for various cmdlet parameters.

These global variables are essential for the interconnectedness of the OSDBuilder functions, allowing them to share configuration and operate consistently.

---

## JSON Configuration Files

OSDBuilder allows for customization of its default settings through JSON configuration files. This provides a way to persist preferred defaults without modifying the module scripts.

1.  **Local Configuration File**:
    *   **Path**: `$global:GetOSDBuilder.Home\OSDBuilder.json` (e.g., `C:\OSDBuilder\OSDBuilder.json`).
    *   **Purpose**: Stores user-specific or instance-specific default settings.
    *   **Precedence**: Settings in this file typically override those from the global configuration file and the hardcoded defaults in `Initialize-OSDBuilder`.

2.  **Global Configuration File** (Optional):
    *   **Path**: `$env:ProgramData\OSDeploy\OSDBuilder.json`.
    *   **Purpose**: Can be used to set system-wide defaults if multiple users or OSDBuilder instances share a machine.
    *   **Loading**: Loaded only if `$global:SetOSDBuilder.AllowGlobalOptions` is `$true`.

**Structure of `OSDBuilder.json`**:
The JSON file contains key-value pairs where the keys correspond to the property names in the `$global:SetOSDBuilder` hashtable.

**Example `OSDBuilder.json` content**:
```json
{
  "PathUpdates": "D:\\OSDBuilder_Content\\Updates",
  "NewOSBuildCreateISO": true,
  "UpdateOSMediaDownload": true,
  "ImportOSMediaSkipGrid": false,
  "NewOSBuildTaskEnableNetFX3": true
}
```
In this example:
*   The default path for storing downloaded updates would be changed to `D:\OSDBuilder_Content\Updates`.
*   `New-OSBuild` would default to creating an ISO.
*   `Update-OSMedia` would default to downloading missing updates.
*   `Import-OSMedia` would default to showing the GridView for OS selection.
*   `New-OSBuildTask` would default to enabling .NET Framework 3.5.

---

## OSDBuilder Directory Structure

The OSDBuilder module operates using a well-defined directory structure, rooted at the path specified as the "OSDBuilder Home" (typically `C:\OSDBuilder`, stored in `$global:GetOSDBuilderHome`). This structure is crucial for organizing source files, outputs, configurations, and temporary working files. The main directories are typically created by `Get-OSDBuilder -CreatePaths`.

*   **`<OSDBuilderHome>`**: The root directory of the OSDBuilder instance.
    *   **`Content/`**:
        *   **Purpose**: Stores all source materials and content that can be injected into or used to customize OS and WinPE images.
        *   **Key Subdirectories**:
            *   `ADK/`: Contains Windows ADK optional components (e.g., `WinPE-NetFx.cab`, `WinPE-PowerShell.cab`) organized by OS version and architecture.
            *   `DaRT/`: Stores Microsoft DaRT (Diagnostics and Recovery Toolset) `Tools*.cab` files and `DartConfig.dat`.
            *   `Drivers/`: Root directory for storing driver `.inf` files and their associated binaries, typically organized in subfolders.
            *   `ExtraFiles/`: For arbitrary files and folders that need to be copied directly into the target image.
            *   `IsoExtract/`: Used to store content extracted from ISO files, such as Language Pack ISOs or Features on Demand ISOs. Often organized by OS version and content type (e.g., `Windows 10 21H2 Language`, `Windows 10 21H2 FOD x64`).
            *   `OneDrive/`: Location for `OneDriveSetup.exe` (Production or Enterprise versions).
            *   `Packages/`: For `.msu` and `.cab` files that will be added to the OS image as Windows packages (distinct from updates).
            *   `Scripts/`: PowerShell scripts (`.ps1`) that can be executed at various stages of image customization.
            *   `StartLayout/`: Stores `LayoutModification.xml` files for customizing the Windows Start Menu.
            *   `Unattend/`: Contains `Unattend.xml` files for automating Windows Setup phases.
    *   **`ContentPacks/`**:
        *   **Purpose**: Allows users to group various content items (drivers, scripts, registry settings, extra files, ADK components for PE) into reusable "packs" for modular application.
        *   **Key Subdirectories**:
            *   `_Global/`: A special Content Pack whose contents are automatically considered for application if it exists.
            *   `<YourContentPackName>/`: Each user-defined content pack has its own folder, which then contains subdirectories mirroring the structure within `Content/` (e.g., `OSDrivers/`, `PEScripts/`, `OSRegistry/`) or specific to content pack types (e.g., `Media/`, `PEADK/`).
    *   **`FeatureUpdates/`**:
        *   **Purpose**: Stores downloaded Windows Feature Update ESD files (e.g., from VLSC or MSDN) and their expanded contents (which resemble an OS installation source).
    *   **`Mount/`**:
        *   **Purpose**: Default temporary location for mounting Windows Image (`.wim`) files during servicing operations. OSDBuilder creates uniquely named subdirectories here for each mount operation.
    *   **`OSBuilds/`**:
        *   **Purpose**: The output directory for customized OS images created by the `New-OSBuild` cmdlet. Each successful build results in a new subdirectory here, named descriptively (e.g., based on OS name, architecture, ReleaseID, UBR, or custom name).
    *   **`OSImport/`**:
        *   **Purpose**: The initial output directory when OS installation media is imported using `Import-OSMedia`. These are typically base images before extensive servicing or customization.
    *   **`OSMedia/`**:
        *   **Purpose**: The output directory for fully serviced and updated OS images, typically resulting from `Update-OSMedia` or a `New-OSBuild` that has been updated. This represents a "golden" or master image.
    *   **`PEBuilds/`**:
        *   **Purpose**: The output directory for customized WinPE images created by the `New-PEBuild` cmdlet. Each PE build gets its own subdirectory.
    *   **`Tasks/`**:
        *   **Purpose**: Stores user-created JSON files that define a specific set of customizations and parameters for `New-OSBuild` or `New-PEBuild`. These tasks can be executed repeatedly.
    *   **`Templates/`**:
        *   **Purpose**: Stores JSON task files that function as templates. Templates can be automatically applied during `New-OSBuild` if their naming convention matches certain criteria (e.g., "Global" templates, or templates matching the OS family of the build). This allows for standardized baseline customizations.
    *   **`Updates/`**:
        *   **Purpose**: Stores downloaded Microsoft Update packages (`.msu` and `.cab` files) obtained via `Save-OSDBuilderDownload`. These are used by `Update-OSMedia` and `New-OSBuild` to service images.
    *   **`OSDBuilder.json`** (File, optional):
        *   **Purpose**: Local configuration file for OSDBuilder instance-specific settings.

Understanding this directory structure is key to effectively using OSDBuilder, as it dictates where input files are sourced and where output artifacts are placed.

---

# Public Cmdlets

These are the user-facing functions of the OSDBuilder module.

---

## Function: Get-OSBuilds

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
        [ValidateSet('x64','x86')]
        [string]$OSArch = 'x64',
        [switch]$Newest,
        [ValidateSet('Client','Server')]
        [string]$OSInstallationType,
        [ValidateSet(10)]
        [string]$OSMajorVersion,
        [ValidateSet ('24H2','23H2','22H2','21H2','21H1','20H2',2004,1909,1903,1809)]
        [string]$OSReleaseId,
        [ValidateSet('OK','Superseded')]
        [string]$Revision,
        [ValidateSet('OK','Update')]
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

---

## Function: Get-OSMedia

```yaml
---
title: "Function: Get-OSMedia"
type: "Public Cmdlet"
module_file: "Get-OSMedia.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSImport"
    - "$SetOSDBuilderPathOSMedia"
    - "$AllOSDUpdates (from Get-OSDUpdates)"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-OSDUpdates"
  - "Get-ChildItem"
  - "Import-Clixml"
  - "Out-GridView"
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
    Param (
        [switch]$GridView,
        [ValidateSet('x64','x86')]
        [string]$OSArch,
        [switch]$Newest,
        [ValidateSet('Client','Server')]
        [string]$OSInstallationType,
        [ValidateSet(10)]
        [string]$OSMajorVersion,
        [ValidateSet ('22H2','21H2','21H1','20H2',2004,1909,1903,1809,1803,1709,1703,1607,1511,1507)]
        [string]$OSReleaseId,
        [ValidateSet('OK','Superseded')]
        [string]$Revision,
        [ValidateSet('OK','Update')]
        [string]$Updates
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

---

## Function: Get-PEBuilds

```yaml
---
title: "Function: Get-PEBuilds"
type: "Public Cmdlet"
module_file: "Get-PEBuilds.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathPEBuilds"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-ChildItem"
  - "Import-Clixml"
  - "Out-GridView"
---
```

**Synopsis**: Returns all Operating Systems in OSDBuilder\\PEBuilds.
**Description**: Returns all PE (Preinstallation Environment) builds located in the `$SetOSDBuilderPathPEBuilds` directory as PowerShell Custom Objects. Each object contains detailed metadata about the PE build.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/get-pebuilds](https://osdbuilder.osdeploy.com/module/functions/get-pebuilds)

**Syntax**:
```powershell
function Get-PEBuilds {
    [CmdletBinding()]
    param (
        [switch]$GridView
    )
}
```

**Parameters**:
*   **`-GridView`**: `[switch]` - Displays results in GridView.

**Key Operations**:
1.  Calls `Get-OSDBuilder`.
2.  Scans `$SetOSDBuilderPathPEBuilds` for valid PEBuild directories.
3.  Extracts metadata from `Get-WindowsImage.xml` and `CurrentVersion.xml`.
4.  Calculates properties like `MediaType` ('PEBuild'), `OSMFamily`, `UpdateOS`, `ReleaseId`, `UBR`, etc.
5.  Returns PSCustomObjects representing the PEBuilds, optionally via `Out-GridView`.

**Output**: Array of PSCustomObjects.

---

## Function: Import-OSMedia

```yaml
---
title: "Function: Import-OSMedia"
type: "Public Cmdlet"
module_file: "Import-OSMedia.ps1"
scope_dependencies:
  reads:
    - "$global:SetOSDBuilder.ImportOSMediaAllowUnsupportedOS" # and other defaults
    - "$global:SetOSDBuilderPathFeatureUpdates"
    - "$global:SetOSDBuilderPathOSImport"
    - "$global:SetOSDBuilderPathMount"
    - "$env:Temp"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-WindowsImage"
  - "Export-WindowsImage"
  - "Mount-ImportOSMediaWim"
  - "Get-RegCurrentVersion"
  - "Save-AutoExtraFilesOS"
  - "Save-SessionsXmlOS"
  - "Save-InventoryOS"
  - "Save-WimsPE"
  - "Save-InventoryPE"
  - "Dismount-WindowsImage"
  - "Save-OSMediaWindowsImageContent"
  - "Save-OSMediaVariables"
  - "Show-OSDBuilderInfo"
  - "Update-OSMedia"
  - "New-OSBuild"
  - "Get-PSDrive"
  - "Get-ChildItem"
  - "Get-Item"
  - "New-Item"
  - "Remove-Item"
  - "Set-ItemProperty"
  - "robocopy.exe"
  - "Out-GridView"
  - "Start-Transcript", "Stop-Transcript"
---
```

**Synopsis**: Imports a supported Operating System into the OSDBuilder OSImport directory.
**Description**: Scans for Windows installation media, allows selection of specific images, and imports them into `$SetOSDBuilderPathOSImport`. Copies files, exports WIM, gathers metadata, and can trigger update/build actions.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/import-osmedia](https://osdbuilder.osdeploy.com/module/functions/import-osmedia)

**Syntax**:
```powershell
function Import-OSMedia {
    [CmdletBinding()]
    param (
        [switch]$AllowUnsupportedOS = $global:SetOSDBuilder.ImportOSMediaAllowUnsupportedOS,
        [Alias('Build')] [switch]$BuildNetFX = $global:SetOSDBuilder.ImportOSMediaBuildNetFX,
        [ValidateSet(...)] [Alias('Edition')] [string[]]$EditionId = $global:SetOSDBuilder.ImportOSMediaEditionId,
        [Alias('Index')] [int]$ImageIndex = $global:SetOSDBuilder.ImportOSMediaImageIndex,
        [ValidateSet(...)] [string[]]$ImageName = $global:SetOSDBuilder.ImportOSMediaImageName,
        [ValidateSet('Client','Server','Server Core')] [string[]]$InstallationType = $global:SetOSDBuilder.ImportOSMediaInstallationType,
        [String]$Path = $global:SetOSDBuilder.ImportOSMediaPath,
        [Alias('OSDInfo')] [switch]$ShowInfo = $global:SetOSDBuilder.ImportOSMediaShowInfo,
        [switch]$SkipFeatureUpdates = $global:SetOSDBuilder.ImportOSMediaSkipFeatureUpdates,
        [Alias('SkipGridView')] [switch]$SkipGrid = $global:SetOSDBuilder.ImportOSMediaSkipGrid,
        [Alias('UpdateOSMedia')] [switch]$Update = $global:SetOSDBuilder.ImportOSMediaUpdate
    )
}
```

**Parameters**: (See above for details)

**Key Operations**:
1.  Initialization and Block checks.
2.  Discovers source media from paths, PSDrives, or FeatureUpdates.
3.  Enumerates images within WIM/ESD files.
4.  Filters and allows selection via GridView (unless skipped).
5.  For each selected image:
    *   Exports ESD to temporary WIM if needed.
    *   Mounts image read-only.
    *   Gets registry info (Build, UBR, ReleaseID).
    *   Constructs `$OSMediaName` and destination `$OSMediaPath` under `$SetOSDBuilderPathOSImport`.
    *   Creates destination directories.
    *   Copies OS files (excluding WIMs) and exports selected WIM index to destination.
    *   Saves various inventories (AppX, Features, Packages, Sessions, PE WIMs, PE Inventory).
    *   Dismounts image (discarding changes).
    *   Saves final configuration and variables.
    *   Optionally calls `Update-OSMedia` or `New-OSBuild`.

**Output**: Creates a new directory under `$SetOSDBuilderPathOSImport` with imported media files and metadata.

---

## Function: New-OSBuild

```yaml
---
title: "Function: New-OSBuild"
type: "Public Cmdlet"
module_file: "New-OSBuild.ps1"
scope_dependencies:
  reads:
    - "$global:SetOSDBuilder.NewOSBuildCreateISO" # and many other defaults
    - "$AllOSDUpdates (from Get-OSDUpdates)"
    - "$SetOSDBuilderPathOSMedia"
    - "$SetOSDBuilderPathOSImport"
    - "$SetOSDBuilderPathOSBuilds"
    - "$SetOSDBuilderPathTemplates"
    - "$SetOSDBuilderPathTasks"
  writes:
    - Files and directories under "$SetOSDBuilderPathOSBuilds/<NewOSBuildName>"
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-OSDUpdates"
  - "Get-OSMedia"
  - "Get-OSBuildTask"
  - "Show-TaskInfo"
  - "Copy-MediaOperatingSystem"
  - "Mount-WinPEwim", "Mount-WinREwim", "Mount-WinSEwim"
  - "Update-SetupDUMEDIA"
  - "Add-ContentADKWinPE", "Add-ContentADKWinRE", "Add-ContentADKWinSE"
  - "Expand-DaRTPE"
  - "Update-ServicingStackPE", "Update-CumulativePE"
  - "Import-AutoExtraFilesPE", "Enable-WinPEOSDCloud", "Enable-WinREWiFi"
  - "Add-ContentExtraFilesPE", "Add-ContentDriversPE", "Add-ContentScriptsPE"
  - "Add-ContentPack"
  - "Update-SourcesPE", "Save-PackageInventoryPE", "Dismount-WimsPE", "Export-PEWims", "Export-PEBootWim", "Save-InventoryPE"
  - "Mount-InstallwimOS", "Set-WinREWimOS"
  - "Get-RegCurrentVersion", "Save-RegistryCurrentVersionOS"
  - "Add-LanguagePacksOS", "Add-LanguageInterfacePacksOS", "Add-LanguageFeaturesOnDemandOS", "Add-LocalExperiencePacksOS", "Copy-MediaLanguageSources", "Set-LanguageSettingsOS"
  - "Add-WindowsPackageOS", "Add-FeaturesOnDemandOS"
  - "Update-ComponentOS", "Update-ServicingStackOS", "Update-CumulativeOS", "Update-AdobeOS", "Update-DotNetOS", "Update-OptionalOS"
  - "Invoke-DismCleanupImage"
  - "Enable-WindowsOptionalFeatureOS", "Enable-NetFXOS", "Remove-AppxProvisionedPackageOS", "Remove-WindowsPackageOS", "Remove-WindowsCapabilityOS", "Disable-WindowsOptionalFeatureOS"
  - "Add-ContentDriversOS", "Add-ContentExtraFilesOS", "Add-ContentStartLayout", "Add-ContentUnattend", "Add-ContentScriptsOS"
  - "Import-RegistryRegOS", "Import-RegistryXmlOS"
  - "Save-AutoExtraFilesOS", "Save-SessionsXmlOS", "Save-InventoryOS"
  - "Dismount-InstallwimOS", "Export-InstallwimOS"
  - "Save-WindowsImageContentOS", "Save-VariablesOSD"
  - "New-OSDBuilderISO", "New-OSDBuilderVHD", "Show-OSDBuilderInfo"
---
```

**Synopsis**: Creates a new OSBuild from an OSBuild Task or directly from OSMedia.
**Description**: Creates customized Windows OS images by servicing WinPE and OS WIMs with updates, drivers, packages, scripts, and configurations, based on a task file or direct parameters.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osbuild](https://osdbuilder.osdeploy.com/module/functions/new-osbuild)

**Syntax**: (See above for details)

**Parameters**: (See above for details)

**Key Operations**:
1.  Selects mode (Task-based or Taskless).
2.  Identifies source OSMedia.
3.  Prepares working paths and copies base media.
4.  Services WinPE WIMs (mount, add ADK, DaRT, updates, content, dismount, export).
5.  Services OS image (mount, set WinRE, get UBR, add language/features/packages/updates/content, cleanup, dismount, export).
6.  Finalizes build (rename directory, save config/inventory, optional ISO/VHD).

**Output**: New OSBuild directory under `$SetOSDBuilderPathOSBuilds`, optionally ISO/VHD.

---

## Function: New-OSBuildMultiLang

```yaml
---
title: "Function: New-OSBuildMultiLang"
type: "Public Cmdlet"
module_file: "New-OSBuildMultiLang.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSBuilds"
    - "$AllOSDUpdates (from Get-OSDUpdates)"
    - "$env:Temp"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-OSBuilds"
  - "Get-OSDUpdates"
  - "Import-Clixml"
  - "robocopy.exe"
  - "Export-WindowsImage"
  - "Mount-WindowsImage"
  - "Save-WindowsImage"
  - "Dismount-WindowsImage"
  - "dism.exe"
  - "Update-CumulativeOS"
  - "Show-ActionTime"
  - "Out-GridView"
  - "New-Item"
  - "Remove-Item"
---
```

**Synopsis**: Separates an OSBuild with Language Packs into separate Image Indexes.
**Description**: Takes an existing OSBuild with multiple languages and creates a new OSBuild where each language is a separate WIM index, reapplying the LCU to each.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osbuildmultilang](https://osdbuilder.osdeploy.com/module/functions/new-osbuildmultilang)

**Syntax**:
```powershell
function New-OSBuildMultiLang {
    [CmdletBinding()]
    param (
        [Parameter(Position = 0, Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]$CustomName
    )
}
```

**Parameters**:
*   **`-CustomName`**: `[string]` (Mandatory) - Base name for the new multi-language build.

**Key Operations**:
1.  Initialization and Block checks.
2.  Selects a source OSBuild with multiple languages via GridView.
3.  Copies source build structure to a new destination directory.
4.  Gets language and image metadata from the copied build.
5.  Exports the source WIM to a temporary WIM.
6.  Exports the default language index to the new build's WIM.
7.  Mounts the temporary WIM.
8.  For each non-default language: sets language in mounted image, reapplies LCU, saves changes, exports as a new index to the new build's WIM.
9.  Cleans up temporary WIM and mount directory.

**Output**: New OSBuild directory under `$SetOSDBuilderPathOSBuilds` with a multi-index WIM.

---

## Function: New-OSBuildTask

```yaml
---
title: "Function: New-OSBuildTask"
type: "Public Cmdlet"
module_file: "New-OSBuildTask.ps1"
scope_dependencies:
  reads:
    - "$global:SetOSDBuilder.NewOSBuildTaskTaskName" # and other defaults
    - "$SetOSDBuilderPathTasks"
    - "$SetOSDBuilderPathTemplates"
    - "$SetOSDBuilderPathContent"
    - "$OSMedia"
  writes:
    - JSON task file to "$SetOSDBuilderPathTasks" or "$SetOSDBuilderPathTemplates"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-OSMedia"
  - "Get-WindowsImage"
  - "Get-TaskContentPacks"
  - "Get-TaskRemoveAppxProvisionedPackage"
  - "Get-TaskRemoveWindowsCapability"
  - "Get-TaskRemoveWindowsPackage"
  - "Get-TaskDisableWindowsOptionalFeature"
  - "Get-TaskEnableWindowsOptionalFeature"
  - "Get-TaskContentDrivers"
  - "Get-TaskContentExtraFiles"
  - "Get-TaskContentScripts"
  - "Get-TaskContentStartLayoutXML"
  - "Get-TaskContentUnattendXML"
  - "Get-TaskContentAddWindowsPackage"
  - "Get-TaskContentIsoExtract"
  - "Get-TaskContentAddFeatureOnDemand"
  - "Get-TaskContentLanguagePack"
  - "Get-TaskContentLanguageFeature"
  - "Get-TaskContentLanguageInterfacePack"
  - "Get-TaskContentLocalExperiencePacks"
  - "Get-TaskContentLanguageCopySources"
  - "Get-TaskWinPEDaRT"
  - "Get-TaskWinPEADKPE", "Get-TaskWinPEADKRE", "Get-TaskWinPEADKSE"
  - "Get-TaskWinPEDrivers"
  - "Get-TaskWinPEExtraFilesPE", "Get-TaskWinPEExtraFilesRE", "Get-TaskWinPEExtraFilesSE"
  - "Get-TaskWinPEScriptsPE", "Get-TaskWinPEScriptsRE", "Get-TaskWinPEScriptsSE"
  - "Out-GridView"
  - "Get-Content", "ConvertTo-Json", "Out-File"
---
```

**Synopsis**: Creates a JSON Task for use with New-OSBuild.
**Description**: Interactively creates a JSON file defining OS image customizations (content, features, packages, language, PE config) based on a selected base OSMedia and user selections via GridView. Can save as a Task or Template.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osbuildtask](https://osdbuilder.osdeploy.com/module/functions/new-osbuildtask)

**Syntax**: (See above for details)

**Parameters**: (See above for details)

**Key Operations**:
1.  Initialization and Block checks.
2.  Sets task path, loads existing task if updating.
3.  Selects base OSMedia via GridView (or pipeline).
4.  Presents GridViews for user to select Content Packs, drivers, extra files, scripts, Start Layout, Unattend, packages, features/capabilities to add/remove, language packages/features, and WinPE content.
5.  Consolidates selections and existing task items.
6.  Constructs an ordered hashtable representing the task configuration.
7.  Converts task hashtable to JSON and saves it to the specified path (`Tasks` or `Templates`).

**Output**: JSON file in Tasks or Templates directory.

---

## Function: New-OSDBuilderContentPack

```yaml
---
title: "Function: New-OSDBuilderContentPack"
type: "Public Cmdlet"
module_file: "New-OSDBuilderContentPack.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathContentPacks"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "New-Item"
---
```

**Synopsis**: Creates an OSDBuilder ContentPack.
**Description**: Creates or Updates a standardized directory structure for a ContentPack under `$SetOSDBuilderPathContentPacks`, based on the specified content type (All, OS, WinPE, MultiLang).
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuildercontentpack](https://osdbuilder.osdeploy.com/module/functions/new-osdbuildercontentpack)

**Syntax**:
```powershell
function New-OSDBuilderContentPack {
    [CmdletBinding()]
    param (
        [Parameter(Position = 0, Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]$Name,
        [ValidateSet('All','OS','WinPE','MultiLang')]
        [string]$ContentType = 'All'
    )
}
```

**Parameters**:
*   **`-Name`**: `[string]` (Mandatory) - Name of the ContentPack folder.
*   **`-ContentType`**: `[string]` - Type of structure to create. Accepted Values: `All`, `OS`, `WinPE`, `MultiLang`. Default: `All`.

**Key Operations**:
1.  Initialization.
2.  Creates a main folder `$SetOSDBuilderPathContentPacks\$Name`.
3.  Based on `$ContentType`, creates predefined subdirectories (e.g., `OSDrivers\ALL`, `PEADK`, `OSExtraFiles\x64 Subdirs`).

**Output**: Creates directories.

---

## Function: New-OSDBuilderISO

```yaml
---
title: "Function: New-OSDBuilderISO"
type: "Public Cmdlet"
module_file: "New-OSDBuilderISO.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathContent"
    - "$env:PROCESSOR_ARCHITECTURE"
    - "$env:ProgramFiles" # For ADK path
    - "$env:ProgramFiles(x86)" # For ADK path
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-OSMedia"
  - "Get-OSBuilds"
  - "Get-PEBuilds"
  - "Import-Clixml"
  - "New-Item"
  - "Test-Path"
  - "Start-Process"
  - "Out-GridView"
---
```

**Synopsis**: Creates an ISO of any OSDBuilder Media.
**Description**: Formats a selected USB drive and copies OSDBuilder media content to it, making it bootable.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderiso](https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderiso)

**Syntax**:
```powershell
function New-OSDBuilderISO {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipelineByPropertyName)]
        [string[]]$FullName,
        [switch]$PassThru
    )
}
```

**Parameters**:
*   **`-FullName`**: `[string[]]` - Path(s) to the OSDBuilder media directory.
*   **`-PassThru`**: `[switch]` - Return created ISO info.

**Key Operations**:
1.  Initialization and gathers all media.
2.  Locates `oscdimg.exe`.
3.  Selects media via GridView (if `-FullName` not provided).
4.  For each selected media:
    *   Sets source (`<Media>\OS`) and destination (`<Media>\ISO`) paths.
    *   Gets image metadata for ISO label/filename.
    *   Locates boot files (`etfsboot.com`, `efisys.bin`).
    *   Runs `oscdimg.exe` with appropriate arguments to create the ISO.
    *   Optionally collects ISO info for PassThru.

**Output**: `.iso` file in the `ISO` subdirectory of the media. Optionally PSCustomObject(s) if `-PassThru`.

---

## Function: New-OSDBuilderUSB

```yaml
---
title: "Function: New-OSDBuilderUSB"
type: "Public Cmdlet"
module_file: "New-OSDBuilderUSB.ps1"
scope_dependencies:
  reads: []
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-OSMedia"
  - "Get-OSBuilds"
  - "Get-PEBuilds"
  - "Get-Disk"
  - "Clear-Disk"
  - "New-Partition"
  - "Format-Volume"
  - "Copy-Item"
  - "Set-Location"
  - "Out-GridView"
---
```

**Synopsis**: Creates a bootable USB of any OSDBuilder Media.
**Description**: Formats a selected USB drive (FAT32), copies OSDBuilder media content (`<Media>\OS`) to it, and makes it bootable using `bootsect.exe`.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderusb](https://osdbuilder.osdeploy.com/module/functions/new-osdbuilderusb)

**Syntax**:
```powershell
function New-OSDBuilderUSB {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipelineByPropertyName)]
        [string]$FullName,
        [ValidateLength(1,11)]
        [string]$USBLabel
    )
}
```

**Parameters**:
*   **`-FullName`**: `[string]` - Path to the OSDBuilder media directory.
*   **`-USBLabel`**: `[string]` - Volume label for the USB. Length 1-11.

**Key Operations**:
1.  Initialization and Block checks.
2.  Gathers all media.
3.  Selects a single media item via GridView (if `-FullName` not provided).
4.  Selects a USB drive via GridView (filters for USB, <33GB).
5.  Formats the selected USB drive as FAT32, creates an active partition, and assigns a label.
6.  Changes location to `<Media>\OS\boot`.
7.  Runs `bootsect.exe` to make the USB bootable.
8.  Copies all files from `<Media>\OS` to the USB drive.

**Output**: Bootable USB drive.

---

## Function: New-OSDBuilderVHD

```yaml
---
title: "Function: New-OSDBuilderVHD"
type: "Public Cmdlet"
module_file: "New-OSDBuilderVHD.ps1"
scope_dependencies:
  reads:
    - "$env:Temp"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-OSMedia"
  - "Get-OSBuilds"
  - "Get-Module"
  - "New-VHD"
  - "Mount-DiskImage"
  - "Get-DiskImage"
  - "Get-Disk"
  - "Initialize-Disk"
  - "New-Partition"
  - "Format-Volume"
  - "Add-PartitionAccessPath"
  - "Get-Partition"
  - "Get-PartitionSupportedSize"
  - "Resize-Partition"
  - "Expand-WindowsImage"
  - "Dismount-DiskImage"
  - "Out-GridView"
  - "Remove-Item"
  - "New-Item", "Set-Content", "Add-Content"
---
```

**Synopsis**: Creates an VHD(X) of any OSMedia or OSBuild.
**Description**: Creates a bootable VHD or VHDX file from an OSMedia or OSBuild. Partitions, formats, applies the WIM, and sets up boot files.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-osdbuildervhd](https://osdbuilder.osdeploy.com/module/functions/new-osdbuildervhd)

**Syntax**:
```powershell
function New-OSDBuilderVHD {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipelineByPropertyName)]
        [string]$FullName,
        [string]$OSDriveLabel = 'OSDisk',
        [int32]$VHDSizeGB = 50,
        [switch]$IncludeRecoveryPartition
    )
}
```

**Parameters**:
*   **`-FullName`**: `[string]` - Path to the source media directory.
*   **`-OSDriveLabel`**: `[string]` - Label for the OS partition. Default: `OSDisk`.
*   **`-VHDSizeGB`**: `[int32]` - Size of the VHD in GB. Default: `50`.
*   **`-IncludeRecoveryPartition`**: `[switch]` - Include a Recovery partition (GPT only).

**Key Operations**:
1.  Initialization and Block checks (requires Hyper-V module).
2.  Gathers OSMedia and OSBuilds.
3.  Selects a single media item via GridView (if `-FullName` not provided).
4.  Determines VHD type (VHD/VHDX) and partition style (MBR/GPT) based on OS version.
5.  Creates destination `VHD` folder.
6.  Creates a new dynamic VHD/VHDX.
7.  Mounts the VHD and initializes the disk.
8.  Partitions and formats the disk (MBR: 1 partition; GPT: System, MSR, OS, optional Recovery).
9.  Applies the `install.wim` to the OS partition.
10. Runs `bcdboot.exe` to make the VHD bootable.
11. For GPT, uses `diskpart.exe` to set the System partition ID/attributes.
12. Dismounts the VHD.

**Output**: `.vhd` or `.vhdx` file in the `VHD` subdirectory of the source media.

---

## Function: New-OSDCloudOSMedia

```yaml
---
title: "Function: New-OSDCloudOSMedia"
type: "Public Cmdlet"
module_file: "New-OSDCloudOSMedia.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathOSImport"
    - "$SetOSDBuilderPathOSMedia"
    - "$SetOSDBuilderPathMount"
    - "$SetOSDBuilderPathContentOneDrive"
    - "$global:GetOSDBuilder.VersionOSDBuilder"
  writes:
    - Files and directories under "$SetOSDBuilderPathOSMedia/<OSMediaName> OSDCloud"
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-WinPE", "Block-StandardUser", "Block-WindowsVersionNe10", "Block-PowerShellVersionLt5", "Block-NoCurl"
  - "Get-OSMedia"
  - "Get-WindowsImage"
  - "Get-AdkPaths"
  - "New-DirectoriesOSMedia"
  - "Show-WorkingInfoOS"
  - "Copy-MediaOperatingSystem"
  - "Mount-WinPEwim", "Mount-WinREwim", "Mount-WinSEwim"
  - "Add-WindowsPackage"
  - "Save-WindowsImage"
  - "Expand-DaRTPE"
  - "Import-AutoExtraFilesPE"
  - "Enable-WinPEOSDCloud"
  - "Enable-WinREWiFi"
  - "Save-PackageInventoryPE"
  - "Dismount-WimsPE"
  - "Export-PEWims", "Export-PEBootWim"
  - "Save-InventoryPE"
  - "Mount-InstallwimOS", "Set-WinREWimOS"
  - "Get-RegCurrentVersion", "Save-RegistryCurrentVersionOS"
  - "Add-ContentPack"
  - "Add-WindowsPackageOS", "Add-FeaturesOnDemandOS"
  - "Enable-WindowsOptionalFeatureOS", "Enable-NetFXOS", "Remove-AppxProvisionedPackageOS", "Remove-WindowsPackageOS", "Remove-WindowsCapabilityOS", "Disable-WindowsOptionalFeatureOS"
  - "Add-ContentDriversOS", "Add-ContentExtraFilesOS", "Add-ContentStartLayout", "Add-ContentUnattend", "Add-ContentScriptsOS"
  - "Import-RegistryRegOS", "Import-RegistryXmlOS"
  - "Save-AutoExtraFilesOS", "Save-SessionsXmlOS", "Save-InventoryOS"
  - "Dismount-InstallwimOS", "Export-InstallwimOS"
  - "Save-WindowsImageContentOS", "Save-VariablesOSD"
  - "New-OSDBuilderISO"
  - "Out-GridView"
  - "Start-Transcript", "Stop-Transcript"
---
```

**Synopsis**: Creates a specialized OSDCloud-ready OS Media from an existing OSImport.
**Description**: Takes a Win10/11 OSImport (>= build 19041), services WinPE with ADK, DaRT, OSDCloud features, updates OneDrive, and applies standard customizations to the OS image. Creates a new OSMedia suffixed "OSDCloud".

**Syntax**:
```powershell
function New-OSDCloudOSMedia {
    [CmdletBinding()]
    param (
        [Alias('PauseOS','PauseDismount')]
        [switch]$PauseDismountOS,
        [Alias('PausePE')]
        [switch]$PauseDismountPE
    )
}
```

**Parameters**:
*   **`-PauseDismountOS`**: `[switch]` - Pause before dismounting OS WIM.
*   **`-PauseDismountPE`**: `[switch]` - Pause before dismounting PE WIMs.

**Key Operations**:
1.  Initialization and Block checks.
2.  Selects Win10/11 OSImport via GridView.
3.  For each selected OSImport:
    *   Sets working paths under `$SetOSDBuilderPathOSMedia`.
    *   Copies base media, creates directories, starts transcript.
    *   Services WinPE (mount, add ADK/DaRT/OSDCloud/WiFi, save, dismount, export, save inventory).
    *   Services OS (mount, set WinRE, get UBR, add content packs/packages/features, update OneDrive, add drivers/extra files/layout/unattend/scripts/registry, save inventory/sessions, dismount, export, save config/variables).
    *   Cleans up temp files.
    *   Creates ISO.
    *   Stops transcript.

**Output**: New OSMedia directory under `$SetOSDBuilderPathOSMedia` with "OSDCloud" suffix, including ISO.

---

## Function: New-PEBuild

```yaml
---
title: "Function: New-PEBuild"
type: "Public Cmdlet"
module_file: "New-PEBuild.ps1"
scope_dependencies:
  reads:
    - "$global:SetOSDBuilder.NewPEBuildCreateISO" # and other defaults
    - "$SetOSDBuilderPathPEBuilds"
    - "$SetOSDBuilderPathTasks"
    - "$SetOSDBuilderPathOSMedia"
    - "$SetOSDBuilderPathMount"
    - "$SetOSDBuilderPathContent"
  writes:
    - Files and directories under "$SetOSDBuilderPathPEBuilds/<TaskName or CustomName>"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-PEBuildTask"
  - "Get-OSMedia"
  - "Get-WindowsImage"
  - "New-Item"
  - "Copy-Item"
  - "Remove-Item"
  - "dism.exe"
  - "Mount-PEBuild"
  - "Get-RegCurrentVersion"
  - "Set-PEBuildScratchSpace", "Set-PEBuildTargetPath"
  - "Add-ContentPack"
  - "Add-ContentADKWinPE"
  - "Expand-DaRTPE"
  - "Enable-WinPEOSDCloud"
  - "Enable-WinREWiFi"
  - "Add-WindowsDriver"
  - "Invoke-Expression"
  - "Dismount-WindowsImage"
  - "Export-WindowsImage"
  - "Save-WindowsImageContentPE", "Save-VariablesOSD"
  - "New-OSDBuilderISO"
  - "Show-OSDBuilderInfo"
  - "Out-GridView"
  - "Start-Transcript", "Stop-Transcript"
  - "Out-File"
---
```

**Synopsis**: Creates a new PEBuild from a PEBuild Task.
**Description**: Takes a PEBuild Task, selects base OSMedia, copies/exports source WIM, mounts it, applies ADK, DaRT, drivers, scripts, extra files, and other customizations defined in the task. Exports the final PE WIM.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-pebuild](https://osdbuilder.osdeploy.com/module/functions/new-pebuild)

**Syntax**: (See above for details)

**Parameters**: (See above for details)

**Key Operations**:
1.  Initialization and Block checks.
2.  Selects PEBuild Task via GridView.
3.  For each selected task:
    *   Loads task parameters.
    *   Selects base OSMedia.
    *   Sets working paths under `$SetOSDBuilderPathPEBuilds`.
    *   Copies base boot files, exports source PE WIM to temp.
    *   Mounts temp PE WIM.
    *   Sets Scratch Space and Target Path.
    *   Applies ADK, DaRT, MDT content (if specified), AutoExtraFiles, OSDCloud, WiFi, extra files, drivers, scripts, PoshMods, Registry from task and Content Packs.
    *   Saves package inventory.
    *   Dismounts PE WIM (saving changes).
    *   Exports final PE WIMs (`boot.wim`, `LiteTouchPE*.wim`, `WinRE.wim`, `WinPE.wim`).
    *   Saves final config/variables.
    *   Cleans up temp files.
    *   Optionally creates ISO or shows info.
    *   Stops transcript.

**Output**: New PEBuild directory under `$SetOSDBuilderPathPEBuilds` with customized PE WIMs. Optionally ISO.

---

## Function: New-PEBuildTask

```yaml
---
title: "Function: New-PEBuildTask"
type: "Public Cmdlet"
module_file: "New-PEBuildTask.ps1"
scope_dependencies:
  reads:
    - "$global:SetOSDBuilder.NewPEBuildTaskTaskName" # and other defaults
    - "$SetOSDBuilderPathTasks"
    - "$SetOSDBuilderPathOSMedia"
    - "$SetOSDBuilderPathContent"
    - "$OSMedia"
  writes:
    - JSON task file to "$SetOSDBuilderPathTasks"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-OSMedia"
  - "Get-WindowsImage"
  - "Get-TaskContentPacks"
  - "Get-TaskWinPEDaRT"
  - "Get-TaskWinPEADK"
  - "Get-TaskWinPEDrivers"
  - "Get-TaskWinPEExtraFiles"
  - "Get-TaskWinPEScripts"
  - "Get-TaskContentIsoExtract"
  - "Out-GridView"
  - "Get-Content", "ConvertTo-Json", "Out-File"
---
```

**Synopsis**: Creates a JSON Task for use with New-PEBuild.
**Description**: Interactively creates a JSON file defining PE image customizations (ADK, DaRT, drivers, scripts, extra files, scratch space, source WIM, MDT share) based on a selected base OSMedia and user selections via GridView.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/new-pebuildtask](https://osdbuilder.osdeploy.com/module/functions/new-pebuildtask)

**Syntax**: (See above for details)

**Parameters**: (See above for details)

**Key Operations**:
1.  Initialization and Block checks.
2.  Sets task path, loads existing task if updating.
3.  Selects base OSMedia via GridView (or pipeline).
4.  Presents GridViews for user to select Content Packs, WinPE ADK, DaRT, drivers, extra files, and scripts.
5.  Consolidates selections and existing task items.
6.  Constructs an ordered hashtable representing the task configuration, including PE-specific parameters.
7.  Converts task hashtable to JSON and saves it to the Tasks directory.

**Output**: JSON file in Tasks directory.

---

## Function: Save-OSDBuilderDownload

```yaml
---
title: "Function: Save-OSDBuilderDownload"
type: "Public Cmdlet"
module_file: "Save-OSDBuilderDownload.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathFeatureUpdates"
    - "$SetOSDBuilderPathUpdates"
    - "$GetOSDBuilderPathContentOneDrive"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Block-StandardUser"
  - "Get-FeatureUpdateDownloads"
  - "Get-OSDUpdates"
  - "Get-WindowsImage"
  - "Export-WindowsImage"
  - "Expand-WindowsImage"
  - "Convert-ByteArrayToHex"
  - "Get-FileHash"
  - "Start-BitsTransfer"
  - "Invoke-WebRequest"
  - "New-Item"
  - "Test-Path"
  - "Out-GridView"
---
```

**Synopsis**: Downloads Microsoft Updates and other content for use in OSDBuilder.
**Description**: Downloads Feature Updates (ESDs), Microsoft Updates (SSU, LCU, etc.), or OneDrive Sync Client. Can also list or remove superseded updates from the local store.
**Link**: [https://osdbuilder.osdeploy.com](https://osdbuilder.osdeploy.com)

**Syntax**: (See above for details)

**Parameters**: (See above for details)

**Key Operations**:
1.  Initialization and Block checks.
2.  Determines download method (curl, WebClient, BITS).
3.  **Feature Updates (`-FeatureUpdates`)**: Gets list, filters, allows selection, downloads ESDs, expands ESDs into subdirectories under `FeatureUpdates`.
4.  **Content Download (`-ContentDownload`)**: Downloads specific files like `OneDriveSetup.exe` to the `Content` directory.
5.  **OSDUpdate Management**: Gets full update catalog.
    *   **Superseded (`-Superseded`)**: Lists or removes local update files not in the current catalog.
    *   **Download (`-Download`)**: Filters updates, allows selection via GridView (if used), downloads files to `Updates` directory, optionally checks file hash.

**Output**: Downloads files, creates directories, lists/removes superseded files.

---

## Function: Show-OSDBuilderInfo

```yaml
---
title: "Function: Show-OSDBuilderInfo"
type: "Public Cmdlet"
module_file: "Show-OSDBuilderInfo.ps1"
scope_dependencies:
  reads:
    # Relies on the info/xml files within the specified OSDBuilder media directory
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-OSMedia"
  - "Get-OSBuilds"
  - "Get-PEBuilds"
  - "Import-Clixml"
  - "Test-Path"
  - "Out-GridView"
---
```

**Synopsis**: Shows Operating System information of any OSDBuilder Media.
**Description**: Displays detailed inventory and configuration information (AppX, Features, Packages, Capabilities, base image details) by reading metadata XML files from the specified OSDBuilder media directory.
**Link**: [https://osdbuilder.osdeploy.com/module/functions/show-osdbuilderinfo](https://osdbuilder.osdeploy.com/module/functions/show-osdbuilderinfo)

**Syntax**:
```powershell
function Show-OSDBuilderInfo {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipelineByPropertyName)]
        [string[]]$FullName
    )
}
```

**Parameters**:
*   **`-FullName`**: `[string[]]` - Path(s) to the OSDBuilder media directory.

**Key Operations**:
1.  Initialization and gathers all media.
2.  Selects media via GridView (if `-FullName` not provided).
3.  For each selected media:
    *   Reads metadata XML files (`Get-AppxProvisionedPackage.xml`, `Get-WindowsCapability.xml`, `Get-WindowsOptionalFeature.xml`, `Get-WindowsPackage.xml`, `Get-WindowsImage.xml`).
    *   Formats and prints the extracted information to the console, categorized by type (AppX, Capabilities, Features, Packages, Image Info).

**Output**: Formatted text to console.

---

# Core Functions: AllFunctions.ps1

These functions form the backbone of OSDBuilder's image manipulation capabilities. They are generally not called directly by the end-user but are orchestrated by the public cmdlets. Many of these functions rely on script-scoped variables (e.g., `$MountWinPE`, `$OSMajorVersion`, `$Info`) that are expected to be set by the calling public cmdlet.

---

## ADK Content Functions

These functions are responsible for adding Windows ADK (Assessment and Deployment Kit) optional components to WinPE, WinRE, and WinSE WIM images.

---

### Function: Add-ContentADKWinPE

```yaml
---
title: "Core Function: Add-ContentADKWinPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinPEADKPE"
    - "$SetOSDBuilderPathContent"
    - "$MountWinPE"
    - "$PEInfo"
    - "$OSMajorVersion"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Sort-Object"
  - "Where-Object"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds Windows ADK Optional Components to the mounted `WinPE.wim` image.
**Syntax**: `function Add-ContentADKWinPE { param () }`
**Key Operations**: Aborts if not New-OSBuild/New-PEBuild or if `$WinPEADKPE` is empty. Sets `$global:ReapplyLCU = $true`. Sorts packages. Installs NetFx, PowerShell, then other packages using `Add-WindowsPackage` (or `dism.exe` for OS Major Version 6) into `$MountWinPE`. Logs operations to `$PEInfo\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$WinPEADKPE`, `$SetOSDBuilderPathContent`, `$MountWinPE`, `$PEInfo`, `$OSMajorVersion`. Writes `$global:ReapplyLCU`.

---

### Function: Add-ContentADKWinRE

```yaml
---
title: "Core Function: Add-ContentADKWinRE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinPEADKRE"
    - "$SetOSDBuilderPathContent"
    - "$MountWinRE"
    - "$PEInfo"
    - "$OSMajorVersion"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Sort-Object"
  - "Where-Object"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds Windows ADK Optional Components to the mounted `WinRE.wim` image.
**Syntax**: `function Add-ContentADKWinRE { param () }`
**Key Operations**: Identical to `Add-ContentADKWinPE` but uses `$WinPEADKRE` and targets `$MountWinRE`.
**Variable Dependencies**: Reads `$ScriptName`, `$WinPEADKRE`, `$SetOSDBuilderPathContent`, `$MountWinRE`, `$PEInfo`, `$OSMajorVersion`. Writes `$global:ReapplyLCU`.

---

### Function: Add-ContentADKWinSE

```yaml
---
title: "Core Function: Add-ContentADKWinSE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinPEADKSE"
    - "$SetOSDBuilderPathContent"
    - "$MountWinSE"
    - "$PEInfo"
    - "$OSMajorVersion"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Sort-Object"
  - "Where-Object"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds Windows ADK Optional Components to the mounted `WinSE.wim` image.
**Syntax**: `function Add-ContentADKWinSE { param () }`
**Key Operations**: Identical to `Add-ContentADKWinPE` but uses `$WinPEADKSE` and targets `$MountWinSE`. Log path for `dism.exe` includes an extra `.log`.
**Variable Dependencies**: Reads `$ScriptName`, `$WinPEADKSE`, `$SetOSDBuilderPathContent`, `$MountWinSE`, `$PEInfo`, `$OSMajorVersion`. Writes `$global:ReapplyLCU`.

---

## Driver Content Functions

These functions handle the addition of drivers to both the main OS image (`install.wim`) and the various WinPE images.

---

### Function: Add-ContentDriversOS

```yaml
---
title: "Core Function: Add-ContentDriversOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$Drivers"
    - "$DriverTemplates"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
    - "$OSMajorVersion"
cmdlet_dependencies:
  - "Add-WindowsDriver"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds drivers to the mounted OS image (`install.wim`) from task-specified paths and templates.
**Syntax**: `function Add-ContentDriversOS { param () }`
**Key Operations**: Aborts if not New-OSBuild. Iterates through `$Drivers` (relative paths) and `$DriverTemplates` (full paths). Installs drivers recursively and force unsigned using `Add-WindowsDriver` (or `dism.exe` for OS Major Version 6) into `$MountDirectory`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$Drivers`, `$DriverTemplates`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`, `$OSMajorVersion`.

---

### Function: Add-ContentDriversPE

```yaml
---
title: "Core Function: Add-ContentDriversPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinPEDrivers"
    - "$SetOSDBuilderPathContent"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
    - "$PEInfo"
    - "$OSMajorVersion"
cmdlet_dependencies:
  - "Add-WindowsDriver"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds drivers to all currently mounted WinPE-related images (`WinPE.wim`, `WinRE.wim`, `WinSE.wim`).
**Syntax**: `function Add-ContentDriversPE { param () }`
**Key Operations**: Aborts if not New-OSBuild or if `$WinPEDrivers` is empty. Iterates through `$WinPEDrivers` (relative paths). For each driver path, iterates through `$MountWinPE`, `$MountWinRE`, `$MountWinSE`. Installs drivers recursively and force unsigned using `Add-WindowsDriver` (or `dism.exe` for OS Major Version 6). Logs to `$PEInfo\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$WinPEDrivers`, `$SetOSDBuilderPathContent`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$PEInfo`, `$OSMajorVersion`.

---

## Extra Files Content Functions

These functions are responsible for copying entire directory structures or specific files into the OS or PE images using `robocopy.exe`.

---

### Function: Add-ContentExtraFilesOS

```yaml
---
title: "Core Function: Add-ContentExtraFilesOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$ExtraFiles"
    - "$ExtraFilesTemplates"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
cmdlet_dependencies:
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Copies extra files and folders into the mounted OS image (`install.wim`) from task-specified paths and templates.
**Syntax**: `function Add-ContentExtraFilesOS { param () }`
**Key Operations**: Aborts if not New-OSBuild. Copies files/folders from `$ExtraFiles` (relative paths) and `$ExtraFilesTemplates` (full paths) into `$MountDirectory` using `robocopy /s /ndl /xx /b /np /ts /tee /r:0 /w:0`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$ExtraFiles`, `$ExtraFilesTemplates`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`.

---

### Function: Add-ContentExtraFilesPE

```yaml
---
title: "Core Function: Add-ContentExtraFilesPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinPEExtraFilesPE", "$WinPEExtraFilesRE", "$WinPEExtraFilesSE"
    - "$SetOSDBuilderPathContent"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
    - "$PEInfo"
cmdlet_dependencies:
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Copies extra files and folders into the mounted WinPE images (`WinPE.wim`, `WinRE.wim`, `WinSE.wim`).
**Syntax**: `function Add-ContentExtraFilesPE { param () }`
**Key Operations**: Aborts if not New-OSBuild or if no PE extra files are specified. Copies files/folders from `$WinPEExtraFilesPE` into `$MountWinPE`, `$WinPEExtraFilesRE` into `$MountWinRE`, and `$WinPEExtraFilesSE` into `$MountWinSE` using `robocopy /S /ZB /COPY:D /NODCOPY /XJ /NDL /NP /TEE /TS /XX /R:0 /W:0`. Logs to `$PEInfo\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$WinPEExtraFilesPE`, `$WinPEExtraFilesRE`, `$WinPEExtraFilesSE`, `$SetOSDBuilderPathContent`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$PEInfo`.

---

## Script Content Functions

These functions are responsible for executing PowerShell scripts within the context of the mounted OS or PE images, or in the OSDBuilder host environment during the build process if the scripts target the mounted image paths.

---

### Function: Add-ContentScriptsOS

```yaml
---
title: "Core Function: Add-ContentScriptsOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$Scripts"
    - "$ScriptTemplates"
    - "$SetOSDBuilderPathContent"
cmdlet_dependencies:
  - "Test-Path"
  - "Invoke-Expression"
  - "Write-Host"
---
```

**Purpose**: Executes PowerShell scripts during the OS image customization phase from task-specified paths and templates.
**Syntax**: `function Add-ContentScriptsOS { param () }`
**Key Operations**: Aborts if not New-OSBuild. Iterates through `$Scripts` (relative paths) and `$ScriptTemplates` (full paths). Executes scripts using `Invoke-Expression` if they exist.
**Variable Dependencies**: Reads `$ScriptName`, `$Scripts`, `$ScriptTemplates`, `$SetOSDBuilderPathContent`.

---

### Function: Add-ContentScriptsPE

```yaml
---
title: "Core Function: Add-ContentScriptsPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinPEScriptsPE", "$WinPEScriptsRE", "$WinPEScriptsSE"
    - "$SetOSDBuilderPathContent"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-Content"
  - "Set-Content"
  - "Invoke-Expression"
  - "Write-Host"
---
```

**Purpose**: Executes PowerShell scripts during the customization phase of WinPE images, performing content replacement within scripts before execution.
**Syntax**: `function Add-ContentScriptsPE { param () }`
**Key Operations**: Aborts if not New-OSBuild or if no PE scripts are specified. Iterates through `$WinPEScriptsPE`, `$WinPEScriptsRE`, and `$WinPEScriptsSE` (relative paths). Reads script content, performs string replacements (e.g., log file names, mount paths), writes modified content back, and executes the script using `Invoke-Expression`.
**Variable Dependencies**: Reads `$ScriptName`, `$WinPEScriptsPE`, `$WinPEScriptsRE`, `$WinPEScriptsSE`, `$SetOSDBuilderPathContent`. Modifies script files temporarily.

---

## Layout/Unattend Content Functions

These functions handle the application of Start Menu layout modifications and Unattend.xml files to the OS image.

---

### Function: Add-ContentStartLayout

```yaml
---
title: "Core Function: Add-ContentStartLayout"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$OSMajorVersion"
    - "$StartLayoutXML"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
cmdlet_dependencies:
  - "Copy-Item"
  - "Write-Host"
  - "Write-Warning"
---
```

**Purpose**: Applies a custom Start Menu layout (`LayoutModification.xml`) to the default user profile in the mounted OS image.
**Syntax**: `function Add-ContentStartLayout { param () }`
**Key Operations**: Aborts if not New-OSBuild, OS Major Version is not 10, or `$StartLayoutXML` is empty. Copies `$SetOSDBuilderPathContent\$StartLayoutXML` to `$MountDirectory\Users\Default\AppData\Local\Microsoft\Windows\Shell\LayoutModification.xml`. Logs errors as warnings.
**Variable Dependencies**: Reads `$ScriptName`, `$OSMajorVersion`, `$StartLayoutXML`, `$SetOSDBuilderPathContent`, `$MountDirectory`.

---

### Function: Add-ContentUnattend

```yaml
---
title: "Core Function: Add-ContentUnattend"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$OSMajorVersion"
    - "$UnattendXML"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
cmdlet_dependencies:
  - "Test-Path"
  - "New-Item"
  - "Copy-Item"
  - "Use-WindowsUnattend"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
  - "Get-Date"
---
```

**Purpose**: Applies an `Unattend.xml` file to the mounted OS image to automate Windows Setup phases.
**Syntax**: `function Add-ContentUnattend { param () }`
**Key Operations**: Aborts if not New-OSBuild, OS Major Version is not 10, or `$UnattendXML` is empty. Ensures `Panther` directory exists. Copies `$SetOSDBuilderPathContent\$UnattendXML` to `$MountDirectory\Windows\Panther\Unattend.xml`. Uses `Use-WindowsUnattend` to apply settings offline. Logs to `$Info\logs\`. Logs errors as warnings.
**Variable Dependencies**: Reads `$ScriptName`, `$OSMajorVersion`, `$UnattendXML`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`.

---

## Content Pack Functions

These functions manage the application of "Content Packs," which are user-defined collections of customizations (drivers, scripts, registry settings, etc.) stored in the `ContentPacks` directory of OSDBuilder.

---

### Function: Add-ContentPack

```yaml
---
title: "Core Function: Add-ContentPack"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$global:SetOSDBuilder.AllowContentPacks"
    - "$SetOSDBuilderPathTemplates"
    - "$SkipContentPacks"
    - "$ScriptName"
    - "$ContentPacks"
    - "$ReleaseID", "$OSArchitecture", "$UpdateOS"
    - "$SetOSDBuilderPathContentPacks"
  writes: [] # Indirectly modifies images via calls to helper Add-ContentPack* functions
cmdlet_dependencies:
  - "Get-IsTemplatesEnabled"
  - "Join-Path"
  - "Test-Path"
  - "New-Item"
  - "Get-ChildItem"
  # Calls numerous other Add-ContentPack<Type> helper functions
---
```

**Purpose**: Orchestrates the application of various types of content from specified OSDBuilder Content Packs based on the `$PackType` parameter.
**Syntax**: `function Add-ContentPack { param ([ValidateSet(...)] [Alias('Type')] [string]$PackType = 'All') }`
**Parameters**:
*   **`-PackType`** (Alias: `Type`): `[string]` - Type of content to process. Accepted Values: `MEDIA`, `OSCapability`, `OSDrivers`, etc. Default: `All` (though typically called with specific types).
**Key Operations**: Aborts if templates are enabled, Content Packs are skipped, or not New-OSBuild/New-PEBuild. Iterates through `$ContentPacks`. For each pack and the specified `$PackType`, constructs relevant paths (Global, Arch, Version-specific), ensures they exist, and calls the corresponding `Add-ContentPack<Type>` helper function.
**Variable Dependencies**: Reads `$global:SetOSDBuilder.AllowContentPacks`, `$SetOSDBuilderPathTemplates`, `$SkipContentPacks`, `$ScriptName`, `$ContentPacks`, `$ReleaseID`, `$OSArchitecture`, `$UpdateOS`, `$SetOSDBuilderPathContentPacks`.

---

### Function: Add-ContentPackMEDIA

```yaml
---
title: "Core Function: Add-ContentPackMEDIA"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$OS"
    - "$Info"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Copies media content from a specified Content Pack subfolder to the OS media build area (`$OS`).
**Syntax**: `function Add-ContentPackMEDIA { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source content directory in the Content Pack.
**Key Operations**: Checks if source path has content. Copies files/folders from `$ContentPackContent` to `$OS` using `robocopy /s /ndl /xx /b /np /ts /tee /r:0 /w:0`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$OS`, `$Info`.

---

### Function: Add-ContentPackOSDrivers

```yaml
---
title: "Core Function: Add-ContentPackOSDrivers"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
    - "$OSMajorVersion"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Add-WindowsDriver"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Adds drivers from a specified Content Pack subfolder to the mounted OS image (`install.wim`).
**Syntax**: `function Add-ContentPackOSDrivers { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source driver directory in the Content Pack.
**Key Operations**: Checks if source path has content. Installs drivers from `$ContentPackContent` recursively and force unsigned using `Add-WindowsDriver` (or `dism.exe` for OS Major Version 6) into `$MountDirectory`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`, `$OSMajorVersion`.

---

### Function: Add-ContentPackOSExtraFiles

```yaml
---
title: "Core Function: Add-ContentPackOSExtraFiles"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Copies extra files and folders from a specified Content Pack subfolder into the mounted OS image (`install.wim`).
**Syntax**: `function Add-ContentPackOSExtraFiles { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Checks if source path has content. Copies files/folders from `$ContentPackContent` into `$MountDirectory` using `robocopy /s /ndl /xx /b /np /ts /tee /r:0 /w:0`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`.

---

### Function: Add-ContentPackOSCapability

```yaml
---
title: "Core Function: Add-ContentPackOSCapability"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-Command"
  - "Get-WindowsCapability"
  - "Where-Object"
  - "Add-WindowsCapability"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
  - "Get-Date"
---
```

**Purpose**: Adds Windows Capabilities (Features on Demand) from a specified Content Pack subfolder to the mounted OS image. Can optionally filter for RSAT capabilities.
**Syntax**: `function Add-ContentPackOSCapability { param ([Parameter(Mandatory)][string]$ContentPackContent, [switch]$RSAT) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory containing capability files (e.g., `FoDMetadata_Client.cab`).
*   **`-RSAT`**: `[switch]` - If specified, only attempts to add RSAT capabilities.
**Key Operations**: Checks if source path contains `FoDMetadata_Client.cab`. Sets `$global:ReapplyLCU = $true`. Uses `Get-WindowsCapability -Path "$MountDirectory"` to find capabilities that are 'NotPresent'. Filters based on `-RSAT` (include/exclude 'RSAT' and 'Language'). Installs using `Add-WindowsCapability -Path "$MountDirectory" -Name <CapabilityName> -Source "$ContentPackContent"`. Uses `-LimitAccess` if available for the cmdlet version. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-ContentPackOSLanguageFeatures

```yaml
---
title: "Core Function: Add-ContentPackOSLanguageFeatures"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Sort-Object"
  - "Select-Object"
  - "Add-WindowsPackage"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Adds Language Features (CAB files) from a specified Content Pack subfolder to the mounted OS image.
**Syntax**: `function Add-ContentPackOSLanguageFeatures { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory containing language feature CABs.
**Key Operations**: Checks if source path has content. Finds all `.cab` files recursively. Sorts by length descending. Iterates through files. Sets `$global:ReapplyLCU = $true`. Installs using `Add-WindowsPackage -PackagePath "<full_file_path>" -Path "$MountDirectory"`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-ContentPackOSLanguagePacks

```yaml
---
title: "Core Function: Add-ContentPackOSLanguagePacks"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
    - "$global:UpdateLanguageContent"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Sort-Object"
  - "Select-Object"
  - "Add-WindowsPackage"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Adds Language Packs (CAB files) from a specified Content Pack subfolder to the mounted OS image.
**Syntax**: `function Add-ContentPackOSLanguagePacks { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory containing language pack CABs.
**Key Operations**: Checks if source path has content. Finds all `.cab` files (non-recursive). Sorts by length descending. Iterates through files. Sets `$global:ReapplyLCU = $true` and `$global:UpdateLanguageContent = $true`. Installs using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`, `$global:UpdateLanguageContent`.

---

### Function: Add-ContentPackOSLocalExperiencePacks

```yaml
---
title: "Core Function: Add-ContentPackOSLocalExperiencePacks"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Sort-Object"
  - "Select-Object"
  - "Get-Item"
  - "Add-AppxProvisionedPackage"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
  - "Get-Date"
---
```

**Purpose**: Adds Local Experience Packs (APPX files) from a specified Content Pack subfolder to the mounted OS image.
**Syntax**: `function Add-ContentPackOSLocalExperiencePacks { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory containing LXP APPX files.
**Key Operations**: Checks if source path has content. Finds all `.appx` files recursively. Sorts by length descending. Iterates through files. Sets `$global:ReapplyLCU = $true`. Determines license path (`License.xml` in the same directory). Installs using `Add-AppxProvisionedPackage -Path "$MountDirectory" -PackagePath "<appx_path>" -LicensePath "<license_path>"`. Logs to `$Info\logs\`. Warns if license not found.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-ContentPackOSPackages

```yaml
---
title: "Core Function: Add-ContentPackOSPackages"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Sort-Object"
  - "Select-Object"
  - "Add-WindowsPackage"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Adds general Windows packages (CAB files) from a specified Content Pack subfolder to the mounted OS image.
**Syntax**: `function Add-ContentPackOSPackages { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory containing package CABs.
**Key Operations**: Checks if source path has content. Finds all `.cab` files recursively. Sorts by name. Iterates through files. Sets `$global:ReapplyLCU = $true`. Installs using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-ContentPackOSPoshMods and Add-ContentPackOSPoshModsSystem

These functions are very similar and marked as deprecated.
```yaml
---
title: "Core Function: Add-ContentPackOSPoshMods / Add-ContentPackOSPoshModsSystem"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$Info"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
  - "Get-Date"
---
```
**Purpose**: Copies PowerShell modules from a Content Pack subfolder into the mounted OS image's PowerShell module directories (`Program Files` or `System32`). Marked as deprecated.
**Syntax**:
```powershell
function Add-ContentPackOSPoshMods { param ([Parameter(Mandatory)][string]$ContentPackContent) }
function Add-ContentPackOSPoshModsSystem { param ([Parameter(Mandatory)][string]$ContentPackContent) }
```
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Warns that the function is deprecated. Checks if source path has content. Copies files/folders from `$ContentPackContent` using `robocopy /s /ndl /xx /b /np /ts /tee /r:0 /w:0`.
*   `Add-ContentPackOSPoshMods` targets `$MountDirectory\Program Files\WindowsPowerShell\Modules`.
*   `Add-ContentPackOSPoshModsSystem` targets `$MountDirectory\Windows\System32\WindowsPowerShell\v1.0\Modules`.
Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$Info`.

---

### Function: Add-ContentPackOSRegistry

```yaml
---
title: "Core Function: Add-ContentPackOSRegistry"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
    - "$env:TEMP"
  calls_core_functions:
    - "Dismount-OSDOfflineRegistry"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Select-Object"
  - "New-Item"
  - "Get-Content"
  - "Set-Content"
  - "Start-Process" # For reg.exe import
  - "Remove-Item" # For temp file
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Imports registry settings from `.reg` files within a specified Content Pack subfolder into the mounted OS image's registry hives.
**Syntax**: `function Add-ContentPackOSRegistry { param ([Parameter(Mandatory)][string]$ContentPackContent, [switch]$ShowRegContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
*   **`-ShowRegContent`**: `[switch]` - If specified, displays the content of each `.reg` file before importing.
**Key Operations**: Checks if source path has content. Loads offline registry hives from `$MountDirectory` into temporary `HKLM` mount points using `reg load`. Creates a temporary directory in `$env:TEMP`. Finds all `.reg` files recursively in `$ContentPackContent`. For each `.reg` file:
*   Reads content, replaces standard hive paths with temporary `HKLM` mount points, saves to a temporary `.reg` file.
*   Optionally displays the temporary `.reg` file content.
*   Imports the temporary `.reg` file using `reg import`.
Cleans up the temporary directory. Calls `Dismount-OSDOfflineRegistry` to unload the hives.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`, `$env:TEMP`. Modifies mounted OS registry and host registry temporarily.

---

### Function: Add-ContentPackOSScripts

```yaml
---
title: "Core Function: Add-ContentPackOSScripts"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Select-Object"
  - "Invoke-Expression"
  - "Write-Host"
---
```

**Purpose**: Executes PowerShell scripts from a specified Content Pack subfolder during the OS image customization phase.
**Syntax**: `function Add-ContentPackOSScripts { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Checks if source path has content. Finds all `.ps1` files recursively. Iterates through files and executes each using `Invoke-Expression`.
**Variable Dependencies**: Reads `$ContentPackContent`.

---

### Function: Add-ContentPackOSStartLayouts

```yaml
---
title: "Core Function: Add-ContentPackOSStartLayouts"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountDirectory"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Select-Object"
  - "Copy-Item"
  - "Write-Host"
  - "Write-Warning"
---
```

**Purpose**: Applies Start Menu layout XML files from a specified Content Pack subfolder to the default user profile in the mounted OS image.
**Syntax**: `function Add-ContentPackOSStartLayouts { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Checks if source path has content. Finds all `.xml` files. Iterates through files and copies each to `$MountDirectory\Users\Default\AppData\Local\Microsoft\Windows\Shell\LayoutModification.xml` using `Copy-Item -Recurse -Force`. Logs errors as warnings.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountDirectory`.

---

### Function: Add-ContentPackPEADK and Add-ContentPackPEADKLang

These functions are very similar and handle adding ADK components to PE images from Content Packs.
```yaml
---
title: "Core Function: Add-ContentPackPEADK / Add-ContentPackPEADKLang"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountPath" # Optional parameter, used in New-PEBuild context
    - "$ScriptName"
    - "$WinPEOutput", "$SourceWim" # Used in New-PEBuild context for filtering
    - "$MountWinPE", "$MountWinRE", "$MountWinSE" # Used in New-OSBuild context
    - "$Info" # Base path for logs (Note: uses $Info not $PEInfo)
  writes:
    - "$global:ReapplyLCU" # Only by Add-ContentPackPEADKLang
    - "$global:UpdateLanguageContent" # Only by Add-ContentPackPEADKLang
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Sort-Object"
  - "Select-Object"
  - "Where-Object"
  - "Add-WindowsPackage"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```
**Purpose**: Adds WinPE ADK optional components (CAB files) from a specified Content Pack subfolder to mounted PE images. `Add-ContentPackPEADKLang` specifically handles language-related ADK components.
**Syntax**:
```powershell
function Add-ContentPackPEADK { param ([Parameter(Mandatory)][string]$ContentPackContent, [string]$MountPath, [switch]$Lang) }
function Add-ContentPackPEADKLang { param ([Parameter(Mandatory)][string]$ContentPackContent, [string]$MountPath, [switch]$Lang) } # Note: Lang switch is always true for PEADKLang
```
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
*   **`-MountPath`**: `[string]` - Optional mount path (used if called from New-PEBuild).
*   **`-Lang`**: `[switch]` - If specified (and true for `PEADKLang`), sets language update flags.
**Key Operations**: Checks if source path has content. `Add-ContentPackPEADKLang` sets `$global:ReapplyLCU` and `$global:UpdateLanguageContent`. Finds `.cab` files (recursive for subfolders). Filters based on `$ScriptName` (New-PEBuild vs New-OSBuild) and `$WinPEOutput`/`$SourceWim` if in New-PEBuild context (e.g., excluding setup/wifi for WinPE source). Sorts packages. Iterates through packages. If `-MountPath` is provided, installs into that path. Otherwise, installs into `$MountWinPE`, `$MountWinRE`, and `$MountWinSE` (if they exist). Installs `lp.cab` first, then others. Uses `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountPath`, `$Lang`, `$ScriptName`, `$WinPEOutput`, `$SourceWim`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$Info`. Writes `$global:ReapplyLCU`, `$global:UpdateLanguageContent`.

---

### Function: Add-ContentPackPEDaRT

```yaml
---
title: "Core Function: Add-ContentPackPEDaRT"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$OSArchitecture"
    - "$ScriptName"
    - "$WinPEOutput"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
cmdlet_dependencies:
  - "Test-Path"
  - "Join-Path", "Split-Path"
  - "Copy-Item"
  - "Get-Content", "ForEach-Object", "Out-File" # For winpeshl.ini modification
  - "Remove-Item" # For winpeshl.ini
  - "Write-Host"
  - "Write-Warning"
---
```

**Purpose**: Integrates Microsoft DaRT (Diagnostics and Recovery Toolset) from a specified Content Pack subfolder into mounted PE images.
**Syntax**: `function Add-ContentPackPEDaRT { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Checks if `$ContentPackContent\Tools$($OSArchitecture).cab` exists. If so:
*   Expands the `Tools*.cab` into `$MountWinPE`, `$MountWinRE`, and `$MountWinSE` using `expand.exe`.
*   Copies `DartConfig.dat` or `DartConfig8.dat` (if found in the source directory) to `Windows\System32\DartConfig.dat` in all three mounted PE images.
*   If `$ScriptName` is 'New-OSBuild': removes `winpeshl.ini` from WinPE and WinSE, modifies `winpeshl.ini` in WinRE (replaces `-prompt` with `-network`).
*   If `$ScriptName` is 'New-PEBuild': modifies `winpeshl.ini` in the single mounted image if `$WinPEOutput` is 'Recovery', otherwise removes it.
If `Tools*.cab` not found, warns.
**Variable Dependencies**: Reads `$ContentPackContent`, `$OSArchitecture`, `$ScriptName`, `$WinPEOutput`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`. Modifies mounted PE images.

---

### Function: Add-ContentPackPEDrivers

```yaml
---
title: "Core Function: Add-ContentPackPEDrivers"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
    - "$PEInfo"
    - "$OSMajorVersion"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Add-WindowsDriver"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Adds drivers from a specified Content Pack subfolder to the mounted PE images.
**Syntax**: `function Add-ContentPackPEDrivers { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source driver directory in the Content Pack.
**Key Operations**: Checks if source path has content. Finds `.inf` files recursively for logging. Installs drivers from `$ContentPackContent` recursively and force unsigned using `Add-WindowsDriver` (or `dism.exe` for OS Major Version 6) into `$MountWinPE`, `$MountWinRE`, and `$MountWinSE` (if they exist). Logs to `$PEInfo\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$PEInfo`, `$OSMajorVersion`.

---

### Function: Add-ContentPackPEExtraFiles

```yaml
---
title: "Core Function: Add-ContentPackPEExtraFiles"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
    - "$Info" # Base path for logs (Note: uses $Info not $PEInfo)
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```

**Purpose**: Copies extra files and folders from a specified Content Pack subfolder into the mounted PE images.
**Syntax**: `function Add-ContentPackPEExtraFiles { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Checks if source path has content. Finds files recursively for logging. Copies files/folders from `$ContentPackContent` into `$MountWinPE`, `$MountWinRE`, and `$MountWinSE` using `robocopy /S /B /COPY:D /NODCOPY /XJ /FP /NS /NC /NDL /NJH /NJS /NP /TEE /TS /XX /R:0 /W:0`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$Info`.

---

### Function: Add-ContentPackPEPoshMods and Add-ContentPackPEPoshModsSystem

These functions are very similar and handle adding PowerShell modules to PE images from Content Packs.
```yaml
---
title: "Core Function: Add-ContentPackPEPoshMods / Add-ContentPackPEPoshModsSystem"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
    - "$Info"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Write-Host"
  - "Write-Verbose"
  - "Get-Date"
---
```
**Purpose**: Copies PowerShell modules from a Content Pack subfolder into the mounted PE image's PowerShell module directories (`Program Files` or `System32`).
**Syntax**:
```powershell
function Add-ContentPackPEPoshMods { param ([Parameter(Mandatory)][string]$ContentPackContent) }
function Add-ContentPackPEPoshModsSystem { param ([Parameter(Mandatory)][string]$ContentPackContent) }
```
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Checks if source path has content. Finds files recursively for logging. Copies files/folders from `$ContentPackContent` using `robocopy /s /ndl /xx /b /np /ts /tee /r:0 /w:0`.
*   `Add-ContentPackPEPoshMods` targets `\Program Files\WindowsPowerShell\Modules`.
*   `Add-ContentPackPEPoshModsSystem` targets `\Windows\System32\WindowsPowerShell\v1.0\Modules`.
Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$Info`.

---

### Function: Add-ContentPackPERegistry

```yaml
---
title: "Core Function: Add-ContentPackPERegistry"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
    - "$env:TEMP"
  calls_core_functions:
    - "Mount-OSDOfflineRegistryPE"
    - "Dismount-OSDOfflineRegistry"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Select-Object"
  - "New-Item"
  - "Get-Content"
  - "Set-Content"
  - "Start-Process"
  - "Remove-Item"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Imports registry settings from `.reg` files within a specified Content Pack subfolder into the mounted PE images' registry hives.
**Syntax**: `function Add-ContentPackPERegistry { param ([Parameter(Mandatory)][string]$ContentPackContent, [switch]$ShowRegContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
*   **`-ShowRegContent`**: `[switch]` - Displays `.reg` file content before import.
**Key Operations**: Checks if source path has content. Creates temp directory. Finds `.reg` files. For each mounted PE WIM (`$MountWinPE`, `$MountWinRE`, `$MountWinSE`):
*   Calls `Mount-OSDOfflineRegistryPE` for the current PE WIM.
*   For each `.reg` file: reads content, replaces standard hive paths with PE offline mount points, saves to temp `.reg.Offline` file. Optionally displays content. Imports temp `.reg.Offline` using `reg import`.
*   Cleans up temp `.reg.Offline` file.
*   Calls `Dismount-OSDOfflineRegistry` for the current PE WIM.
Cleans up the main temp directory.
**Variable Dependencies**: Reads `$ContentPackContent`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$env:TEMP`. Modifies mounted PE registries and host registry temporarily.

---

### Function: Add-ContentPackPEScripts

```yaml
---
title: "Core Function: Add-ContentPackPEScripts"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ContentPackContent"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-ChildItem"
  - "Select-Object"
  - "Invoke-Expression"
  - "Write-Host"
---
```

**Purpose**: Executes PowerShell scripts from a specified Content Pack subfolder during the PE image customization phase.
**Syntax**: `function Add-ContentPackPEScripts { param ([Parameter(Mandatory)][string]$ContentPackContent) }`
**Parameters**:
*   **`-ContentPackContent`**: `[string]` (Mandatory) - Full path to the source directory in the Content Pack.
**Key Operations**: Checks if source path has content. Finds all `.ps1` files recursively. Iterates through files and executes each using `Invoke-Expression`.
**Variable Dependencies**: Reads `$ContentPackContent`.

---

## Feature/Language Pack Functions

These functions are responsible for adding Features on Demand (FODs), Language Packs (LPs), Language Interface Packs (LIPs), Language Features, and Local Experience Packs (LXPs) to the OS image.

---

### Function: Add-FeaturesOnDemandOS

```yaml
---
title: "Core Function: Add-FeaturesOnDemandOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$FeaturesOnDemand"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds Features on Demand (FODs) to the mounted OS image.
**Syntax**: `function Add-FeaturesOnDemandOS { param () }`
**Key Operations**: Aborts if not New-OSBuild or if `$FeaturesOnDemand` is empty. Sets `$global:ReapplyLCU = $true`. Iterates through `$FeaturesOnDemand` (relative paths). Installs using `Add-WindowsPackage` into `$MountDirectory`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$FeaturesOnDemand`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-LanguageFeaturesOnDemandOS

```yaml
---
title: "Core Function: Add-LanguageFeaturesOnDemandOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$OSMajorVersion"
    - "$LanguageFeatures"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Test-Path"
  - "Where-Object"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds Language Features on Demand (e.g., Basic typing, Speech) to the mounted OS image.
**Syntax**: `function Add-LanguageFeaturesOnDemandOS { param () }`
**Key Operations**: Aborts if not New-OSBuild, OS Major Version is not 10, or `$LanguageFeatures` is empty. Sets `$global:ReapplyLCU = $true`. Installs packages from `$LanguageFeatures` (relative paths), prioritizing non-speech, then TextToSpeech, then other speech features, using `Add-WindowsPackage` into `$MountDirectory`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$OSMajorVersion`, `$LanguageFeatures`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-LanguageInterfacePacksOS

```yaml
---
title: "Core Function: Add-LanguageInterfacePacksOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$OSMajorVersion"
    - "$LanguageInterfacePacks"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Test-Path"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Adds Language Interface Packs (LIPs) to the mounted OS image.
**Syntax**: `function Add-LanguageInterfacePacksOS { param () }`
**Key Operations**: Aborts if not New-OSBuild, OS Major Version is not 10, or `$LanguageInterfacePacks` is empty. Sets `$global:ReapplyLCU = $true`. Iterates through `$LanguageInterfacePacks` (relative paths). Installs using `Add-WindowsPackage` into `$MountDirectory`. Logs to `$Info\logs\`. Warns if package not found.
**Variable Dependencies**: Reads `$ScriptName`, `$OSMajorVersion`, `$LanguageInterfacePacks`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-LanguagePacksOS

```yaml
---
title: "Core Function: Add-LanguagePacksOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$OSMajorVersion"
    - "$LanguagePacks"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Add-AppxProvisionedPackage"
  - "Test-Path"
  - "Get-Item"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Adds full Language Packs (LPs - CAB or APPX) to the mounted OS image.
**Syntax**: `function Add-LanguagePacksOS { param () }`
**Key Operations**: Aborts if not New-OSBuild, OS Major Version is not 10, or `$LanguagePacks` is empty. Sets `$global:ReapplyLCU = $true`. Iterates through `$LanguagePacks` (relative paths). If CAB, installs using `Add-WindowsPackage`. If APPX, installs using `Add-AppxProvisionedPackage` (requires License.xml). Logs to `$Info\logs\`. Warns if package not found.
**Variable Dependencies**: Reads `$ScriptName`, `$OSMajorVersion`, `$LanguagePacks`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-LocalExperiencePacksOS

```yaml
---
title: "Core Function: Add-LocalExperiencePacksOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$OSMajorVersion"
    - "$LocalExperiencePacks"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-AppxProvisionedPackage"
  - "Test-Path"
  - "Get-Item"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Adds Local Experience Packs (LXPs - APPX) to the mounted OS image.
**Syntax**: `function Add-LocalExperiencePacksOS { param () }`
**Key Operations**: Aborts if not New-OSBuild, OS Major Version is not 10, or `$LocalExperiencePacks` is empty. Sets `$global:ReapplyLCU = $true`. Iterates through `$LocalExperiencePacks` (relative paths). Installs using `Add-AppxProvisionedPackage` (requires License.xml). Logs to `$Info\logs\`. Warns if package not found.
**Variable Dependencies**: Reads `$ScriptName`, `$OSMajorVersion`, `$LocalExperiencePacks`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

### Function: Add-WindowsPackageOS

```yaml
---
title: "Core Function: Add-WindowsPackageOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$Packages"
    - "$SetOSDBuilderPathContent"
    - "$MountDirectory"
    - "$Info"
  writes:
    - "$global:ReapplyLCU"
cmdlet_dependencies:
  - "Add-WindowsPackage"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Adds general Windows packages (CAB or MSU) to the mounted OS image.
**Syntax**: `function Add-WindowsPackageOS { param () }`
**Key Operations**: Aborts if not New-OSBuild or if `$Packages` is empty. Sets `$global:ReapplyLCU = $true`. Iterates through `$Packages` (relative paths). Installs using `Add-WindowsPackage` into `$MountDirectory`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$Packages`, `$SetOSDBuilderPathContent`, `$MountDirectory`, `$Info`. Writes `$global:ReapplyLCU`.

---

## Media Copy/Manipulation Functions

These functions handle copying of OS media content and WIM file manipulations like exporting and setting boot information.

---

### Function: Copy-MediaLanguageSources

```yaml
---
title: "Core Function: Copy-MediaLanguageSources"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$OSMajorVersion"
    - "$LanguageCopySources"
    - "$OS"
    - "$Info"
cmdlet_dependencies:
  - "Get-OSMedia"
  - "Select-Object"
  - "Where-Object"
  - "Write-Host"
  - "Get-Date"
---
```

**Purpose**: Copies language-related source files (excluding WIMs) from other OSDBuilder OSMedia items to the current OS build media (`$OS`).
**Syntax**: `function Copy-MediaLanguageSources { param () }`
**Key Operations**: Aborts if not New-OSBuild, OS Major Version is not 10, or `$LanguageCopySources` is empty. Iterates through `$LanguageCopySources` (OSMedia family names). Finds the source OSMedia using `Get-OSMedia`. Copies files from source `<OSMedia>\OS` to `$OS` using `robocopy /s /xf *.wim /ndl /xc /xn /xo /xf /xx /b /np /ts /tee /r:0 /w:0`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$ScriptName`, `$OSMajorVersion`, `$LanguageCopySources`, `$OS`, `$Info`.

---

### Function: Copy-MediaOperatingSystem

```yaml
---
title: "Core Function: Copy-MediaOperatingSystem"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
    - "$WorkingPath"
    - "$WimTemp"
cmdlet_dependencies:
  - "Test-Path"
  - "Remove-Item"
  - "Write-Host"
---
```

**Purpose**: Copies the base OS files from a source OSMedia location to the current working directory, placing WIMs in a temporary location.
**Syntax**: `function Copy-MediaOperatingSystem { param () }`
**Key Operations**: Copies files/folders from `$OSMediaPath` to `$WorkingPath` using `robocopy /s /r:0 /w:0 /nfl /ndl /xf *.wim *.iso *.vhd *.vhx *.vhdx`. Removes `ISO` and `VHD` subdirectories in `$WorkingPath`. Copies `install.wim` from `$OSMediaPath\OS\sources` to `$WimTemp`. Copies PE WIMs (`*.wim` excluding `boot.wim`) from `$OSMediaPath\WinPE` to `$WimTemp`.
**Variable Dependencies**: Reads `$OSMediaPath`, `$WorkingPath`, `$WimTemp`.

---

## Feature Enable/Disable Functions

These functions manage the state of Windows Optional Features and .NET Framework 3.5 within the OS image.

---

### Function: Disable-WindowsOptionalFeatureOS

```yaml
---
title: "Core Function: Disable-WindowsOptionalFeatureOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$DisableFeature"
    - "$MountDirectory"
    - "$Info"
cmdlet_dependencies:
  - "Disable-WindowsOptionalFeature"
  - "Get-Date"
  - "Write-Host"
  - "Write-Warning"
---
```

**Purpose**: Disables specified Windows Optional Features in the mounted OS image.
**Syntax**: `function Disable-WindowsOptionalFeatureOS { param () }`
**Key Operations**: Aborts if not New-OSBuild or if `$DisableFeature` is empty. Iterates through feature names in `$DisableFeature`. Uses `Disable-WindowsOptionalFeature` into `$MountDirectory`. Logs to `$Info\logs\`. Logs errors as warnings.
**Variable Dependencies**: Reads `$ScriptName`, `$DisableFeature`, `$MountDirectory`, `$Info`.

---

### Function: Enable-NetFXOS

```yaml
---
title: "Core Function: Enable-NetFXOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$EnableNetFX3"
    - "$OSMajorVersion"
    - "$MountDirectory"
    - "$OS"
    - "$Info"
  calls_core_functions:
    - "Update-DotNetOS"
    - "Update-CumulativeOS"
cmdlet_dependencies:
  - "Enable-WindowsOptionalFeature"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Enables the .NET Framework 3.5 feature in the mounted OS image, using the installation media's `sources\sxs` folder as the source. Triggers subsequent .NET and cumulative updates.
**Syntax**: `function Enable-NetFXOS { param () }`
**Key Operations**: Aborts if not New-OSBuild, `$EnableNetFX3` is false, or OS Major Version is not 10. Uses `Enable-WindowsOptionalFeature -FeatureName NetFX3 -All -LimitAccess -Source "$OS\sources\sxs"` into `$MountDirectory`. Logs to `$Info\logs\`. Calls `Update-DotNetOS -Force` and `Update-CumulativeOS -Force`.
**Variable Dependencies**: Reads `$ScriptName`, `$EnableNetFX3`, `$OSMajorVersion`, `$MountDirectory`, `$OS`, `$Info`.

---

### Function: Enable-WindowsOptionalFeatureOS

```yaml
---
title: "Core Function: Enable-WindowsOptionalFeatureOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$EnableFeature"
    - "$MountDirectory"
    - "$Info"
  calls_core_functions:
    - "Update-CumulativeOS"
    - "Invoke-DismCleanupImage"
cmdlet_dependencies:
  - "Enable-WindowsOptionalFeature"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Enables specified Windows Optional Features in the mounted OS image. Triggers cumulative update and component cleanup afterwards.
**Syntax**: `function Enable-WindowsOptionalFeatureOS { param () }`
**Key Operations**: Aborts if not New-OSBuild or if `$EnableFeature` is empty. Iterates through feature names in `$EnableFeature`. Uses `Enable-WindowsOptionalFeature -All` into `$MountDirectory`. Logs to `$Info\logs\`. Calls `Update-CumulativeOS -Force` and `Invoke-DismCleanupImage`.
**Variable Dependencies**: Reads `$ScriptName`, `$EnableFeature`, `$MountDirectory`, `$Info`.

---

### Function: Enable-WinREWiFi

```yaml
---
title: "Core Function: Enable-WinREWiFi"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinREWiFi"
    - "$OSArchitecture"
    - "$MountWinRE"
  writes: [] # Modifies $MountWinRE by adding drivers
cmdlet_dependencies:
  - "Get-OSDCatalogIntelWirelessDriver"
  - "Test-WebConnection"
  - "Save-WebFile"
  - "Get-Item"
  - "Expand-Archive"
  - "Add-WindowsDriver"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Attempts to enable WiFi support in the mounted `WinRE.wim` by downloading and injecting generic Intel Wireless drivers.
**Syntax**: `function Enable-WinREWiFi { param () }`
**Key Operations**: Aborts if not New-OSBuild/New-OSDCloudOSMedia or if `$WinREWiFi` is false. Finds Intel driver URL from OSDCloud catalog. If URL is reachable, downloads driver package, expands it, and injects drivers into `$MountWinRE` recursively and force unsigned. Warns if URL unreachable.
**Variable Dependencies**: Reads `$ScriptName`, `$WinREWiFi`, `$OSArchitecture`, `$MountWinRE`.

---

### Function: Enable-WinPEOSDCloud

```yaml
---
title: "Core Function: Enable-WinPEOSDCloud"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName"
    - "$WinPEOSDCloud"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
    - "$MountDirectory"
    - "$env:TEMP"
  writes: [] # Modifies PE images
cmdlet_dependencies:
  - "Set-WindowsImageExecutionPolicy"
  - "Enable-PEWindowsImagePSGallery"
  - "Save-Module"
  - "Out-File"
  - "Start-Process"
  - "Write-Host"
---
```

**Purpose**: Configures mounted PE images for OSDCloud compatibility (PowerShell execution policy, PSGallery, console settings, OSD module).
**Syntax**: `function Enable-WinPEOSDCloud { param () }`
**Key Operations**: Aborts if not New-OSBuild/New-PEBuild/New-OSDCloudOSMedia or if `$WinPEOSDCloud` is false. Sets execution policy to Bypass and enables PSGallery for all PE mount paths. Defines console registry settings, saves to temp `.reg`, loads PE hives, imports `.reg`, unloads hives. Saves the OSD module into the PE images' PowerShell module directories.
**Variable Dependencies**: Reads `$ScriptName`, `$WinPEOSDCloud`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`, `$MountDirectory`, `$env:TEMP`.

---

## Image Mount/Dismount Functions

These functions are wrappers or direct calls for mounting and dismounting Windows Image (`.wim`) files.

---

### Function: Dismount-InstallwimOS

```yaml
---
title: "Core Function: Dismount-InstallwimOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$MountDirectory"
    - "$Info"
    - "$WaitDismount"
cmdlet_dependencies:
  - "Dismount-WindowsImage"
  - "Read-Host"
  - "Start-Sleep"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Dismounts the main OS image (`install.wim`) from its mount point, saving changes. Includes a retry mechanism.
**Syntax**: `function Dismount-InstallwimOS { param () }`
**Key Operations**: Optionally pauses if `$WaitDismount` is present. Waits 10s. Attempts `Dismount-WindowsImage -Path "$MountDirectory" -Save`. If fails, waits 30s and retries. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$MountDirectory`, `$Info`, `$WaitDismount`.

---

### Function: Dismount-OSDOfflineRegistry

```yaml
---
title: "Core Function: Dismount-OSDOfflineRegistry"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$MountPath"
cmdlet_dependencies:
  - "Test-Path"
  - "Start-Process"
  - "Write-Verbose"
  - "Write-Warning"
  - "Pause-Host"
---
```

**Purpose**: Unloads offline registry hives previously loaded from a mounted image into the host system's registry.
**Syntax**: `function Dismount-OSDOfflineRegistry { param ([Parameter(Mandatory)][string]$MountPath) }`
**Parameters**:
*   **`-MountPath`**: `[string]` (Mandatory) - Path to the mounted image.
**Key Operations**: If `$MountPath` exists, attempts to unload `HKLM:\OfflineDefaultUser`, `HKLM:\OfflineDefault`, `HKLM:\OfflineSoftware`, `HKLM:\OfflineSystem` using `reg unload`. Performs a second attempt. If hives remain loaded, warns and pauses for manual intervention.
**Variable Dependencies**: Reads `$MountPath`.

---

### Function: Dismount-WimsPE

```yaml
---
title: "Core Function: Dismount-WimsPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
    - "$MountWinPE", "$MountWinRE", "$MountWinSE"
cmdlet_dependencies:
  - "Dismount-WindowsImage"
  - "Start-Sleep"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Dismounts the `WinPE.wim`, `WinRE.wim`, and `WinSE.wim` images, saving changes. Includes retry mechanisms.
**Syntax**: `function Dismount-WimsPE { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the media build directory (for log paths).
**Key Operations**: Waits 10s. Attempts `Dismount-WindowsImage -Save` for `$MountWinPE`, `$MountWinRE`, and `$MountWinSE` sequentially. Retries after 30s if dismount fails. Logs to `$OSMediaPath\WinPE\info\logs\`.
**Variable Dependencies**: Reads `$OSMediaPath`, `$MountWinPE`, `$MountWinRE`, `$MountWinSE`.

---

### Function: Mount-ImportOSMediaWim

```yaml
---
title: "Core Function: Mount-ImportOSMediaWim"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$MountDirectory"
    - "$OSMediaGetItem"
    - "$SourceTempWim"
    - "$SourceImagePath"
    - "$SourceImageIndex"
cmdlet_dependencies:
  - "Mount-WindowsImage"
  - "New-Item"
  - "Write-Host"
---
```

**Purpose**: Mounts a Windows image (`install.wim` or `install.esd` via temp WIM) for read-only access during `Import-OSMedia`.
**Syntax**: `function Mount-ImportOSMediaWim { param () }`
**Key Operations**: Ensures `$MountDirectory` exists. If source is ESD, mounts `$SourceTempWim` index 1. If source is WIM, mounts `$SourceImagePath` index `$SourceImageIndex`. Uses `-ReadOnly`.
**Variable Dependencies**: Reads `$MountDirectory`, `$OSMediaGetItem`, `$SourceTempWim`, `$SourceImagePath`, `$SourceImageIndex`.

---

### Function: Mount-InstallwimOS

```yaml
---
title: "Core Function: Mount-InstallwimOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$MountDirectory"
    - "$WimTemp"
    - "$Info"
cmdlet_dependencies:
  - "Mount-WindowsImage"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Mounts the main OS image (`install.wim`) from `$WimTemp` to `$MountDirectory` for servicing (read-write).
**Syntax**: `function Mount-InstallwimOS { param () }`
**Key Operations**: Uses `Mount-WindowsImage -ImagePath "$WimTemp\install.wim" -Index 1 -Path "$MountDirectory"`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$MountDirectory`, `$WimTemp`, `$Info`.

---

### Function: Mount-OSDOfflineRegistryPE

```yaml
---
title: "Core Function: Mount-OSDOfflineRegistryPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$MountPath"
cmdlet_dependencies:
  - "Test-Path"
  - "Start-Process"
  - "Write-Verbose"
---
```

**Purpose**: Loads offline registry hives from a mounted WinPE image into the host system's registry for modification.
**Syntax**: `function Mount-OSDOfflineRegistryPE { param ([Parameter(Mandatory)][string]$MountPath) }`
**Parameters**:
*   **`-MountPath`**: `[string]` (Mandatory) - Path to the mounted PE image.
**Key Operations**: If `$MountPath` exists, loads `NTUser.dat` (LocalService), `DEFAULT`, `SOFTWARE`, and `SYSTEM` hives from `$MountPath\Windows\System32\Config\` into `HKLM\Offline...` using `reg load`.
**Variable Dependencies**: Reads `$MountPath`.

---

### Function: Mount-PEBuild

```yaml
---
title: "Core Function: Mount-PEBuild"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$MountDirectory"
    - "$WorkingWim"
    - "$Info"
cmdlet_dependencies:
  - "Mount-WindowsImage"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Mounts a PE WIM image (typically `boot.wim` from `$WorkingWim`) to `$MountDirectory` for customization during `New-PEBuild`.
**Syntax**: `function Mount-PEBuild { param ([string]$MountDirectory, [string]$WorkingWim) }`
**Parameters**:
*   **`-MountDirectory`**: `[string]` - Target mount path.
*   **`-WorkingWim`**: `[string]` - Path to the PE WIM file.
**Key Operations**: Uses `Mount-WindowsImage -ImagePath $WorkingWim -Index 1 -Path "$MountDirectory"`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$MountDirectory`, `$WorkingWim`, `$Info`.

---

### Function: Mount-WinPEwim, Mount-WinREwim, Mount-WinSEwim

```yaml
---
title: "Core Function: Mount-WinPEwim / Mount-WinREwim / Mount-WinSEwim"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
    - "$MountWinPE" # (or $MountWinRE, $MountWinSE)
cmdlet_dependencies:
  - "Mount-WindowsImage"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Mounts `winpe.wim` (or `winre.wim`, `winse.wim`) from `<OSMediaPath>\WimTemp\` to its respective mount point.
**Syntax**: `function Mount-WinPEwim { param ([string]$OSMediaPath) }`, `function Mount-WinREwim { param ([string]$OSMediaPath) }`, `function Mount-WinSEwim { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the media build directory.
**Key Operations**: Uses `Mount-WindowsImage -ImagePath "$OSMediaPath\WimTemp\<wimfile>.wim" -Index 1 -Path "<respective_mount_path>"`. Logs to `$OSMediaPath\WinPE\info\logs\`.
**Variable Dependencies**: Reads `$OSMediaPath`, `$MountWinPE` (or RE/SE).

---

## WIM Export Functions

These functions handle exporting image data from one WIM file to another, often changing properties like the destination name or bootability.

---

### Function: Export-InstallwimOS

```yaml
---
title: "Core Function: Export-InstallwimOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$WimTemp"
    - "$OS"
    - "$Info"
cmdlet_dependencies:
  - "Export-WindowsImage"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Exports the serviced OS image (index 1) from the temporary `install.wim` (`$WimTemp`) to its final destination (`$OS\sources\install.wim`).
**Syntax**: `function Export-InstallwimOS { param () }`
**Key Operations**: Uses `Export-WindowsImage -SourceImagePath "$WimTemp\install.wim" -SourceIndex 1 -DestinationImagePath "$OS\sources\install.wim"`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads `$WimTemp`, `$OS`, `$Info`.

---

### Function: Export-PEBootWim

```yaml
---
title: "Core Function: Export-PEBootWim"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
cmdlet_dependencies:
  - "Export-WindowsImage"
  - "Copy-Item"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Reconstructs the `boot.wim` (WinPE index 1, WinSE index 2 bootable) from serviced `winpe.wim` and `winse.wim` in `$WimTemp`, placing it in the final `WinPE` and `OS\sources` folders.
**Syntax**: `function Export-PEBootWim { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the media build directory.
**Key Operations**: Exports `$OSMediaPath\WimTemp\winpe.wim` index 1 to `$OSMediaPath\WinPE\boot.wim`. Exports `$OSMediaPath\WimTemp\winse.wim` index 1 to `$OSMediaPath\WinPE\boot.wim` using `-Setbootable`. Copies the final `boot.wim` to `$OSMediaPath\OS\sources\`. Logs to `$OSMediaPath\WinPE\info\logs\`.
**Variable Dependencies**: Reads `$OSMediaPath`.

---

### Function: Export-PEWims

```yaml
---
title: "Core Function: Export-PEWims"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
cmdlet_dependencies:
  - "Export-WindowsImage"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Exports the serviced `winpe.wim`, `winre.wim`, and `winse.wim` from `$WimTemp` to their final destination in the `WinPE` output folder.
**Syntax**: `function Export-PEWims { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the media build directory.
**Key Operations**: Exports `$OSMediaPath\WimTemp\winpe.wim`, `$OSMediaPath\WimTemp\winre.wim`, and `$OSMediaPath\WimTemp\winse.wim` (index 1 for each) to `$OSMediaPath\WinPE\` using `Export-WindowsImage`. Logs to `$OSMediaPath\WinPE\info\logs\`.
**Variable Dependencies**: Reads `$OSMediaPath`.

---

## Inventory/Save Functions

These functions are responsible for gathering and saving various types of inventory information from the serviced images and the OSDBuilder environment itself.

---

### Function: Export-SessionsXmlOS

```yaml
---
title: "Core Function: Export-SessionsXmlOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
cmdlet_dependencies:
  - "Get-Content"
  - "Copy-Item"
  - "Remove-Item"
  - "SelectNodes"
  - "New-Object"
  - "Where-Object"
  - "Select-Object"
  - "Sort-Object"
  - "Out-File"
  - "Export-Clixml"
  - "ConvertTo-Json"
  - "Get-Date"
  - "Write-Verbose"
---
```

**Purpose**: Processes `Sessions.xml` from the OS build's `info` directory (or legacy root), extracts package installation info, and saves data in TXT, XML, JSON formats. Removes legacy root file.
**Syntax**: `function Export-SessionsXmlOS { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the OS build directory.
**Key Operations**: Copies legacy `Sessions.xml` to `info`. Reads `info\Sessions.xml`, parses package sessions. Exports parsed data to various files in `info\logs`, `info\xml`, `info\json`. Removes legacy root file.
**Variable Dependencies**: Reads `$OSMediaPath`.

---

### Function: Save-InventoryOS

```yaml
---
title: "Core Function: Save-InventoryOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
    - "$MountDirectory"
cmdlet_dependencies:
  - "Get-AppxProvisionedPackage"
  - "Get-WindowsOptionalFeature"
  - "Get-WindowsCapability"
  - "Get-WindowsPackage"
  - "Out-File"
  - "Export-Clixml"
  - "ConvertTo-Json"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
  - "Write-Warning"
---
```

**Purpose**: Gathers inventory (AppX, Features, Capabilities, Packages) from the mounted OS image and saves it in TXT, XML, JSON formats in the `info` directory.
**Syntax**: `function Save-InventoryOS { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the OS build directory.
**Key Operations**: For each inventory type (AppX, Features, Capabilities, Packages), calls the respective `Get-*` DISM cmdlet targeting `$MountDirectory`. Saves output to multiple files in `$OSMediaPath\info\`. Includes error handling.
**Variable Dependencies**: Reads `$OSMediaPath`, `$MountDirectory`.

---

### Function: Save-InventoryPE

```yaml
---
title: "Core Function: Save-InventoryPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
cmdlet_dependencies:
  - "Get-WindowsImage"
  - "Out-File"
  - "Export-Clixml"
  - "ConvertTo-Json"
  - "Set-Content"
  - "Where-Object"
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Gathers image information (`Get-WindowsImage`) for PE WIMs (`boot.wim`, `winpe.wim`, `winre.wim`, `winse.wim`) and saves it in TXT, XML, JSON formats in the `WinPE\info` directory.
**Syntax**: `function Save-InventoryPE { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the OS build directory.
**Key Operations**: Calls `Get-WindowsImage` for each PE WIM in `$OSMediaPath\WinPE\`. Saves output to multiple files in `$OSMediaPath\WinPE\info\`.
**Variable Dependencies**: Reads `$OSMediaPath`.

---

### Function: Save-RegistryCurrentVersionOS

```yaml
---
title: "Core Function: Save-RegistryCurrentVersionOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$RegKeyCurrentVersion"
    - "$Info"
    - "$WorkingPath"
cmdlet_dependencies:
  - "Out-File"
  - "Export-Clixml"
  - "ConvertTo-Json"
  - "Get-Date"
---
```

**Purpose**: Saves the content of the `$RegKeyCurrentVersion` variable (OS registry version info) to TXT, XML, JSON files.
**Syntax**: `function Save-RegistryCurrentVersionOS { param () }`
**Key Operations**: Saves the `$RegKeyCurrentVersion` object to multiple files in `$Info\` and `$WorkingPath\`.
**Variable Dependencies**: Reads `$RegKeyCurrentVersion`, `$Info`, `$WorkingPath`.

---

### Function: Save-SessionsXmlOS
(See `Export-SessionsXmlOS` above - same function, different name in code vs documentation)

---

### Function: Save-VariablesOSD

```yaml
---
title: "Core Function: Save-VariablesOSD"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$Info"
cmdlet_dependencies:
  - "Get-Variable"
  - "Select-Object"
  - "Export-Clixml"
  - "ConvertTo-Json"
  - "Out-File"
  - "Where-Object"
---
```

**Purpose**: Saves all current PowerShell session variables to XML (Clixml) and JSON files for debugging.
**Syntax**: `function Save-VariablesOSD { param () }`
**Key Operations**: Gets all variables. Exports Name and Value to `$Info\xml\Variables.xml`. Exports Name and Value (excluding Hashtables) to `$Info\json\Variables.json`.
**Variable Dependencies**: Reads `$Info`.

---

### Function: Save-WimsPE

```yaml
---
title: "Core Function: Save-WimsPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OSMediaPath"
    - "$MountDirectory" # To get winre.wim source path
cmdlet_dependencies:
  - "Copy-Item" # For boot.wim
  - "Export-WindowsImage" # For winpe.wim, winre.wim, winse.wim
  - "Get-Date"
  - "Write-Host"
  - "Write-Verbose"
---
```

**Purpose**: Exports the serviced PE WIMs (`winpe.wim`, `winre.wim`, `winse.wim`) to the final `WinPE` output folder. Note: This function's logic is different from `Export-PEWims`.
**Syntax**: `function Save-WimsPE { param ([string]$OSMediaPath) }`
**Parameters**:
*   **`-OSMediaPath`**: `[string]` - Path to the media build directory.
**Key Operations**: Copies `boot.wim` from `$OSMediaPath\OS\sources` to `$OSMediaPath\WinPE\`. Exports `winpe.wim` from `$OSMediaPath\OS\sources\boot.wim` index 1 to `$OSMediaPath\WinPE\winpe.wim`. Exports `winre.wim` from `$MountDirectory\Windows\System32\Recovery\winre.wim` to `$OSMediaPath\WinPE\winre.wim`. Exports `winse.wim` from `$OSMediaPath\OS\sources\boot.wim` index 2 to `$OSMediaPath\WinPE\winse.wim`. Logs exports to `$OSMediaPath\WinPE\info\logs\`.
**Variable Dependencies**: Reads `$OSMediaPath`, `$MountDirectory`.

---

### Function: Save-WindowsImageContentOS and Save-WindowsImageContentPE

```yaml
---
title: "Core Function: Save-WindowsImageContentOS / Save-WindowsImageContentPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OS" # Path to the OS directory
    - "$Info" # Base path for logs
cmdlet_dependencies:
  - "Get-WindowsImageContent"
  - "Out-File"
  - "Write-Host"
---
```

**Purpose**: Saves the output of `Get-WindowsImageContent` for the main `install.wim` (OS) or `boot.wim` index 1 (PE) to a text file.
**Syntax**: `function Save-WindowsImageContentOS { param () }`, `function Save-WindowsImageContentPE { param () }`
**Key Operations**: Runs `Get-WindowsImageContent` on the respective WIM path and saves output to `$Info\Get-WindowsImageContent.txt`.
**Variable Dependencies**: Reads `$OS`, `$Info`.

---

## Registry Functions

These functions are primarily involved in loading, unloading, and modifying registry hives of offline Windows images.

---

### Function: Import-RegistryRegOS

```yaml
---
title: "Core Function: Import-RegistryRegOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$RegistryTemplatesReg"
    - "$MountDirectory"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-Content"
  - "Start-Process"
  - "Write-Host"
  - "Write-Warning"
  - "Pause-Host"
---
```

**Purpose**: Imports registry settings from `.reg` files (specifically, pre-processed `.reg.Offline` files) into the mounted OS image's registry hives.
**Syntax**: `function Import-RegistryRegOS { param () }`
**Key Operations**: Aborts if `$RegistryTemplatesReg` is empty. Loads OS hives into temporary `HKLM` mount points using `reg load`. Iterates through `.reg.Offline` files in `$RegistryTemplatesReg`. Imports each using `reg import`. Unloads hives using `reg unload`, with retries and manual pause on failure.
**Variable Dependencies**: Reads `$RegistryTemplatesReg`, `$MountDirectory`.

---

### Function: Import-RegistryXmlOS

```yaml
---
title: "Core Function: Import-RegistryXmlOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$RegistryTemplatesXml"
    - "$MountDirectory"
cmdlet_dependencies:
  - "Test-Path"
  - "Get-Content"
  - "SelectNodes"
  - "New-Object"
  - "New-Item"
  - "New-ItemProperty"
  - "Remove-ItemProperty"
  - "Start-Process"
  - "Write-Host"
  - "Write-Warning"
  - "Pause-Host"
---
```

**Purpose**: Imports registry settings from custom XML files into the mounted OS image's registry hives.
**Syntax**: `function Import-RegistryXmlOS { param () }`
**Key Operations**: Aborts if `$RegistryTemplatesXml` is empty. Loads OS hives into temporary `HKLM` mount points. Iterates through XML files in `$RegistryTemplatesXml`. Parses XML nodes with `action` attribute. Remaps hive paths to temporary mount points. Performs registry modifications (add/set/delete) using PowerShell cmdlets (`New-Item`, `New-ItemProperty`, `Remove-ItemProperty`). Unloads hives with retries and manual pause.
**Variable Dependencies**: Reads `$RegistryTemplatesXml`, `$MountDirectory`.

---

## Repair Functions

These functions are designed to update older OSDBuilder task file formats to a newer structure.

---

### Function: Repair-OSBuildTask

```yaml
---
title: "Core Function: Repair-OSBuildTask"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathTasks"
    - "$global:GetOSDBuilder.VersionOSDBuilder"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-OSBuildTask"
  - "Get-Item"
  - "Get-Content"
  - "ConvertFrom-Json"
  - "Get-OSMedia"
  - "New-Guid"
  - "New-Item"
  - "Copy-Item"
  - "ConvertTo-Json"
  - "Out-File"
  - "Out-GridView"
  - "Write-Verbose"
  - "Write-Warning"
  - "Write-Host"
---
```

**Purpose**: Repairs older OSBuild task files missing an `OSMGuid`. Prompts user to select correct source OSMedia and reconstructs the task JSON into the newer format.
**Syntax**: `function Repair-OSBuildTask { param () }`
**Key Operations**: Initializes. Finds OSBuild tasks with null `OSMGuid` via `Get-OSBuildTask`. For each task, reads old JSON. If task version is old, prompts user to select correct base OSMedia via GridView. Reconstructs new task hashtable mapping old fields and selected OSMedia details. Creates backup of old task. Overwrites original task with new JSON.
**Variable Dependencies**: Reads `$SetOSDBuilderPathTasks`, `$global:GetOSDBuilder.VersionOSDBuilder`.

---

### Function: Repair-PEBuildTask

```yaml
---
title: "Core Function: Repair-PEBuildTask"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SetOSDBuilderPathTasks"
    - "$global:GetOSDBuilder.VersionOSDBuilder"
cmdlet_dependencies:
  - "Get-OSDBuilder"
  - "Get-PEBuildTask"
  - "Get-Item"
  - "Get-Content"
  - "ConvertFrom-Json"
  - "Get-OSMedia"
  - "New-Guid"
  - "New-Item"
  - "Copy-Item"
  - "ConvertTo-Json"
  - "Out-File"
  - "Out-GridView"
  - "Write-Verbose"
  - "Write-Warning"
  - "Write-Host"
---
```

**Purpose**: Repairs older PEBuild task files missing an `OSMGuid`. Prompts user to select correct source OSMedia and reconstructs the task JSON.
**Syntax**: `function Repair-PEBuildTask { param () }`
**Key Operations**: Initializes. Finds PEBuild tasks with null `OSMGuid` via `Get-PEBuildTask`. For each task, reads old JSON. If task version is old, prompts user to select correct base OSMedia via GridView. Reconstructs new task hashtable mapping old fields and selected OSMedia details. Creates backup of old task. Overwrites original task with new JSON.
**Variable Dependencies**: Reads `$SetOSDBuilderPathTasks`, `$global:GetOSDBuilder.VersionOSDBuilder`.

---

## Update Functions

These functions are responsible for applying various types of Windows updates to the OS and PE images.

---

### Function: Update-AdobeOS

```yaml
---
title: "Core Function: Update-AdobeOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesOS", "$OSMajorVersion"
    - "$OSDUpdateAdobeSU"
    - "$SetOSDBuilderPathUpdates"
    - "$MountDirectory", "$Info"
cmdlet_dependencies:
  - "Get-ChildItem", "Select-Object", "Where-Object", "Test-Path"
  - "Get-SessionsXml", "Get-WindowsPackage", "Add-WindowsPackage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies Adobe Flash Player Security Updates to the mounted OS image.
**Syntax**: `function Update-AdobeOS { param ([switch]$Force) }`
**Parameters**: `-Force`: Forces reapplication.
**Key Operations**: Aborts if skip flags are true, OS Major Version is not 10, or no Adobe updates. Iterates through updates. Locates local file. Checks if installed (unless `-Force`). Installs using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-ComponentOS

```yaml
---
title: "Core Function: Update-ComponentOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesDUC", "$SkipUpdatesOS"
    - "$OSDUpdateComponentDU"
    - "$SetOSDBuilderPathUpdates", "$MountDirectory", "$Info"
cmdlet_dependencies:
  - "Get-ChildItem", "Select-Object", "Where-Object", "Test-Path"
  - "Get-SessionsXml", "Get-WindowsPackage", "Add-WindowsPackage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies Component Updates (Dynamic Update Components) to the mounted OS image.
**Syntax**: `function Update-ComponentOS { param ([switch]$Force) }`
**Parameters**: `-Force`: Forces reapplication.
**Key Operations**: Aborts if skip flags are true or no component updates. Iterates through updates, locates local file, checks if installed (unless `-Force`), installs using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-CumulativeOS

```yaml
---
title: "Core Function: Update-CumulativeOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesOS", "$SkipUpdatesOSLCU", "$OSMajorVersion"
    - "$OSDUpdateLCU"
    - "$SetOSDBuilderPathUpdates", "$MountDirectory", "$Info"
    - "$OSImageName", "$ReleaseID"
  cmdlet_dependencies:
  - "Get-ChildItem", "Select-Object", "Where-Object", "Test-Path", "Get-SessionsXml"
  - "Test-WindowsPackageCAB", "Get-Item", "Copy-Item", "Add-WindowsPackageSSU", "Add-WindowsPackage"
  - "Get-WindowsImage", "Dismount-WindowsImage", "Mount-WindowsImage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies the Latest Cumulative Update (LCU) to the mounted OS image. Handles combined SSU/LCU packages and Win11 22H2 workaround.
**Syntax**: `function Update-CumulativeOS { param ([switch]$Force) }`
**Parameters**: `-Force`: Forces reapplication.
**Key Operations**: Aborts if skip flags are true, OS Major Version is not 10, or no LCU. Iterates through LCUs. Locates local file. Checks if installed (unless `-Force`). Determines package type (CombinedMSU, CombinedLCU). If combined, extracts/installs SSU and remounts. Installs LCU using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-CumulativePE

```yaml
---
title: "Core Function: Update-CumulativePE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesPE", "$SkipUpdatesPELCU", "$OSDUpdateLCU"
    - "$OSMajorVersion", "$OSBuild", "$OSVersion"
    - "$SetOSDBuilderPathUpdates", "$MountWinPE", "$MountWinRE", "$MountWinSE", "$PEInfo"
    - "$SkipComponentCleanup", "$SkipUpdatesWinSE", "$ReleaseId"
cmdlet_dependencies:
  - "Get-SessionsXml", "Get-WindowsPackage", "Add-WindowsPackageSSU", "Add-WindowsPackage"
  - "dism.exe", "Show-ActionTime", "Write-Host", "Write-Verbose", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies the Latest Cumulative Update (LCU) to the mounted WinPE images. **Note: As written, this function currently returns early and does not apply LCUs.**
**Syntax**: `function Update-CumulativePE { param ([switch]$Force) }`
**Parameters**: `-Force`: Forces reapplication.
**Key Operations**: Aborts if skip flags are true or no LCU. **Contains an early `Return` statement.** (Unreachable logic: filters LCU for PE, iterates, locates file, checks if installed, installs SSU then LCU, performs cleanup).
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-DotNetOS

```yaml
---
title: "Core Function: Update-DotNetOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesOS", "$OSMajorVersion"
    - "$OSDUpdateDotNet"
    - "$SetOSDBuilderPathUpdates", "$MountDirectory", "$Info"
cmdlet_dependencies:
  - "Get-ChildItem", "Select-Object", "Where-Object", "Test-Path", "Get-SessionsXml", "Get-WindowsPackage", "Add-WindowsPackage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies .NET Framework updates to the mounted OS image.
**Syntax**: `function Update-DotNetOS { param ([switch]$Force) }`
**Parameters**: `-Force`: Forces reapplication.
**Key Operations**: Aborts if skip flags are true, OS Major Version is not 10, or no .NET updates. Sorts updates. Iterates through non-CU, then CU .NET updates. Locates file, checks if installed (unless `-Force`), installs using `Add-WindowsPackage`. Logs to `$Info\logs\`. Handles `0x8007371b`.
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-LangIniMEDIA

```yaml
---
title: "Core Function: Update-LangIniMEDIA"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$OS" # Source of lang.ini
    - "$SetOSDBuilderPathMount" # For temp mount paths
    - "$OSMediaPath" # For log paths
cmdlet_dependencies:
  - "Show-ActionTime", "Write-Host", "Write-Warning", "Get-Date"
  - "Join-Path", "New-Item", "Mount-WindowsImage", "Copy-Item", "Start-Sleep", "Dismount-WindowsImage", "Remove-Item"
---
```

**Purpose**: Updates `lang.ini` in `WinSE.wim` and `boot.wim` index 2 with the version from the OS build sources.
**Syntax**: `function Update-LangIniMEDIA { param ([string]$OSMediaPath) }`
**Parameters**: `-OSMediaPath`: Path to the media build directory.
**Key Operations**: Mounts `$OSMediaPath\WinPE\winse.wim` to a temp path. Copies `$OS\Sources\lang.ini` to temp mount `\Sources`. Dismounts WinSE (saving). Removes temp mount. Repeats process for `$OS\Sources\boot.wim` index 2.
**Variable Dependencies**: Reads `$OS`, `$SetOSDBuilderPathMount`, `$OSMediaPath`.

---

### Function: Update-ModuleOSDBuilder

```yaml
---
title: "Core Function: Update-ModuleOSDBuilder"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies: [] # Operates on modules, not build variables
cmdlet_dependencies:
  - "Uninstall-Module"
  - "Remove-Module"
  - "Install-Module"
  - "Import-Module"
  - "Write-Warning"
---
```

**Purpose**: Updates the OSDBuilder module itself by uninstalling, removing, installing, and importing the latest version from PSGallery.
**Syntax**: `function Update-ModuleOSDBuilder { param ([switch]$CurrentUser) }`
**Parameters**: `-CurrentUser`: Installs for the current user scope.
**Key Operations**: Uninstalls all versions of OSDBuilder. Removes the module from session. Installs the OSD module (dependency). Installs the OSDBuilder module (optionally `-Scope CurrentUser`). Imports the OSDBuilder module. Warns user to close sessions.

---

### Function: Update-OptionalOS

```yaml
---
title: "Core Function: Update-OptionalOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName", "$SkipUpdates", "$SkipUpdatesOS", "$OSMajorVersion"
    - "$OSDUpdateOptional"
    - "$SetOSDBuilderPathUpdates", "$MountDirectory", "$Info"
cmdlet_dependencies:
  - "Get-ChildItem", "Select-Object", "Where-Object", "Test-Path", "Get-SessionsXml", "Get-WindowsPackage", "Add-WindowsPackage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Get-Date"
---
```

**Purpose**: Applies "Optional" updates to the mounted OS image.
**Syntax**: `function Update-OptionalOS { param () }`
**Key Operations**: Aborts if skip flags are true, OS Major Version is not 10, or no optional updates. Iterates through updates, locates file, checks if installed (unless `$Force.IsPresent`), installs using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads listed variables and `$Force` from calling scope.

---

### Function: Update-ServicingStackOS

```yaml
---
title: "Core Function: Update-ServicingStackOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesOS", "$SkipUpdatesOSSSU", "$OSMajorVersion"
    - "$OSDUpdateSSU"
    - "$SetOSDBuilderPathUpdates", "$MountDirectory", "$Info"
cmdlet_dependencies:
  - "Get-ChildItem", "Select-Object", "Where-Object", "Test-Path", "Get-SessionsXml", "Get-WindowsPackage", "Add-WindowsPackage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Get-Date"
---
```

**Purpose**: Applies Servicing Stack Updates (SSU) to the mounted OS image.
**Syntax**: `function Update-ServicingStackOS { param ([switch]$Force) }`
**Parameters**: `-Force`: Forces reapplication.
**Key Operations**: Aborts if skip flags are true, OS Major Version is not 10, or no SSUs. Iterates through SSUs, locates file, checks if installed (unless `-Force`), installs using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-ServicingStackPE

```yaml
---
title: "Core Function: Update-ServicingStackPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesPE", "$SkipUpdatesPESSU", "$OSDUpdateSSU"
    - "$OSMajorVersion", "$OSBuild"
    - "$SetOSDBuilderPathUpdates", "$MountWinPE", "$MountWinRE", "$MountWinSE", "$PEInfo"
cmdlet_dependencies:
  - "Get-SessionsXml", "Get-WindowsPackage", "Add-WindowsPackage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies Servicing Stack Updates (SSU) to the mounted WinPE images. **Note: As written, this function currently returns early and does not apply SSUs.**
**Syntax**: `function Update-ServicingStackPE { param ([switch]$Force) }`
**Parameters**: `-Force`: Forces reapplication.
**Key Operations**: Aborts if skip flags are true or no SSUs. **Contains an early `Return` statement.** (Unreachable logic: filters SSU for PE, iterates, locates file, checks if installed, installs into PE mount paths).
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-SetupDUMEDIA

```yaml
---
title: "Core Function: Update-SetupDUMEDIA"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipSetupDU", "$OSDUpdateSetupDU"
    - "$SetOSDBuilderPathUpdates", "$OS", "$MountWinSE", "$Logs", "$env:TEMP"
cmdlet_dependencies:
  - "Get-ChildItem", "Test-Path", "New-Item"
  - "Show-ActionTime", "Write-Host", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies Windows Setup Dynamic Updates (SetupDU) to the OS media source (`$OS\Sources`) and the mounted Windows Setup Environment (`$MountWinSE\Sources`).
**Syntax**: `function Update-SetupDUMEDIA { param () }`
**Key Operations**: Aborts if skip flags are true or no SetupDUs. Iterates through SetupDUs. Locates local file. Expands package to temp directory. Copies expanded files to `$OS\Sources` and `$MountWinSE\Sources` using `robocopy /s /ndl /xo /xx /xl /b /np /ts /tee /r:0 /w:0`. Logs to `$Logs`.
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-SourcesPE

```yaml
---
title: "Core Function: Update-SourcesPE"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$SkipUpdates", "$SkipUpdatesPE", "$SkipUpdatesOS", "$ReleaseId", "$OSBuild"
    - "$MountWinSE"
    - "$OSMediaPath"
cmdlet_dependencies:
  - "Show-ActionTime", "Write-Host", "Write-Warning", "Get-Date"
---
```

**Purpose**: Updates `setup.exe` and `setuphost.exe` in the main OS media sources with versions from the serviced WinSE image. Primarily for older OS versions.
**Syntax**: `function Update-SourcesPE { param ([string]$OSMediaPath) }`
**Parameters**: `-OSMediaPath`: Path to the media build directory.
**Key Operations**: Aborts if skip flags are true or Release ID >= 1903 / Build >= 18362. Copies `setup.exe` and `setuphost.exe` from `$MountWinSE\sources` to `$OSMediaPath\OS\sources` using `robocopy /ndl /xo /xx /xl /b /np /ts /tee /r:0 /w:0`. Logs to `$OSMediaPath\info\logs\`.
**Variable Dependencies**: Reads listed variables.

---

### Function: Update-WindowsServer2012R2OS and Update-WindowsSevenOS

```yaml
---
title: "Core Function: Update-WindowsServer2012R2OS / Update-WindowsSevenOS"
type: "Core Function"
module_file: "AllFunctions.ps1"
scope_dependencies:
  reads:
    - "$ScriptName", "$SkipUpdates", "$OSMajorVersion"
    - "$OSDUpdateWinTwelveR2" # or $OSDUpdateWinSeven
    - "$SetOSDBuilderPathUpdates", "$MountDirectory", "$Info"
cmdlet_dependencies:
  - "Get-ChildItem", "Select-Object", "Where-Object", "Test-Path", "Get-Content"
  - "Get-WindowsPackage", "Add-WindowsPackage"
  - "Show-ActionTime", "Write-Host", "Write-Verbose", "Write-Warning", "Get-Date"
---
```

**Purpose**: Applies updates specifically cataloged for Windows Server 2012 R2 or Windows 7 to the mounted OS image.
**Syntax**: `function Update-WindowsServer2012R2OS { param () }`, `function Update-WindowsSevenOS { param () }`
**Key Operations**: Aborts if not Update-OSMedia, skip flags are true, OS Major Version is 10, or no updates for the specific OS. Loads `Sessions.xml`. Iterates through updates. Locates file. Checks if installed (via Sessions.xml or Get-WindowsPackage). Installs using `Add-WindowsPackage`. Logs to `$Info\logs\`.
**Variable Dependencies**: Reads listed variables.

---

## Utility Functions

These are general-purpose helper functions used within the OSDBuilder module.

---

### Function: Convert-ByteArrayToHex

```yaml
---
title: "Utility Function: Convert-ByteArrayToHex"
type: "Utility Function"
module_file: "AllFunctions.ps1"
scope_dependencies: []
cmdlet_dependencies:
  - "System.Text.StringBuilder"
---
```

**Purpose**: Converts a byte array into its hexadecimal string representation.
**Source**: [https://www.reddit.com/r/PowerShell/comments/5rhjsy/hex_to_byte_array_and_back/](https://www.reddit.com/r/PowerShell/comments/5rhjsy/hex_to_byte_array_and_back/)
**Syntax**: `Function Convert-ByteArrayToHex { param ([parameter(Mandatory=$true)][Byte[]]$Bytes) }`
**Parameters**: `-Bytes`: `[Byte[]]` (Mandatory) - The array of bytes.
**Key Operations**: Uses `System.Text.StringBuilder` to build a hex string from the byte array.
**Output**: `[string]` - Hexadecimal string.

---

### Function: Get-OSDFromJson

```yaml
---
title: "Utility Function: Get-OSDFromJson"
type: "Utility Function"
module_file: "AllFunctions.ps1"
scope_dependencies: []
cmdlet_dependencies:
  - "Test-Path", "Get-Content", "ConvertFrom-Json", "Get-Value", "Write-Verbose"
---
```

**Purpose**: Reads a JSON file and converts its content into a PowerShell hashtable, recursively converting nested objects and arrays.
**Syntax**: `function Get-OSDFromJson { param ([Parameter(Mandatory=$true, Position=1)][string]$Path) }`
**Parameters**: `-Path`: `[string]` (Mandatory) - Path to the JSON file.
**Key Operations**: Reads JSON file (or uses empty JSON if not found). Converts initially using `ConvertFrom-Json`. Calls internal `Get-Value` to recursively convert PSCustomObjects and arrays to Hashtables and ArrayLists.
**Output**: `[System.Collections.Hashtable]` - Hashtable representation of the JSON.

---

### Function: Get-Value

```yaml
---
title: "Internal Helper Function: Get-Value (for Get-OSDFromJson)"
type: "Internal Helper"
module_file: "AllFunctions.ps1"
scope_dependencies: []
cmdlet_dependencies:
  - "New-Object"
  - "Write-Verbose"
---
```

**Purpose**: Recursive helper for `Get-OSDFromJson`. Converts PSCustomObjects to Hashtables and arrays to ArrayLists within a JSON-derived structure.
**Syntax**: `function Get-Value { param( $value ) }`
**Parameters**: `$value`: `[System.Object]` - The object/value to process.
**Key Operations**: Checks type of `$value`. If PSCustomObject, creates Hashtable and recurses on properties. If array, creates ArrayList and recurses on elements. Otherwise, returns value directly.
**Output**: `[System.Object]` - Hashtable, ArrayList, or primitive value.

---
```
