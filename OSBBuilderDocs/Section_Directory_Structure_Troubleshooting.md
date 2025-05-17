# Section: Directory Structure Troubleshooting

If you encounter issues with the OSDBuilder directory structure, consider the following troubleshooting tips:

- **Missing Directories:** Run `Get-OSDBuilder -CreatePaths` to recreate any missing standard directories.
- **Orphaned Mount Folders:** If interrupted operations leave behind folders in the `Mount/` directory, delete them manually after ensuring no mount operations are active.
- **Permission Errors:** Ensure you have appropriate permissions to read/write in the OSDBuilder home and all subdirectories.
- **Corrupted or Incomplete Builds:** Remove or archive problematic subdirectories in `OSBuilds/`, `OSMedia/`, or `PEBuilds/` and rerun the build process.
- **Configuration Issues:** Verify the contents of `OSDBuilder.json` and re-run `Initialize-OSDBuilder` to reset global variables and paths.

For persistent or complex issues, consult the full documentation or seek support from the OSDBuilder community.
