# PowerShell Script to Detect Installed Software
# This script can be called from the web application to detect real software

param(
    [string]$SoftwareName = ""
)

# Function to get all installed software
function Get-InstalledSoftware {
    $software = @()
    
    # Check 64-bit applications
    $regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
    $software += Get-ItemProperty -Path $regPath | Where-Object { $_.DisplayName -ne $null } | Select-Object DisplayName, DisplayVersion, InstallLocation, Publisher, InstallDate
    
    # Check 32-bit applications on 64-bit system
    $regPath32 = "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
    $software += Get-ItemProperty -Path $regPath32 | Where-Object { $_.DisplayName -ne $null } | Select-Object DisplayName, DisplayVersion, InstallLocation, Publisher, InstallDate
    
    return $software
}

# Function to check specific software
function Check-SpecificSoftware {
    param([string]$Name)
    
    $allSoftware = Get-InstalledSoftware
    $found = $allSoftware | Where-Object { $_.DisplayName -like "*$Name*" }
    
    if ($found) {
        return @{
            Found = $true
            Name = $found.DisplayName
            Version = $found.DisplayVersion
            Path = $found.InstallLocation
            Publisher = $found.Publisher
            InstallDate = $found.InstallDate
        }
    } else {
        return @{
            Found = $false
        }
    }
}

# Function to get system information
function Get-SystemInfo {
    $os = Get-WmiObject -Class Win32_OperatingSystem
    $memory = Get-WmiObject -Class Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum
    $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
    
    return @{
        OS = $os.Caption
        Architecture = $os.OSArchitecture
        TotalMemory = [math]::Round($memory.Sum / 1GB, 2)
        FreeSpace = [math]::Round($disk.FreeSpace / 1GB, 2)
    }
}

# Main execution
if ($SoftwareName -ne "") {
    # Check specific software
    $result = Check-SpecificSoftware -Name $SoftwareName
    $result | ConvertTo-Json -Compress
} else {
    # Get all video editing software
    $allSoftware = Get-InstalledSoftware
    $videoEditingKeywords = @(
        "After Effects", "Premiere Pro", "Photoshop", "Illustrator",
        "DaVinci Resolve", "Blender", "Cinema 4D", "Maya", "3ds Max",
        "Final Cut", "Vegas Pro", "HitFilm", "Resolve"
    )
    
    $videoSoftware = $allSoftware | Where-Object {
        $name = $_.DisplayName
        $videoEditingKeywords | Where-Object { $name -like "*$_*" }
    }
    
    $systemInfo = Get-SystemInfo
    
    $result = @{
        SystemInfo = $systemInfo
        VideoEditingSoftware = $videoSoftware
        AllSoftware = $allSoftware
    }
    
    $result | ConvertTo-Json -Compress
} 