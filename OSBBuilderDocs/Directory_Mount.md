# Directory: Mount

**Purpose**: Default temporary location for mounting Windows Image (`.wim`) files during servicing operations. OSDBuilder creates uniquely named subdirectories here for each mount operation.

This directory is used internally by OSDBuilder whenever it needs to mount a Windows image for servicing, customization, or update injection. Each mount operation creates a uniquely named subdirectory to avoid conflicts and ensure that multiple operations can be performed in parallel or without interference. The contents of this directory are considered temporary and may be cleaned up automatically by OSDBuilder after operations complete, but users should periodically check for and remove any orphaned mount folders if interrupted operations occur.
