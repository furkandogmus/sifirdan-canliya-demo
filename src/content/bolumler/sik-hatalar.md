---
title: Sık hatalar
description: En çok karşılaşılan hata mesajları, sebepleri ve ilk bakılacak komut.
group: Kapanış
order: 1
---

Hata mesajını saklamak yerine ajana göster: sebebini genelde doğru tahmin eder. Aşağıdaki tablo ilk bakılacak yerleri toplar.

## AWS

| Mesaj | Sebep | İlk komut |
|---|---|---|
| `AccessDenied` | Yanlış profil ya da hesap | `aws sts get-caller-identity` |
| `ExpiredToken` | SSO oturumu düştü | `aws sso login --profile demo` |
| `BucketAlreadyExists` | Bucket adları dünya genelinde tek | Ada rastgele ek |
| CloudFront 403 | `index.html` yok, OAC/policy eksik ya da dağıtım kuruluyor | `aws cloudfront get-distribution --id <id> --query Distribution.Status` |
| CloudFront 502/504 (EC2) | nginx çalışmıyor ya da güvenlik grubu engelliyor | SSM oturumunda `systemctl status nginx` |
| Eski sayfa | Önbellek | `aws cloudfront create-invalidation --paths "/*"` |

## Terraform

| Mesaj | Sebep | Çözüm |
|---|---|---|
| `Unsupported argument: use_lockfile` | Terraform 1.10'dan eski | `brew install hashicorp/tap/terraform` |
| `Error acquiring the state lock` | Başka bir apply çalışıyor ya da yarıda kaldı | Diğer çalışmayı bekle; emin değilsen `force-unlock` kullanma, sor |
| `Backend initialization required` | `init` yapılmadı ya da backend değişti | `terraform init -backend-config=...` |

## GitHub Actions

| Mesaj | Sebep | Çözüm |
|---|---|---|
| `Could not assume role with OIDC` | Rol bu repo/dala güvenmiyor ya da `id-token: write` yok | Bootstrap'teki `github_repo` ve workflow `permissions` |
| `Resource not accessible by integration` | PR'a yorum izni yok | `pull-requests: write` |
| Netlify `Unauthorized` | Token yok ya da süresi dolmuş | Yeni token, `gh secret set NETLIFY_AUTH_TOKEN` |
| Fork'tan gelen PR'da secret boş | GitHub fork'lara secret vermez | Beklenen davranış |

## DNS

| Belirti | Sebep | Komut |
|---|---|---|
| Domain açılmıyor | Kayıt henüz yayılmadı | `dig +short ornek.com` |
| Sertifika CloudFront'ta görünmüyor | ACM sertifikası us-east-1'de değil | Sertifikayı us-east-1'de aç |
