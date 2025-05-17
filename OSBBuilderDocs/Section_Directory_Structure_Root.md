# Section: Directory Structure Root

The root directory of the OSDBuilder instance (e.g., `C:\OSDBuilder`) is the central location for all OSDBuilder operations. All subdirectories for content, builds, tasks, templates, and configuration files are created under this root. The path to the root directory is stored in the global variable `$global:GetOSDBuilderHome` and can be set or changed using the `Initialize-OSDBuilder` function.
