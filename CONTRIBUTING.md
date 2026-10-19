# Katkıda bulunmak

Bu site herkesin ekleme yapabilmesi için kuruldu. Her bölüm tek bir Markdown dosyası.

## Yeni bölüm eklemek

1. Repoyu fork'la ya da (yazma iznin varsa) yeni bir dal aç.
2. `src/content/bolumler/` altına bir dosya ekle. Dosya adı sayfanın adresi olur: `docker-ile-yayin.md` → `/docker-ile-yayin.html`. Küçük harf, Türkçe karakter yok, kelimeler arası tire.
3. Dosyanın başına şu bilgileri yaz:

   ```markdown
   ---
   title: Docker ile yayın
   description: Bir cümlelik özet; ana sayfadaki kartta görünür.
   group: Yayın rotaları
   order: 6
   authors: ["Adın"]
   ---

   ## İlk başlık

   Metin...
   ```

   - `group`: `Temeller`, `AWS`, `AI ve CLI`, `Yayın rotaları`, `Kapanış` değerlerinden biri. Yeni bir grup gerekiyorsa `src/content.config.ts` içindeki `GROUPS` listesine ekle.
   - `order`: grup içindeki sıra.
   - Başlıklar `##` ile başlar; sağdaki "Bu bölümde" menüsü bunlardan oluşur.

4. Lokalde bak:

   ```bash
   npm ci
   npm run dev        # http://localhost:4321
   ```

5. PR aç. Birkaç dakika içinde PR'a **Netlify önizleme** linki düşer. Merge edilince site üç yerde birden güncellenir.

## Mevcut bir bölümü düzeltmek

Her sayfanın altında "Bu sayfayı GitHub'da düzenle" bağlantısı var. GitHub tarayıcıda düzenleyip PR açmanı sağlar.

## Yazım önerileri

- Komutlar kopyalanıp çalıştırılabilir olsun; uydurma değil, denenmiş komut.
- Gerçek IP, hesap numarası, anahtar ya da token yazma. Örnek adres gerekirse `203.0.113.10` ya da `ornek.com` kullan.
- Fiyat ve kota gibi değişen bilgilerde kaynağı göster.
- Kısa paragraflar, mümkünse tablo.

## Altyapıya dokunmak

`infra/` ve `.github/workflows/` değişiklikleri PR'da Terraform planı üretir. Plan yorumunda `destroy` görüyorsan merge etmeden önce sor.
