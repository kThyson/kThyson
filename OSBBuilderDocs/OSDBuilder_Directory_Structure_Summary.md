# OSDBuilder Directory Structure (Summary)

Understanding this directory structure is key to effectively using OSDBuilder, as it dictates where input files are sourced and where output artifacts are placed.

*   **`<OSDBuilderHome>`**: The root directory of the OSDBuilder instance.
    *   **`Content/`**: Source materials and content for OS/WinPE images.
    *   **`ContentPacks/`**: Modular content packs.
    *   **`FeatureUpdates/`**: Downloaded Windows Feature Update ESD files.
    *   **`Mount/`**: Temporary location for mounting WIM files.
    *   **`OSBuilds/`**: Output for customized OS images.
    *   **`OSImport/`**: Output for imported OS installation media.
    *   **`OSMedia/`**: Output for fully serviced and updated OS images.
    *   **`PEBuilds/`**: Output for customized WinPE images.
    *   **`Tasks/`**: User-created JSON task files.
    *   **`Templates/`**: JSON template files for automation.
    *   **`Updates/`**: Downloaded Microsoft Update packages.
    *   **`OSDBuilder.json`**: Local configuration file (optional).
