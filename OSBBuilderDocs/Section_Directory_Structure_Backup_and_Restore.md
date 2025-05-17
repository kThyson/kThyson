# Section: Directory Structure Backup and Restore

Backing up and restoring the OSDBuilder directory structure is essential for disaster recovery, migration, or replicating environments. The recommended approach is to back up the entire OSDBuilder home directory (including all subdirectories such as Content, ContentPacks, FeatureUpdates, Mount, OSBuilds, OSImport, OSMedia, PEBuilds, Tasks, Templates, Updates, and the OSDBuilder.json configuration file). Use standard file backup tools or PowerShell cmdlets (such as `Copy-Item` or `robocopy`) to create a copy of the directory structure.

**Backup Example:**
```powershell
Copy-Item -Path C:\OSDBuilder -Destination D:\Backups\OSDBuilderBackup -Recurse
```

**Restore Example:**
```powershell
Copy-Item -Path D:\Backups\OSDBuilderBackup -Destination C:\OSDBuilder -Recurse
```

Ensure that permissions are preserved and that the restored directory is set as the OSDBuilder home if moved to a new system. After restoration, run `Initialize-OSDBuilder` to re-establish global variables and configuration.
