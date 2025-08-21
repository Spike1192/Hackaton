# Script para agregar PostgreSQL al PATH
Write-Host "🔧 Agregando PostgreSQL al PATH de las variables de entorno..." -ForegroundColor Green

# Ruta de PostgreSQL
$postgresPath = "C:\Program Files\PostgreSQL\17\bin"

# Verificar que la carpeta existe
if (Test-Path $postgresPath) {
    Write-Host "✅ PostgreSQL encontrado en: $postgresPath" -ForegroundColor Green
    
    # Obtener el PATH actual
    $currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    
    # Verificar si PostgreSQL ya está en el PATH
    if ($currentPath -like "*$postgresPath*") {
        Write-Host "ℹ️  PostgreSQL ya está en el PATH" -ForegroundColor Yellow
    } else {
        # Agregar PostgreSQL al PATH del usuario
        $newPath = $currentPath + ";" + $postgresPath
        [System.Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
        
        Write-Host "✅ PostgreSQL agregado al PATH del usuario" -ForegroundColor Green
        Write-Host "📝 Ruta agregada: $postgresPath" -ForegroundColor Cyan
        
        # También agregar al PATH de la sesión actual
        $env:PATH += ";$postgresPath"
        Write-Host "✅ PostgreSQL agregado al PATH de la sesión actual" -ForegroundColor Green
    }
    
    # Verificar que psql funciona
    Write-Host "`n🔍 Verificando instalación..." -ForegroundColor Yellow
    try {
        $version = & "$postgresPath\psql.exe" --version
        Write-Host "✅ $version" -ForegroundColor Green
        Write-Host "🎉 PostgreSQL configurado correctamente!" -ForegroundColor Green
        
        Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
        Write-Host "1. Cierra y abre una nueva terminal" -ForegroundColor White
        Write-Host "2. Ejecuta: psql --version" -ForegroundColor White
        Write-Host "3. Ejecuta: npm run db:check" -ForegroundColor White
        Write-Host "4. Ejecuta: npm run db:setup" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Error al verificar psql: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ PostgreSQL no encontrado en: $postgresPath" -ForegroundColor Red
    Write-Host "💡 Verifica que PostgreSQL esté instalado correctamente" -ForegroundColor Yellow
}

Write-Host "`nPresiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
