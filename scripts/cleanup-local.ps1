param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$targets = [Collections.Generic.List[string]]::new()
function Add-CleanupTarget([string]$target) {
    $absolute = [IO.Path]::GetFullPath($target)
    if (-not $absolute.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw "Outside project: $absolute" }
    if (Test-Path -LiteralPath $absolute) { $targets.Add($absolute) }
}
foreach ($relative in @('artifacts','baocao','DATATM','coverage','playwright-report','test-results','.cache','docs/7A8.Test.xlsx','deploy/demo-database/snapshot','nen1.jpg')) {
    Add-CleanupTarget (Join-Path $projectRoot $relative)
}
# Keep source, dependencies, Git history, current accounts and new-customer exports.
$privatePath = Join-Path $projectRoot 'private'
$accountPath = Join-Path $privatePath 'accounts.json'
$accountText = Get-Content -LiteralPath $accountPath -Raw -Encoding UTF8
$db = $accountText | ConvertFrom-Json
if (-not $db.users -or -not ($db.users | Where-Object { $_.username -eq 'nguyenthiminhhuong' })) { throw 'Expected current customer accounts missing.' }
foreach ($entry in Get-ChildItem -LiteralPath $privatePath -Force) {
    if ($entry.Name -in @('accounts.json','tai-khoan-9A3.xlsx','tai-khoan-9A3.json','9a3-names.json')) { continue }
    if ($entry.Name -like 'render-9a3-*') { continue }
    if ($entry.Name -eq 'uploads' -and $accountText -match '"fileKey"\s*:') { continue }
    Add-CleanupTarget $entry.FullName
}
# Root-level source documents are not needed to run the application.
foreach ($entry in Get-ChildItem -LiteralPath $projectRoot -File -Force) {
    if ($entry.Extension -match '^\.(doc|docx|docm|dotx|dotm|log|tmp)$') { Add-CleanupTarget $entry.FullName }
}
$unique = @($targets | Sort-Object -Unique)
$totalBytes = 0L
foreach ($target in $unique) {
    $item = Get-Item -LiteralPath $target -Force
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Refusing linked target: $target" }
    $size = if ($item.PSIsContainer) { (Get-ChildItem -LiteralPath $target -File -Recurse -Force | Measure-Object Length -Sum).Sum } else { $item.Length }
    $totalBytes += $size
    Write-Output ('{0:N2} MB  {1}' -f ($size / 1MB), $target)
}
Write-Output ('Total: {0} targets; {1:N2} GB. Apply: {2}' -f $unique.Count, ($totalBytes / 1GB), $Apply)
if ($Apply) {
    foreach ($target in $unique) { Remove-Item -LiteralPath $target -Recurse -Force }
    Write-Output 'Cleanup complete. Current accounts, source and question banks preserved.'
} else {
    Write-Output 'Preview only. Run this script with -Apply to delete listed targets.'
}
