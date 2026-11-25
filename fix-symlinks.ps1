param([string]$Root = ".open-next\server-functions\default\node_modules")

$ErrorActionPreference = 'Continue'
$count = 0
$failed = 0

Get-ChildItem -LiteralPath $Root -Recurse -Force -Attributes ReparsePoint | ForEach-Object {
    $link = $_.FullName
    try {
        $q = cmd /c "fsutil reparsepoint query `"$link`"" 2>$null
        # Print buffer lines then parse UTF-16 text from hex dump
        $hexLines = $q | Where-Object { $_ -match '^\d{4}:\s' }
        if (-not $hexLines) { Write-Host "NODATA: $link"; $script:failed++; return }
        $bytes = New-Object System.Collections.Generic.List[byte]
        foreach ($hl in $hexLines) {
            # format: "0000:  4a 00 4a 00 ...  J.J..."
            $parts = ($hl -replace '^\d{4}:\s+', '' -replace '\s{2,}.*$', '') -split '\s+'
            foreach ($p in $parts) { if ($p -match '^[0-9a-fA-F]{2}$') { $bytes.Add([Convert]::ToByte($p, 16)) } }
        }
        $text = [Text.Encoding]::Unicode.GetString($bytes.ToArray())
        # Take up to first NUL
        $nul = $text.IndexOf([char]0)
        if ($nul -ge 0) { $text = $text.Substring(0, $nul) }
        $targetRaw = $text.Trim()
        $targetRaw = $targetRaw -replace '^\\\?\?\\', ''
        if (-not $targetRaw) { Write-Host "EMPTY: $link"; $script:failed++; return }
        if ([IO.Path]::IsPathRooted($targetRaw)) {
            $target = [IO.Path]::GetFullPath($targetRaw)
        } else {
            $target = [IO.Path]::GetFullPath((Join-Path $_.Parent.FullName $targetRaw))
        }
        if (-not (Test-Path -LiteralPath $target)) { Write-Host "SKIP missing: $link -> $target"; $script:failed++; return }
        cmd /c rmdir /q "$link" 2>$null | Out-Null
        if (Test-Path -LiteralPath $link) { Write-Host "FAIL unlink: $link"; $script:failed++; return }
        cmd /c mklink /j "$link" "$target" 2>$null | Out-Null
        if (Test-Path -LiteralPath $link) { $script:count++ } else { Write-Host "FAIL mklink: $link"; $script:failed++ }
    } catch {
        Write-Host "ERR ${link}: $($_.Exception.Message)"
        $script:failed++
    }
}
Write-Host "converted=$count failed=$failed"
