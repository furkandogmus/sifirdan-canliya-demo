---
title: Sunucusuz iletişim formu
description: Netlify Forms ile kodsuz, ücretsiz form; aynı form S3 ve EC2'deki kopyalarda da çalışır. E-posta bildirimi ve Resend seçeneği.
group: Yayın rotaları
order: 6
---

Bu sitenin [iletişim sayfası](/iletisim.html) hiç sunucu kodu içermiyor. Gönderimleri Netlify Forms topluyor ve ücretsiz planda sınır yok.

## Nasıl çalışıyor?

```html
<form name="iletisim" method="POST" action="/tesekkurler.html"
      data-netlify="true" netlify-honeypot="adres">
  <input type="hidden" name="form-name" value="iletisim" />
  <p hidden><input name="adres" /></p>   <!-- botlar için tuzak -->
  <input name="isim" required />
  <textarea name="mesaj" required></textarea>
  <button>Gönder</button>
</form>
```

1. Netlify yayın sırasında HTML'deki `data-netlify="true"` formunu bulur ve kaydeder.
2. Ziyaretçi gönderince istek Netlify'a gider, gönderim panelde görünür.
3. Netlify formu sadece `/` ile başlayan **göreli** bir `action` ile tanır; tam adres yazılırsa form kaydedilmez. S3 ve EC2'deki kopyalar için sayfadaki küçük bir betik, site Netlify'da değilse `action`'ı Netlify adresine çevirir: üç sitede tek form.

```html
<script>
  if (location.origin !== "https://sifirdan-canliya.netlify.app") {
    document.querySelector('form[name="iletisim"]').action =
      "https://sifirdan-canliya.netlify.app/tesekkurler.html";
  }
</script>
```

Yeni Netlify sitelerinde form algılama kapalı gelir. Bir kere açılır:

```bash
netlify api updateSite --data '{"site_id":"<site-id>","body":{"processing_settings":{"ignore_html_forms":false}}}'
```

## Spam

- **Gizli tuzak alanı** (`netlify-honeypot`): insanlar görmez, botlar doldurur; dolu gelen gönderim atılır.
- **Netlify'ın spam filtresi**: her gönderimi otomatik süzer.

Daha güçlü koruma için Cloudflare Turnstile kullanılır. Ama Turnstile'ın token'ı sunucuda doğrulanmalıdır; bu da bir fonksiyon demektir (aşağıdaki Resend yolu).

## Bildirim

En kolayı Netlify'ın kendi e-posta bildirimi: site › **Project configuration › Notifications › Emails and webhooks › Form submission notifications**. Domain ya da kod gerekmez.

Gönderimleri terminalden görmek için:

```bash
netlify api listSiteSubmissions --data '{"site_id":"<site-id>"}' | jq '.[] | {created_at, data}'
```

## Kendi e-postanla: Resend

Ziyaretçiye otomatik cevap ya da kendi tasarımın olan bir e-posta istiyorsan Resend kullanılır (ücretsiz: günde 100, ayda 3.000 e-posta). İki şart:

- **Kendi domain'in** gerekir; domain'siz sadece kendi adresine test gönderilebilir.
- API anahtarı **asla tarayıcıya girmez**: form bir fonksiyona (Cloudflare Worker ya da Supabase Edge Function) gider, fonksiyon Turnstile'ı doğrular ve Resend'i çağırır.
