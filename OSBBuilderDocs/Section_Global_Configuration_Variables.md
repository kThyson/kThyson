# Section: Global Configuration Variables

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
