# Section: Directory Structure Content

The `Content/` directory stores all source materials and content that can be injected into or used to customize OS and WinPE images. Key subdirectories include:

- **ADK/**: Contains Windows ADK optional components (e.g., `WinPE-NetFx.cab`, `WinPE-PowerShell.cab`) organized by OS version and architecture.
- **DaRT/**: Stores Microsoft DaRT (Diagnostics and Recovery Toolset) `Tools*.cab` files and `DartConfig.dat`.
- **Drivers/**: Root directory for storing driver `.inf` files and their associated binaries, typically organized in subfolders.
- **ExtraFiles/**: For arbitrary files and folders that need to be copied directly into the target image.
- **IsoExtract/**: Used to store content extracted from ISO files, such as Language Pack ISOs or Features on Demand ISOs.
- **OneDrive/**: Location for `OneDriveSetup.exe` (Production or Enterprise versions).
- **Packages/**: For `.msu` and `.cab` files that will be added to the OS image as Windows packages (distinct from updates).
- **Scripts/**: PowerShell scripts (`.ps1`) that can be executed at various stages of image customization.
- **StartLayout/**: Stores `LayoutModification.xml` files for customizing the Windows Start Menu.
- **Unattend/**: Contains `Unattend.xml` files for automating Windows Setup phases.
