#!/usr/bin/env pwsh

# Script for testing Sites module endpoints
# Prerequisites: PowerShell 7+ and cURL installed

$baseUrl = "http://localhost:3001"
$adminToken = ""

# Function to handle API responses
function Show-Response {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Response,
        
        [Parameter(Mandatory=$true)]
        [string]$Title
    )
    
    Write-Host "`n========== $Title ==========" -ForegroundColor Cyan
    try {
        $jsonResponse = $Response | ConvertFrom-Json -Depth 10
        Write-Host ($jsonResponse | ConvertTo-Json -Depth 5) -ForegroundColor Yellow
    }
    catch {
        Write-Host $Response -ForegroundColor Yellow
    }
    Write-Host "==============================`n" -ForegroundColor Cyan
}

# Login to get admin token
Write-Host "`n🔑 Logging in to get admin token..." -ForegroundColor Green
$loginData = @{
    email = "admin@example.com" # Replace with your actual admin credentials
    password = "admin123"       # Replace with your actual admin password
} | ConvertTo-Json

$response = curl -s -X POST "$baseUrl/auth/login" -H "Content-Type: application/json" -d $loginData

try {
    $jsonResponse = $response | ConvertFrom-Json
    $adminToken = $jsonResponse.access_token
    Write-Host "✅ Login successful! Token obtained." -ForegroundColor Green
}
catch {
    Write-Host "❌ Login failed. Check your credentials." -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrEmpty($adminToken)) {
    Write-Host "❌ Failed to get admin token. Exiting..." -ForegroundColor Red
    exit 1
}

# Create a new site
Write-Host "`n🌐 Creating new site..." -ForegroundColor Green
$siteData = @{
    name = "Test Blog"
    wp_url = "https://example-blog.com" # Replace with actual WordPress site for testing
    wp_user = "admin"
    app_password = "abcd efgh ijkl mnop qrst uvwx" # Replace with actual app password
} | ConvertTo-Json

$response = curl -s -X POST "$baseUrl/sites/connect" -H "Content-Type: application/json" -H "Authorization: Bearer $adminToken" -d $siteData
Show-Response -Response $response -Title "CREATE SITE RESPONSE"

# Get the site id from response
try {
    $jsonResponse = $response | ConvertFrom-Json
    $siteId = $jsonResponse.site.id
    Write-Host "✅ Site created with ID: $siteId" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to extract site ID." -ForegroundColor Red
    $siteId = 1  # Fallback to ID 1
}

# Get all sites
Write-Host "`n📋 Getting all sites..." -ForegroundColor Green
$response = curl -s -X GET "$baseUrl/sites" -H "Authorization: Bearer $adminToken"
Show-Response -Response $response -Title "GET ALL SITES RESPONSE"

# Get site by ID
Write-Host "`n🔍 Getting site with ID $siteId..." -ForegroundColor Green
$response = curl -s -X GET "$baseUrl/sites/$siteId" -H "Authorization: Bearer $adminToken"
Show-Response -Response $response -Title "GET SITE BY ID RESPONSE"

# Update site
Write-Host "`n✏️ Updating site with ID $siteId..." -ForegroundColor Green
$updateData = @{
    name = "Updated Test Blog"
} | ConvertTo-Json

$response = curl -s -X PUT "$baseUrl/sites/$siteId" -H "Content-Type: application/json" -H "Authorization: Bearer $adminToken" -d $updateData
Show-Response -Response $response -Title "UPDATE SITE RESPONSE"

# Test connection
Write-Host "`n🔌 Testing connection to site with ID $siteId..." -ForegroundColor Green
$response = curl -s -X POST "$baseUrl/sites/$siteId/test-connection" -H "Authorization: Bearer $adminToken"
Show-Response -Response $response -Title "TEST CONNECTION RESPONSE"

# Delete site (commented out to prevent accidental deletion)
# Uncomment to test deletion
<#
Write-Host "`n🗑️ Deleting site with ID $siteId..." -ForegroundColor Green
$response = curl -s -X DELETE "$baseUrl/sites/$siteId" -H "Authorization: Bearer $adminToken"
if ([string]::IsNullOrEmpty($response)) {
    Write-Host "✅ Site deleted successfully!" -ForegroundColor Green
} else {
    Show-Response -Response $response -Title "DELETE SITE RESPONSE"
}
#>
