---
title: E-posta gönderen iletişim formu
description: Cloudflare Worker, Turnstile ve Resend ile sunucusuz form - kendi domain'inden, ücretsiz katmanda.
group: Yayın rotaları
order: 6
---

Statik bir sitede form göndermek için küçük bir sunucusuz parça gerekir: e-posta servisinin API anahtarı tarayıcıya konamaz, herkes görür.

## Mimari

```text
Ziyaretçi ─form→ Cloudflare Worker ─doğrula→ Turnstile
                        └──────────gönder→ Resend ─→ senin e-postan
```

| Parça | Görevi | Ücretsiz |
|---|---|---|
| Cloudflare Worker | Formu alır, kontrol eder, anahtarları saklar | Günde 100.000 istek |
| Turnstile | Robot koruması, CAPTCHA'sız | Sınırsız doğrulama |
| Resend | E-postayı senin domain'inden gönderir | Günde 100, ayda 3.000 |

Tek şart kendi domain'in: Resend, domain doğrulanmadan sadece hesap sahibinin adresine gönderir.

## Worker ne kontrol ediyor?

- **Köken:** istek sadece sitenin kendi adreslerinden gelebilir; başka bir siteden gelen istek 403 alır.
- **Alanlar:** ad ve mesaj zorunlu, uzunluklar sınırlı, e-posta biçimi doğru olmalı.
- **Turnstile:** token'ı Cloudflare'e sorar; robotsa 400.
- **Resend:** e-postayı gönderir, "Yanıtla" ziyaretçinin adresine gider.

Anahtarlar Worker'ın sırrı olarak durur, koda ve repoya girmez:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```

## Hesap açmadan test

Cloudflare'in resmî Turnstile test anahtarları sayesinde Worker lokalde denenebilir:

```bash
# worker/.dev.vars
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
RESEND_API_KEY=re_sahte_anahtar
```

```bash
npx wrangler dev --port 8787 &
curl -X POST http://127.0.0.1:8787/ -H 'Origin: http://localhost:4321' \
  -F isim=Test -F mesaj=deneme -F cf-turnstile-response=XXXX.DUMMY.TOKEN.XXXX
```

Cevap "E-posta gönderilemedi", Worker logunda `Resend hatası 401`: istek Turnstile'dan geçti, Resend'e ulaştı, sahte anahtar reddedildi. Gerçek anahtarla e-posta gider.

## Yayın

Worker da site gibi GitHub Actions ile yayınlanır: PR'da `wrangler deploy --dry-run`, `main`'de `wrangler deploy`. Kurulumun tamamı [sifirdan-canliya](https://github.com/furkandogmus/sifirdan-canliya) reposundaki `iletisim-formu` skill'inde.
