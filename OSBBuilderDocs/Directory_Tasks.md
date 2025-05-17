# Directory: Tasks

**Purpose**: Stores user-created JSON files that define a specific set of customizations and parameters for `New-OSBuild` or `New-PEBuild`. These tasks can be executed repeatedly.

Each JSON file in this directory represents a reusable task definition, specifying the customizations, packages, drivers, scripts, and other parameters to be applied during an OS or PE build. By saving these tasks, users can quickly re-run complex build scenarios or share task definitions with others. The structure and schema of these JSON files are defined by OSDBuilder and may evolve with new versions. Tasks can be created manually or generated via OSDBuilder cmdlets.
