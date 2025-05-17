# Section: Directory Structure Subdirectories

The OSDBuilder directory structure includes several key subdirectories, each serving a specific purpose in the build and customization process:

- **Content/**: Stores all source materials and content that can be injected into or used to customize OS and WinPE images.
  - **ADK/**: Windows ADK optional components (e.g., `WinPE-NetFx.cab`, `WinPE-PowerShell.cab`) organized by OS version and architecture.
  - **DaRT/**: Microsoft DaRT (Diagnostics and Recovery Toolset) `Tools*.cab` files and `DartConfig.dat`.
  - **Drivers/**: Driver `.inf` files and their associated binaries, typically organized in subfolders.
  - **ExtraFiles/**: Arbitrary files and folders to be copied directly into the target image.
  - **IsoExtract/**: Content extracted from ISO files, such as Language Pack ISOs or Features on Demand ISOs.
  - **OneDrive/**: Location for `OneDriveSetup.exe` (Production or Enterprise versions).
  - **Packages/**: `.msu` and `.cab` files to be added to the OS image as Windows packages.
  - **Scripts/**: PowerShell scripts (`.ps1`) for various stages of image customization.
  - **StartLayout/**: `LayoutModification.xml` files for customizing the Windows Start Menu.
  - **Unattend/**: `Unattend.xml` files for automating Windows Setup phases.
- **ContentPacks/**: Allows users to group content items into reusable "packs" for modular application.
- **FeatureUpdates/**: Stores downloaded Windows Feature Update ESD files and their expanded contents.
- **Mount/**: Temporary location for mounting Windows Image (`.wim`) files during servicing operations.
- **OSBuilds/**: Output directory for customized OS images created by the `New-OSBuild` cmdlet.
- **OSImport/**: Initial output directory when OS installation media is imported using `Import-OSMedia`.
- **OSMedia/**: Output directory for fully serviced and updated OS images.
- **PEBuilds/**: Output directory for customized WinPE images created by the `New-PEBuild` cmdlet.
- **Tasks/**: Stores user-created JSON files that define customizations and parameters for builds.
- **Templates/**: Stores JSON task files that function as templates for standardized baseline customizations.
- **Updates/**: Stores downloaded Microsoft Update packages (`.msu` and `.cab` files).
- **OSDBuilder.json**: Local configuration file for OSDBuilder instance-specific settings.
