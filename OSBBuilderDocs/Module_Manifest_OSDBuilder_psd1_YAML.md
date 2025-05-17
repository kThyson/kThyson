# Module Manifest: OSDBuilder.psd1 (YAML)

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
