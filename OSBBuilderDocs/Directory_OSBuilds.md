# Directory: OSBuilds

**Purpose**: The output directory for customized OS images created by the `New-OSBuild` cmdlet. Each successful build results in a new subdirectory here, named descriptively (e.g., based on OS name, architecture, ReleaseID, UBR, or custom name).

Each subdirectory within `OSBuilds/` represents a completed and customized OS build. The naming convention typically includes details such as the OS name, architecture, ReleaseID, UBR (Update Build Revision), and any custom name provided during the build process. These directories contain all files necessary for deployment or further customization, and may include metadata files, logs, and the final WIM or ISO images. This structure allows users to maintain multiple builds for different purposes or deployment scenarios.
