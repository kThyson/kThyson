# Section: Directory Structure FAQ

**Q: Where should I place drivers or scripts for use in builds?**
A: Place them in the appropriate subdirectory under `Content/` (e.g., `Content/Drivers/`, `Content/Scripts/`).

**Q: How do I back up my OSDBuilder environment?**
A: Back up the entire OSDBuilder home directory, including all subdirectories and configuration files.

**Q: What happens if I delete a directory by mistake?**
A: You can recreate missing directories by running `Get-OSDBuilder -CreatePaths`.
