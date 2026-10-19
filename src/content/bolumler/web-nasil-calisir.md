---
title: Bir site ekrana nasıl gelir?
description: Adres çubuğundan ekrana giden beş durak - DNS, CDN, origin ve HTTPS.
group: Temeller
order: 1
---

Tarayıcıya `ornek.com` yazıp Enter'a bastığında arka planda beş şey olur. Bu beş parçayı tanıyınca, ileride karşılaşacağın hataların çoğunun hangi durakta olduğunu tahmin edebilirsin.

## 1. Tarayıcı

Tarayıcı önce adresi parçalar: protokol (`https`), alan adı (`ornek.com`), yol (`/hakkinda.html`). Sonra bu alan adının hangi makinede durduğunu bulması gerekir.

## 2. DNS: internetin rehberi

DNS, isimleri adreslere çevirir. Tarayıcı "ornek.com nerede?" diye sorar, DNS bir IP adresi ya da başka bir isim döner.

Terminalde kendin dene:

```bash
dig +short ornek.com
nslookup ornek.com
```

DNS cevapları önbelleğe alınır. Bir kaydı değiştirdiğinde yeni değerin herkese ulaşması birkaç dakikadan birkaç saate kadar sürebilir. "Domain'i bağladım ama açılmıyor" şikâyetinin çoğu budur.

## 3. CDN: sana en yakın kopya

CDN (Content Delivery Network), dünyanın her yerine dağılmış sunuculardır. Dosyanın bir kopyasını saklar ve ziyaretçiye en yakın noktadan verir. İstanbul'daki ziyaretçi Frankfurt'taki asıl sunucuya gitmez; İstanbul'daki kenar sunucudan alır.

CloudFront ve Netlify'ın kendi ağı birer CDN'dir. Bir cevabın önbellekten gelip gelmediğini başlıklardan görebilirsin:

```bash
curl -sI https://ornek.com | grep -i -E 'x-cache|age|cache-control'
```

`x-cache: Hit from cloudfront` önbellekten geldiğini gösterir.

## 4. Origin: dosyaların asıl evi

CDN'in önbelleğinde yoksa dosya asıl kaynaktan (origin) istenir. Bu sitede origin üç farklı şey olabiliyor: Netlify'ın depolaması, bir S3 bucket'ı ya da bir EC2 sunucusu. Ziyaretçi için fark yoktur; aynı HTML gelir.

## 5. HTTPS: kilit simgesi

HTTPS, tarayıcı ile sunucu arasındaki trafiği şifreler. Bunun için bir **TLS sertifikası** gerekir. Eskiden parayla alınırdı; bugün ücretsiz:

- Netlify, Let's Encrypt sertifikasını otomatik alır ve yeniler.
- AWS'de ACM (Certificate Manager) sertifikaları ücretsizdir.

## Özet

| Durak | Görevi | Bu sitede |
|---|---|---|
| DNS | İsmi adrese çevirir | Netlify / CloudFront alan adları |
| CDN | En yakından ve önbellekten verir | Netlify CDN, CloudFront |
| Origin | Dosyanın asıl yeri | Netlify, S3, EC2 |
| HTTPS | Şifreli bağlantı | Let's Encrypt, CloudFront sertifikası |
