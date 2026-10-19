---
title: Domain ve HTTPS
description: Kendi adresini almak, DNS kayıtları ve ücretsiz sertifika - us-east-1 tuzağı dahil.
group: Temeller
order: 3
---

Netlify ve CloudFront sana ücretsiz bir adres verir (`site-adi.netlify.app`, `d123abc.cloudfront.net`). Kendi adını istiyorsan bir domain alırsın.

## Domain nereden alınır?

Türkiye'den en kolayı yerli bir kayıt firması (ör. turkticaret.net): TL ile ödenir, bir `.com` ilk yıl 100 ₺ civarından başlar. Sepette iki şeye bak:

- **Yenileme ücreti:** ilk yıl kampanyalı olabilir, ikinci yıl farklıdır.
- **Ek paketler:** hosting, e-posta paketi, SSL sertifikası gerekmez; bu kurulumda hepsi ücretsiz var.

Bu sitedeki her şey içinde tek gerçek masraf domain'dir; o da isteğe bağlı.

## DNS'i Cloudflare'de yönet

Domain kayıt firmasında kalır, DNS kayıtları ücretsiz **Cloudflare**'de tutulur: API'si var, kök domain'de CNAME desteği var ve Turnstile, Worker gibi sonraki adımlar zaten Cloudflare'de.

1. Cloudflare › **Onboard a domain** › Free plan.
2. Cloudflare'in verdiği iki nameserver'ı kayıt firmasının panelinde "DNS sunucuları" alanına yaz.
3. Aktif olması 24 saate kadar sürebilir: `dig +short NS alanadi.com`

## DNS kayıtları

| Kayıt | Ne yapar | Örnek |
|---|---|---|
| `A` / `AAAA` | İsmi bir IPv4 / IPv6 adresine bağlar | `ornek.com → 203.0.113.10` |
| `CNAME` | İsmi başka bir isme yönlendirir | `www.ornek.com → site-adi.netlify.app` |
| `ALIAS` / `ANAME` | Kök domain için CNAME benzeri (sağlayıcıya özel) | `ornek.com → d123abc.cloudfront.net` |
| `TXT` | Doğrulama, e-posta ayarları | Sertifika ya da Google doğrulaması |

Kök domain (`ornek.com`) standart olarak CNAME alamaz; bu yüzden sağlayıcılar ALIAS gibi özel kayıtlar sunar.

## HTTPS sertifikası

**Netlify:** kök domain için `CNAME @ → apex-loadbalancer.netlify.com`, `www` için `CNAME www → <site>.netlify.app` (Cloudflare'de "DNS only"). Netlify kaydı görünce Let's Encrypt sertifikasını kendisi alır ve yeniler.

**AWS:** ACM sertifikaları ücretsizdir. Ama CloudFront'ta kullanılacak sertifika **mutlaka `us-east-1` (Kuzey Virginia) region'ında** açılmalıdır. Sertifikayı Frankfurt'ta açarsan CloudFront onu listede göstermez. Terraform'da bu, ayrı bir provider takma adıyla yapılır:

```hcl
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = "ornek.com"
  validation_method = "DNS"
}
```

## Yayılmayı kontrol etmek

```bash
dig +short ornek.com
dig +short www.ornek.com CNAME
curl -sI https://ornek.com | head -1
```

Farklı DNS sunucularından bakmak için `dig @1.1.1.1 ornek.com` ve `dig @8.8.8.8 ornek.com` kullanılabilir.
