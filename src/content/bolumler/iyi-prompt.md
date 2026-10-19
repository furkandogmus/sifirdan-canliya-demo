---
title: İyi prompt ve proje kuralları
description: Hedef, kısıt, onay, çıktı. Kuralları bir kere AGENTS.md'ye yaz, ajan her oturumda okusun.
group: AI ve CLI
order: 2
---

## Dört parça

Altyapı işinde ajanın tahmin etmesini istemezsin. İyi bir prompt dört şey söyler:

| Parça | Soru | Örnek |
|---|---|---|
| Hedef | Ne olacak? | `site/` klasörünü S3 + CloudFront ile yayınla |
| Kısıt | Nasıl olmayacak? | Bucket public olmasın, region eu-central-1, her kaynağa `project=demo` |
| Onay | Nerede durup soracak? | apply etmeden önce planı özetle ve bekle |
| Çıktı | Sonunda ne verecek? | Canlı URL ve silme komutu |

### Zayıf

```text
bana site yap aws'ye koy
```

Region, güvenlik, etiketler, silme yolu: hepsi tahmine kalır.

### Güçlü

```text
site/ klasörünü eu-central-1'de S3 + CloudFront ile yayınlayan Terraform kodu yaz.
Bucket public olmasın, OAC kullan, her kaynağa project=demo etiketi koy.
terraform fmt ve validate çalıştır, planı özetle, apply etmeden onayımı bekle.
Sonunda canlı URL'i ve silme komutunu ver.
```

## Kuralları bir kere yaz: AGENTS.md

Projenin kökündeki `AGENTS.md` (Claude Code için `CLAUDE.md`) ajanın her oturumun başında okuduğu dosyadır. Tekrar eden kuralları buraya yaz:

```markdown
# Proje kuralları
- AWS profili: demo, region: eu-central-1
- Her bulut kaynağına project=demo etiketi
- terraform apply / destroy öncesi planı göster, onay bekle
- Secret'lar .env'de, .env git'e girmez
- Değişiklikler PR ile; main'e doğrudan push yok
```

Dosya repoda durduğu için kurallar kodla birlikte versiyonlanır ve ekipteki herkesin ajanı aynı kurallarla çalışır.

## Ajana direksiyonu verirken

- Denemeler için **ayrı, boş** bir hesap ya da proje kullan.
- **Bütçe alarmı** AI'dan önce kurulur.
- Komutları sen onayla. Otomatik onay modunu önemli şeylerin olduğu bir hesapta açma.
- Silme komutundan önce **neyi sileceğini listelet**.
- Hata mesajını sakla değil, ajana göster: sebebini genelde doğru tahmin eder.
