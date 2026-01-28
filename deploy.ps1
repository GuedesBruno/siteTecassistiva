# deploy.ps1
Write-Host "🚀 Iniciando processo de preparação para Deploy..." -ForegroundColor Cyan

# 1. Limpeza
if (Test-Path "out") { Remove-Item "out" -Recurse -Force }
if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }

# 2. Build
Write-Host "📦 Gerando build de produção..." -ForegroundColor Yellow
$build = Start-Process -FilePath "npm" -ArgumentList "run build" -Wait -PassThru -NoNewWindow
if ($build.ExitCode -ne 0) {
    Write-Host "❌ Erro no Build! Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído com SUCESSO!" -ForegroundColor Green

# 3. Instruções de Deploy
Write-Host "`n🚀 PARA FAZER O DEPLOY REAL (GITHUB ACTIONS):" -ForegroundColor Cyan
Write-Host "Execute os seguintes comandos:" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor Yellow
Write-Host "  git commit -m `"Deploy: Atualizações de SEO e Correções`"" -ForegroundColor Yellow
Write-Host "  git push origin main" -ForegroundColor Yellow
