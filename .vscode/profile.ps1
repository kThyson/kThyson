# Install modules if not already installed
if (-not (Get-Module -ListAvailable -Name PSReadLine)) { Install-Module PSReadLine -Force -Scope CurrentUser }
if (-not (Get-Module -ListAvailable -Name oh-my-posh)) { Install-Module oh-my-posh -Force -Scope CurrentUser }
if (-not (Get-Module -ListAvailable -Name posh-git)) { Install-Module posh-git -Force -Scope CurrentUser }
if (-not (Get-Module -ListAvailable -Name PSFzf)) { Install-Module PSFzf -Force -Scope CurrentUser }

# Import modules
Import-Module PSReadLine
Import-Module oh-my-posh
Import-Module posh-git
Import-Module PSFzf

# Enable PSReadLine features
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -Colors @{
    "Command" = [ConsoleColor]::Cyan
    "Parameter" = [ConsoleColor]::Yellow
    "String" = [ConsoleColor]::Green
    "Operator" = [ConsoleColor]::Magenta
    "Variable" = [ConsoleColor]::White
}

# Enable syntax highlighting and suggestions
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete

# Set up Oh My Posh prompt
oh-my-posh init pwsh --config "$(oh-my-posh get shell-path pwsh)" | Invoke-Expression

# Enable posh-git
Import-Module posh-git

# Enable PSFzf for fuzzy search
Set-PsFzfOption -PSReadlineChord 'Ctrl+t'

# Aliases and quality of life improvements
Set-Alias ll Get-ChildItem
Set-Alias la "Get-ChildItem -Force"