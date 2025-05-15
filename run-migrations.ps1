# Run TypeORM Migrations

# Show header with colored text
Write-Host "`n`n=========================================" -ForegroundColor Cyan
Write-Host "    Running Database Migrations" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Check if the command exists
try {
    # Run the migration through npm script
    Write-Host "Running TypeORM migrations..." -ForegroundColor Yellow
    npm run migration:run

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Migrations completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Migration failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ Error running migrations: $_" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
