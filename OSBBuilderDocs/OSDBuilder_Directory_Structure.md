# OSDBuilder Directory Structure

The OSDBuilder module operates using a well-defined directory structure, rooted at the path specified as the "OSDBuilder Home" (typically `C:\OSDBuilder`, stored in `$global:GetOSDBuilderHome`). This structure is crucial for organizing source files, outputs, configurations, and temporary working files. The main directories are typically created by `Get-OSDBuilder -CreatePaths`.

*   **`<OSDBuilderHome>`**: The root directory of the OSDBuilder instance.
    *   **`Content/`**:
        *   **Purpose**: Stores all source materials and content that can be injected into or used to customize OS and WinPE images.
        *   **Key Subdirectories**:
            *   `ADK/`: Contains Windows ADK optional components (e.g., `WinPE-NetFx.cab`, `WinPE-PowerShell.cab`) organized by OS version and architecture.
            *   `Unattend/`: Contains `Unattend.xml` files for automating Windows Setup phases.
    *   **`ContentPacks/`**:
        *   **Purpose**: Allows users to group various content items (drivers, scripts, registry settings, extra files, ADK components for PE) into reusable "packs" for modular application.
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
