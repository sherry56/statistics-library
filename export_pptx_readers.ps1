$ErrorActionPreference = 'Stop'

$sourceRoot = Join-Path $PSScriptRoot 'resources\courseware'
$outputRoot = Join-Path $PSScriptRoot 'resources\previews\pptx'
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null

$powerPoint = New-Object -ComObject PowerPoint.Application
$powerPoint.DisplayAlerts = 1

try {
    $presentations = Get-ChildItem -LiteralPath $sourceRoot -Filter '*.pptx' | Sort-Object Name
    foreach ($file in $presentations) {
        $outputPath = Join-Path $outputRoot ($file.BaseName + '.pdf')
        Write-Host "Exporting $($file.Name)"
        $presentation = $powerPoint.Presentations.Open($file.FullName, $true, $false, $false)
        try {
            # 32 = ppSaveAsPDF. This keeps PowerPoint's own slide rendering.
            $presentation.SaveAs($outputPath, 32)
        }
        finally {
            $presentation.Close()
        }
    }
}
finally {
    $powerPoint.Quit()
    [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($powerPoint)
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

Get-ChildItem -LiteralPath $outputRoot -Filter '*.pdf' |
    Select-Object Name, Length |
    Format-Table -AutoSize
