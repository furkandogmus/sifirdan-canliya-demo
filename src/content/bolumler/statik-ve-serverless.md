---
title: Statik site ve serverless
description: Sayfa önceden mi hazır, her istekte mi üretiliyor? Sunucusuz ne demek, ne zaman yeter?
group: Temeller
order: 2
---

## Statik site

Statik sitede sayfalar önceden hazırdır: HTML, CSS, JavaScript ve resim dosyaları. Sunucunun tek işi istenen dosyayı teslim etmektir. Hesaplama, veritabanı sorgusu, oturum yoktur.

Bu yüzden statik siteler:

- **Hızlıdır:** dosya CDN'de hazır bekler.
- **Ucuzdur:** çoğu zaman tamamen ücretsiz barındırılır.
- **Güvenlidir:** sunucuda çalışan kod olmadığı için saldırı yüzeyi çok küçüktür.

Portfolyo, landing page, blog, dokümantasyon, etkinlik sayfası: hepsi statik olabilir. Bu sitenin kendisi de statik.

### "Ama ben Markdown yazıyorum, HTML değil"

Statik site üreticileri (Astro, Hugo, Next.js export, Eleventy) Markdown ve şablonları alıp **build** sırasında HTML'e çevirir. Bu site Astro ile yazıldı: her bölüm `src/content/bolumler/` altında bir `.md` dosyası, `npm run build` hepsini `dist/` klasöründe HTML'e çeviriyor. Yayınlanan şey o klasör.

## Dinamik site

Dinamik sitede sunucu her istekte sayfayı yeniden üretir: kim giriş yapmış, sepette ne var, veritabanında hangi ürünler kalmış. E-ticaret, yönetim paneli, sosyal ağ böyledir. Daha esnektir ama sunucu, veritabanı, ölçekleme ve güvenlik işi de getirir.

## Serverless: sunucusuz değil, sunucusu senin değil

Serverless'ta kod yine bir makinede çalışır; ama o makineyi açan, yamalayan, ölçekleyen sen değilsin. Sen sadece fonksiyonu yazarsın.

| Özellik | Anlamı |
|---|---|
| Kullandıkça öde | İstek yoksa ücret yok. Ayda 50 form gönderimi = 50 çalıştırma |
| Otomatik ölçek | 10 ziyaretçi de 10.000 ziyaretçi de aynı kod |
| Bakım yok | İşletim sistemi, yama, disk sağlayıcıda |
| Cold start | Uzun süre çağrılmayan fonksiyonun ilk cevabı biraz gecikebilir |
| Bağımlılık | Sağlayıcının API'sine göre yazılır, taşımak emek ister |

Örnekler: AWS Lambda, Netlify Functions, Supabase Edge Functions, Cloudflare Workers.

## En güçlü desen: statik + küçük bir dinamik parça

Çoğu kişisel site için ihtiyaç şudur: sayfalar statik, sadece bir iletişim formu ya da ziyaretçi defteri dinamik.

```
Form (statik sayfa) → Function veya Supabase API → Veritabanı → (isteğe bağlı) e-posta
```

Sayfa hızlı ve ucuz kalır; dinamik olan sadece küçük bir parçadır. Supabase bölümünde bunun bir örneğini yapıyoruz.
