# Root Module Script: OSDBuilder.psm1 (YAML)

```yaml
---
title: "Root Module Script: OSDBuilder.psm1"
type: "Module Script"
---
```

The `OSDBuilder.psm1` script is the main executable file for the OSDBuilder module. Its primary responsibilities are to load all necessary function definitions and to export the public interface of the module.

**Key Operations**:

1.  **Function Discovery and Loading**:
    *   It defines two arrays, `$OSDPublicFunctions` and `$OSDPrivateFunctions`.
    *   `$OSDPublicFunctions` is populated by finding all `.ps1` files in the `$PSScriptRoot\Public\` directory (and its subdirectories).
    *   `$OSDPrivateFunctions` is populated by finding all `.ps1` files in the `$PSScriptRoot\Private\` directory (and its subdirectories). The `AllFunctions.ps1` file, containing the bulk of the core logic, would typically reside here or be structured similarly.
    *   It then iterates through the combined list of these discovered script files and dot-sources each one (`. $Import.FullName`). This action loads all functions defined within those files into the module's scope.
    *   Includes basic error handling to report if a function script fails to import.

2.  **Exporting Public Functions**:
    *   `Export-ModuleMember -Function $OSDPublicFunctions.BaseName`: This command explicitly exports only the functions whose script basenames were collected in `$OSDPublicFunctions`. This ensures that only functions intended to be part of the public API are directly callable by the user after importing the module.

3.  **Alias Creation**:
    *   `New-Alias -Name <AliasName> -Value <FunctionName> -Force -ErrorAction SilentlyContinue`: This creates several convenient aliases for some of the public functions.
        *   `Get-OSBuilder` for `Get-OSDBuilder`
        *   `New-OSBMediaISO` for `New-OSDBuilderISO`
        *   `New-OSBMediaUSB` for `New-OSDBuilderUSB`
        *   `Show-OSBMediaInfo` for `Show-OSDBuilderInfo`
        *   `Get-DownOSDBuilder` for `Save-OSDBuilderDownload`
    *   The script also contains commented-out legacy aliases (e.g., `ImportOSD` for `Import-OSMedia`), suggesting a history of name changes.

4.  **General Export**:
    *   `Export-ModuleMember -Function * -Alias *`: This is a broader export statement that ensures all functions (including any not explicitly listed if the previous export was more restrictive) and all aliases defined within the module's scope are exported.

In essence, `OSDBuilder.psm1` acts as the assembler and publisher for the module, bringing together all its components and defining what the user can directly interact with.
