---
title: GitHub ve CI/CD
description: Her değişiklik PR'dan geçer, PR'da önizleme ve plan görülür, merge edilince otomatik yayınlanır.
group: Yayın rotaları
order: 1
---

Bu sitenin üç rotası da aynı akışla yönetiliyor. Kimse kendi bilgisayarından production'a bir şey göndermiyor; her şeyi GitHub Actions yapıyor.

## Akış

```text
dal aç → değişiklik → PR
  ├─ netlify   : önizleme linki PR'a yorum olarak düşer
  ├─ aws-s3    : terraform plan PR'a yorum olarak düşer
  └─ aws-ec2   : terraform plan PR'a yorum olarak düşer
merge → main
  ├─ netlify   : production deploy
  ├─ aws-s3    : terraform apply → S3'e yükle → CloudFront önbelleğini temizle
  └─ aws-ec2   : terraform apply → S3'e yükle → SSM ile sunucuya dağıt → önbellek temizle
```

Günlük kullanım:

```bash
git checkout -b yeni-bolum
# değişiklik
git commit -am "yeni bölüm: ..." && git push -u origin yeni-bolum
gh pr create --fill
gh pr checks --watch
gh pr merge --squash --delete-branch
gh run watch
```

## main'i korumak

`main` dalı korumalı: doğrudan push yerine PR zorunlu. Böylece önizleme ve plan her zaman görülür.

```bash
gh api -X PUT "repos/{owner}/{repo}/branches/main/protection" --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null
}
EOF
```

## Secret mı, değişken mi?

| Tür | Ne için | Örnek |
|---|---|---|
| Değişken (`vars.X`) | Gizli olmayan ayarlar | Netlify site ID, rol ARN'i, region |
| Secret (`secrets.X`) | Token ve şifreler | `NETLIFY_AUTH_TOKEN` |

```bash
gh variable set NETLIFY_SITE_ID --body "..."
gh secret set NETLIFY_AUTH_TOKEN       # değeri istemde sen girersin
```

## AWS'ye anahtarsız giriş: OIDC

Eski yöntem AWS access key'ini GitHub secret'ına koymaktı; sızarsa süresiz geçerliydi. Bu sitede kalıcı AWS anahtarı yok:

1. AWS hesabında GitHub bir **kimlik sağlayıcı** (OIDC provider) olarak tanımlı.
2. İki rol var: PR'larda kullanılan **salt okunur plan rolü** ve sadece `main` dalına güvenen **deploy rolü**.
3. Workflow çalışınca GitHub kısa ömürlü bir kimlik belgesi üretir, AWS bunu doğrulayıp birkaç saatlik yetki verir.

```yaml
permissions:
  id-token: write
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
      aws-region: ${{ vars.AWS_REGION }}
```

Bu temel bir kere, lokalde Terraform ile kurulur (`infra/bootstrap`); sonrasında AWS'ye sadece GitHub Actions yazar.

## Kırmızı workflow

```bash
gh run list --limit 5
gh run view <run-id> --log-failed
```

Çıktıyı ajana göster; `Could not assume role` gibi hataların sebebi genelde rolün güvendiği repo ya da dal adıdır.
