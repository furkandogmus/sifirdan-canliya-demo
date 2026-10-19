---
title: Domain ve HTTPS
description: Kendi adresini almak, DNS kayıtları ve ücretsiz sertifika - us-east-1 tuzağı dahil.
group: Temeller
order: 3
---

Netlify ve CloudFront sana ücretsiz bir adres verir (`site-adi.netlify.app`, `d123abc.cloudfront.net`). Kendi adını istiyorsan bir domain alırsın.

## Domain nereden alınır?

- **Cloudflare Registrar:** domain'i maliyetine satar, yenilemede sürpriz zam yoktur.
- **Namecheap, Porkbun:** yaygın, kolay.
- **Route 53:** AWS içinde; hosted zone ayda yaklaşık 0,50 USD ayrıca ücretlendirilir.
- **.com.tr:** yetkili kayıt firmalarından alınır.

Bir `.com` genelde yılda 10–15 USD civarıdır. Bu sitedeki her şey içinde tek gerçek masraf budur.

## DNS kayıtları

| Kayıt | Ne yapar | Örnek |
|---|---|---|
| `A` / `AAAA` | İsmi bir IPv4 / IPv6 adresine bağlar | `ornek.com → 203.0.113.10` |
| `CNAME` | İsmi başka bir isme yönlendirir | `www.ornek.com → site-adi.netlify.app` |
| `ALIAS` / `ANAME` | Kök domain için CNAME benzeri (sağlayıcıya özel) | `ornek.com → d123abc.cloudfront.net` |
| `TXT` | Doğrulama, e-posta ayarları | Sertifika ya da Google doğrulaması |

Kök domain (`ornek.com`) standart olarak CNAME alamaz; bu yüzden sağlayıcılar ALIAS gibi özel kayıtlar sunar.

## HTTPS sertifikası

**Netlify:** domain'i panelden ekleyip DNS kaydını yönlendirdiğinde sertifikayı Let's Encrypt'ten kendisi alır ve yeniler.

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
