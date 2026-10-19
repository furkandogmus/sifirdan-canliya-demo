---
title: "Rota 1: Netlify"
description: En hızlı yol. Site Netlify'da, yönetimi GitHub Actions'ta - PR'da önizleme, merge'de production.
group: Yayın rotaları
order: 2
---

## Neden Netlify?

DNS, CDN, HTTPS ve önbellek temizliği tek komutta gelir. Sunucu yok, Terraform yok. 3 dakikada canlıya çıkmak için en kısa yol.

## Neden deploy'u Netlify değil GitHub Actions yapıyor?

Netlify repoya doğrudan bağlanıp kendisi de build edebilir. Biz bunu kapalı tutuyoruz: deploy'u GitHub Actions yapıyor. Böylece Netlify, S3 ve EC2 rotaları **aynı yerde, aynı akışla** görünüyor; secret'lar tek yerde duruyor; hangi commit'in nereye çıktığı Actions geçmişinde yazıyor.

## İlk kurulum

```bash
npm run build
netlify deploy --prod --dir dist --no-build --site-name <benzersiz-ad> --json | jq '{site_id, url}'
```

Bu komut siteyi oluşturur, klasöre bağlar ve ilk kez yayınlar. `site_id` GitHub'a değişken olarak girer:

```bash
gh variable set NETLIFY_SITE_ID --body "<site_id>"
gh secret set NETLIFY_AUTH_TOKEN      # Netlify › User settings › Applications › Personal access tokens
```

## Workflow

`.github/workflows/netlify.yml` iki iş yapar:

```yaml
- name: Önizleme (PR)
  if: github.event_name == 'pull_request'
  run: netlify deploy --dir "$PUBLISH_DIR" --no-build --alias "pr-<numara>" --json

- name: Production
  if: github.ref == 'refs/heads/main'
  run: netlify deploy --prod --dir "$PUBLISH_DIR" --no-build
```

PR'da her push yeni bir önizleme üretir ve PR'daki "Netlify önizleme" yorumu güncellenir. Önizleme adresi `pr-<numara>--<site-adı>.netlify.app` biçimindedir; birisi yeni bir bölüm yazdığında, merge etmeden önce nasıl göründüğünü herkes görebilir.

## Silmek

```bash
netlify sites:delete <site-id> --force
```
