# Section: Directory Structure Update Download

The `Update-OSMedia` cmdlet can be configured to default to downloading missing updates by setting the appropriate property in the `OSDBuilder.json` configuration file. For example, setting `"UpdateOSMediaDownload": true` in the JSON file ensures that updates are automatically downloaded during servicing operations. This allows for automated, up-to-date servicing of images without manual intervention.
