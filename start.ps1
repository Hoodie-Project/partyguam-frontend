# .env 파일이 존재하면 환경변수로 설정
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim('"').Trim()
            [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
        }
    }
}

# NEXT_PUBLIC_ENV 환경 변수 확인
$envValue = $env:NEXT_PUBLIC_ENV

if ($envValue -eq "dev") {
    Write-Host "Running in development mode..."
    node server.js
} else {
    Write-Host "Running in production mode..."
    npx next dev
}
