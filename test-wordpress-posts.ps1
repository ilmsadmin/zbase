#!/usr/bin/env pwsh

# Test script for WordPress post integration
# This script will:
# 1. Connect to a WordPress site
# 2. Sync posts from the site
# 3. Create a new test post
# 4. Push the test post to WordPress
# 5. Update the test post
# 6. Delete the test post

$ErrorActionPreference = "Stop"

# Configuration
$baseUrl = "http://localhost:3000"
$email = "admin@example.com"
$password = "adminpassword"
$token = ""

# Colors for better output
$Green = @{ForegroundColor = "Green"}
$Yellow = @{ForegroundColor = "Yellow"}
$Red = @{ForegroundColor = "Red"}
$Cyan = @{ForegroundColor = "Cyan"}

function Write-Step {
    param($message)
    Write-Host "==> $message" @Green
}

function Write-SubStep {
    param($message)
    Write-Host "  -> $message" @Cyan
}

function Write-Error {
    param($message)
    Write-Host "ERROR: $message" @Red
}

function Write-Warning {
    param($message)
    Write-Host "WARNING: $message" @Yellow
}

# Login and get token
try {
    Write-Step "Logging in as admin"
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body @{
        "email" = $email
        "password" = $password
    } -ContentType "application/json" -ErrorAction Stop
    
    $token = $loginResponse.access_token
    Write-SubStep "Login successful, token obtained"
} catch {
    Write-Error "Failed to login: $_"
    exit 1
}

# Check available sites
try {
    Write-Step "Getting list of sites"
    $sitesResponse = Invoke-RestMethod -Uri "$baseUrl/sites" -Method Get -Headers @{
        "Authorization" = "Bearer $token"
    } -ErrorAction Stop
    
    $sites = $sitesResponse.items
    
    if($sites.Count -eq 0) {
        Write-Warning "No sites found. Please add a WordPress site before running this test."
        exit 0
    }
    
    Write-SubStep "Found $($sites.Count) sites"
    foreach($site in $sites) {
        Write-Host "    * $($site.name) ($($site.wp_url)) - ID: $($site.id)"
    }
    
    # Select the first active site
    $selectedSite = $sites | Where-Object { $_.active -eq $true } | Select-Object -First 1
    
    if($null -eq $selectedSite) {
        Write-Warning "No active sites found."
        exit 0
    }
    
    Write-SubStep "Selected site: $($selectedSite.name) (ID: $($selectedSite.id))"
} catch {
    Write-Error "Failed to get sites: $_"
    exit 1
}

# Sync posts from the selected site
try {
    Write-Step "Syncing posts from site $($selectedSite.id)"
    $syncResponse = Invoke-RestMethod -Uri "$baseUrl/posts/sync" -Method Post -Headers @{
        "Authorization" = "Bearer $token"
    } -Body "[$($selectedSite.id)]" -ContentType "application/json" -ErrorAction Stop
    
    if($syncResponse.success) {
        Write-SubStep "Sync successful!"
        Write-SubStep "Added: $($syncResponse.added), Updated: $($syncResponse.updated)"
    } else {
        Write-Warning "Sync reported failure: $($syncResponse | ConvertTo-Json -Depth 3)"
    }
} catch {
    Write-Error "Failed to sync posts: $_"
}

# Create a new test post
try {
    Write-Step "Creating a test post"
    $newPost = @{
        title = "Test Post $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        slug = "test-post-$(Get-Random)"
        content = "<p>This is a test post created by the WordPress integration test script.</p>"
        excerpt = "Test post for WordPress integration."
        status = "draft"
        siteId = $selectedSite.id
    }
    
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/posts" -Method Post -Headers @{
        "Authorization" = "Bearer $token"
    } -Body ($newPost | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop
    
    $testPostId = $createResponse.id
    Write-SubStep "Created test post with ID: $testPostId"
} catch {
    Write-Error "Failed to create test post: $_"
}

# Push the test post to WordPress
try {
    Write-Step "Pushing test post to WordPress"
    $pushResponse = Invoke-RestMethod -Uri "$baseUrl/posts/push" -Method Post -Headers @{
        "Authorization" = "Bearer $token"
    } -Body "[$testPostId]" -ContentType "application/json" -ErrorAction Stop
    
    if($pushResponse.success) {
        Write-SubStep "Push successful! Posts pushed: $($pushResponse.pushed)"
    } else {
        Write-Warning "Push reported failure: $($pushResponse | ConvertTo-Json -Depth 3)"
    }
} catch {
    Write-Error "Failed to push post: $_"
}

# Update the test post
try {
    Write-Step "Updating test post"
    $updatePost = @{
        title = "Updated Test Post $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        content = "<p>This post has been updated by the test script.</p>"
    }
    
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/posts/$testPostId" -Method Put -Headers @{
        "Authorization" = "Bearer $token"
    } -Body ($updatePost | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop
    
    Write-SubStep "Updated test post"
} catch {
    Write-Error "Failed to update test post: $_"
}

# Wait a moment before deleting
Start-Sleep -Seconds 3

# Delete the test post
try {
    Write-Step "Deleting test post"
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/posts/$testPostId" -Method Delete -Headers @{
        "Authorization" = "Bearer $token"
    } -ErrorAction Stop
    
    Write-SubStep "Deleted test post"
} catch {
    Write-Error "Failed to delete test post: $_"
}

Write-Host ""
Write-Step "Test completed successfully!"
