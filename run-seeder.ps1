# Run Database Seeder Script

# Show header with colored text
Write-Host "`n`n=========================================" -ForegroundColor Cyan
Write-Host "    Running Database Seeder" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Check if the command exists
try {
    # Run the seeder through ts-node
    Write-Host "Running seeder script..." -ForegroundColor Yellow
    npx ts-node -r tsconfig-paths/register src/seed.ts

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Seeder completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Seeder failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ Error running seeder: $_" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
