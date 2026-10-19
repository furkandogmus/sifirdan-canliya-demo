---
title: AI ajanı ve CLI araç çantası
description: Sohbet botu ile kod ajanının farkı, ajanın elleri olan CLI'lar ve kurulumları.
group: AI ve CLI
order: 1
---

## Komutu kim çalıştırıyor?

| | Sohbet botu | Kod ajanı |
|---|---|---|
| Komut | Sana yazar, sen kopyalarsın | Kendisi çalıştırır, sen onaylarsın |
| Hata | Sen geri yapıştırırsın | Çıktıyı kendisi okur, düzeltir |
| Dosyalar | Görmez | Okur ve yazar |

Kod ajanlarına örnek: Claude Code, Codex CLI, Gemini CLI, Cursor ve VS Code'daki agent modları. Hepsi aynı mantıkla çalışır.

## AI'ın elleri CLI'dır

Web konsolunda tıklamak bir AI için zordur ve tekrarlanamaz. Terminal komutu ise metindir: ajan yazar, çalıştırır, çıktıyı okur. Ve yarın aynı komut aynı sonucu verir.

Bu yüzden konsolda tıklanan her işin CLI karşılığını kullanıyoruz:

| Araç | Ne için |
|---|---|
| `gh` | Repo aç, push et, PR aç, Actions secret ve değişkenleri, workflow izle |
| `aws` | S3, CloudFront, EC2, SSM, fatura sorguları |
| `netlify` | Site oluştur, deploy et, önizleme linki |
| `supabase` | Veritabanı migration'ları, proje bağlama |
| `terraform` | Altyapıyı kodla kur, planla, sil |

## Kurulum (macOS)

```bash
brew install gh awscli supabase/tap/supabase
brew install hashicorp/tap/terraform     # 1.10 veya üstü gerekir
npm install -g netlify-cli
```

Homebrew'un çekirdek deposundaki `terraform` formülü lisans değişikliği yüzünden 1.5.7'de kaldı; `hashicorp/tap` güncel sürümü verir. OpenTofu (`brew install opentofu`) da aynı işi görür.

Windows'ta `winget` ya da WSL ile aynı araçlar kurulur.

## Giriş

```bash
gh auth login
aws configure sso
netlify login
supabase login
```

Girişleri kendin yap. Ajan senin oturumunla çalışır; şifre ya da token'ı sohbete yapıştırma.

## Skill'ler: ajana tarif vermek

Her seferinde "önce şunu kontrol et, sonra bunu kur, şu etiketi unutma" demek yerine bu tarifleri **skill** olarak yazabilirsin. Bu sitenin yayın süreci tamamen [sifirdan-canliya](https://github.com/furkandogmus/sifirdan-canliya) skill'leriyle yapıldı:

```bash
npx skills add furkandogmus/sifirdan-canliya
```

Ajan "siteyi Netlify'da yayınla" dediğinde ilgili skill'i bulur ve adımları sırayla, onayını alarak uygular.
