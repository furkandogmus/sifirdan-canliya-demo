---
title: AWS Free Tier
description: Hesap nasıl açılır, Free plan ve süresiz ücretsiz kotalar neyi kapsar?
group: AWS
order: 1
---

> Rakamlar ve şartlar değişebilir. Hesap açmadan önce [aws.amazon.com/free](https://aws.amazon.com/free) sayfasındaki güncel bilgilere bakın.

## Hesap açmak

1. [aws.amazon.com/free](https://aws.amazon.com/free) üzerinden hesap oluştur.
2. Kart bilgisi ve telefon doğrulaması iste: kartından doğrulama için küçük bir provizyon çekilip iade edilir.
3. **Free plan**'ı seç.
4. Root kullanıcıya hemen MFA ekle (bir sonraki bölüm).
5. Günlük iş için ayrı bir kullanıcı aç; root ile çalışma.

## Free plan ve kredi modeli

2025 ortasından beri yeni hesaplar kredi modeliyle başlıyor: kayıtta kredi veriliyor, bazı başlangıç görevlerini tamamlayınca ek kredi geliyor. Free plan belirli bir süre (6 ay) ya da kredi bitene kadar sürüyor. Bu sürede kart ücretlendirilmez. Süre sonunda Paid plan'a geçmezsen hesap kapanır.

Free plan'da bazı pahalı servisler kapalıdır; yeni başlayanı yanlışlıkla büyük fatura çıkarmaktan korur.

## Süresiz ücretsiz kotalar (Always Free)

Bu kotalar hesap yaşından bağımsızdır ve her ay yenilenir:

| Servis | Her ay ücretsiz |
|---|---|
| CloudFront | 1 TB veri çıkışı, 10 milyon istek |
| Lambda | 1 milyon istek, 400.000 GB-saniye |
| DynamoDB | 25 GB depolama |
| CloudWatch | 10 alarm, 10 özel metrik |

Kişisel bir statik site için CloudFront kotası pratikte hiç dolmaz.

## Bu sitenin AWS maliyeti

| Kalem | Yaklaşık |
|---|---|
| S3 + CloudFront, düşük trafik | Çoğu ay 0, en fazla birkaç sent |
| EC2 `t3.micro` + 8 GB disk + public IPv4 | Ayda birkaç dolar (kredi varken krediden düşer) |
| Terraform state bucket'ı | Kuruşlar |

EC2 rotası sunucu kiraladığı için ücretlidir; deneme bitince silmek gerekir. Temizlik bölümüne bakın.
