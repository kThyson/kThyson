# Section: Directory Structure Templates

The `Templates/` directory stores JSON task files that function as templates. Templates can be automatically applied during `New-OSBuild` if their naming convention matches certain criteria (e.g., "Global" templates, or templates matching the OS family of the build). This allows for standardized baseline customizations to be applied to builds without manual intervention. Organize templates by naming them according to the OS family or use the "Global" template for settings that should apply to all builds.
