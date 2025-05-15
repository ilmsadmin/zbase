# Rollback TypeORM Migrations

# Show header with colored text
Write-Host "`n`n=========================================" -ForegroundColor Cyan
Write-Host "    Rolling Back Database Migrations" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Check if the command exists
try {
    # Run the migration through npm script
    Write-Host "Rolling back latest TypeORM migration..." -ForegroundColor Yellow
    npm run migration:revert

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Migration rollback completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Migration rollback failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ Error rolling back migrations: $_" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
