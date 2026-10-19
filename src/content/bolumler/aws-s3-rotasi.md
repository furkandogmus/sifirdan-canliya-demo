---
title: "Rota 2: AWS S3 + CloudFront"
description: Sunucusuz AWS. Private bucket, OAC ve CloudFront; Terraform ile kurulur, Actions ile yayınlanır.
group: Yayın rotaları
order: 3
---

## Mimari

```text
Ziyaretçi ─HTTPS→ CloudFront ─(OAC imzalı istek)→ S3 bucket (private)
```

| Parça | Görevi |
|---|---|
| S3 bucket | Dosyalar burada; **public değil** |
| Origin Access Control (OAC) | Bucket'ı sadece CloudFront okuyabilir |
| CloudFront | HTTPS, önbellek, `index.html` kök nesne |
| Bucket policy | Sadece bu CloudFront dağıtımına `s3:GetObject` izni |

Eski rehberlerde "bucket'ı public yap, static website hosting'i aç" denir. Artık önerilen yol bu değil: bucket kapalı, kapı sadece CloudFront'a açık.

## Terraform katmanları

```text
infra/bootstrap   bir kere, lokalde   state bucket, GitHub OIDC, plan ve deploy rolleri
infra/s3-site     GitHub Actions      bucket, OAC, CloudFront, bucket policy
```

State, bootstrap'in kurduğu S3 bucket'ında durur; kilit için Terraform 1.10'un `use_lockfile` özelliği kullanılır, ayrı bir DynamoDB tablosu gerekmez.

```hcl
terraform {
  backend "s3" {
    key          = "s3-site/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
  }
}
```

## Workflow

- **PR:** `terraform fmt -check` → `validate` → `plan` (salt okunur rol) → plan özeti PR'a yorum.
- **main:** `npm run build` → `terraform apply` (deploy rolü) → `aws s3 sync dist/` → CloudFront invalidation.

İlk apply'da CloudFront dağıtımının kurulması 5–10 dakika sürer.

## Alt sayfa tuzağı

CloudFront kök adreste `index.html`'i bulur, ama `/hakkinda/` gibi bir alt klasörde `index.html` aramaz: 403 döner. Bu yüzden bu site sayfaları `hakkinda.html` biçiminde üretiyor (`astro.config.mjs` içinde `build.format: "file"`). Alternatif, bir CloudFront Function ile adresleri yeniden yazmaktır.

## Sık hatalar

| Belirti | Sebep |
|---|---|
| Her yerde 403, ilk dakikalarda | Dağıtım hâlâ kuruluyor |
| Kök adreste 403 | `index.html` yüklenmemiş |
| Eski içerik | Tarayıcı önbelleği; CloudFront'unkini workflow temizler |
| `BucketAlreadyExists` | Bucket adları dünya genelinde tek; şablon `bucket_prefix` ile rastgele ek koyar |
