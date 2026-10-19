---
title: "3 dakikada canlı: demo"
description: Eğitimin kapanışındaki deneme - boş bir klasörden canlı adrese, tek prompt'la.
group: Kapanış
order: 0
authors: ["Furkan"]
---

Eğitimin sonunda bir kronometre açıp boş bir klasörden canlı bir siteye gidiyoruz.

## Hazırlık

- `gh` ve `netlify` girişleri önceden yapılmış (`gh auth status`, `netlify status`).
- Boş bir klasör, terminal fontu büyük, bildirimler kapalı.
- Skill'ler kurulu: `npx skills add furkandogmus/sifirdan-canliya`

## Prompt

```text
Bu klasörde tek sayfalık, mobil uyumlu bir kişisel tanıtım sitesi yap.
GitHub'da public bir repo aç, Netlify'da yayınla ve GitHub Actions ile
PR'da önizleme, main'de production olacak şekilde bağla.
Sonunda canlı adresi ve repo adresini ver.
```

## Zaman çizelgesi

| Dakika | Ne oluyor |
|---|---|
| 0:00 | Prompt |
| 0:30 | Ajan sayfayı ve stili yazar |
| 1:30 | `gh repo create --push` |
| 2:15 | `netlify deploy --prod` |
| 3:00 | Canlı adres sohbete yapıştırılır |

Süre aşılırsa sorun değil: hata çıkarsa ajanın çıktıyı okuyup kendini düzeltmesini izlemek de dersin parçası.

## Bu sayfanın kendisi

Bu bölüm, sitenin katkı akışını denemek için bir PR ile eklendi: dal → PR → Netlify önizleme linki → merge → Netlify, S3 ve EC2'de aynı anda yayın.
