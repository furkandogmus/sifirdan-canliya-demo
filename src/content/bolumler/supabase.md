---
title: Supabase ile dinamik parça
description: Statik siteye sunucu yazmadan veritabanı eklemek - migration, Row Level Security ve anahtarlar.
group: Yayın rotaları
order: 5
---

Supabase; Postgres veritabanı, kimlik doğrulama, dosya depolama ve otomatik bir REST API'yi hazır verir. Statik bir sayfa, tarayıcıdan doğrudan veritabanına yazıp okuyabilir.

## Migration: veritabanı değişikliği de kod

```bash
supabase init
supabase link --project-ref <ref>
supabase migration new ziyaretci_defteri
```

`supabase/migrations/<zaman>_ziyaretci_defteri.sql`:

```sql
create table public.mesajlar (
  id bigint generated always as identity primary key,
  isim text not null check (char_length(isim) between 1 and 60),
  mesaj text not null check (char_length(mesaj) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.mesajlar enable row level security;

create policy "herkes okuyabilir" on public.mesajlar
  for select to anon, authenticated using (true);

create policy "herkes ekleyebilir" on public.mesajlar
  for insert to anon, authenticated with check (true);
```

Migration'lar da CI'dan uygulanır: PR'da `supabase db push --dry-run`, `main`'de `supabase db push`.

## Anahtar herkeste, kural veritabanında

| Anahtar | Nerede | Neden |
|---|---|---|
| Publishable / anon | Tarayıcı kodunda, açıkça | Herkes görebilir; ne yapabileceğini RLS belirler |
| Secret / service_role | Sadece sunucu tarafında | RLS'i atlar; tarayıcıya girerse herkes her şeyi silebilir |

Yeni başlayanların en sık hatası: RLS'i kapalı bırakmak ya da `service_role` anahtarını frontend'e koymak.

## Tarayıcıdan kullanmak

```html
<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
  const supabase = createClient("https://<ref>.supabase.co", "<publishable-key>");

  const { data } = await supabase.from("mesajlar")
    .select("isim, mesaj, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  await supabase.from("mesajlar").insert({ isim: "Ayşe", mesaj: "Merhaba!" });
</script>
```

Gelen mesajları sayfaya `textContent` ile yaz, `innerHTML` ile değil: kullanıcının yazdığı metin HTML olarak çalışmasın.

## RLS'i test et

Anonim anahtarla silmeyi dene; `[]` dönmeli:

```bash
curl -s -X DELETE "https://<ref>.supabase.co/rest/v1/mesajlar?id=gt.0" \
  -H "apikey: <anon-key>" -H "Authorization: Bearer <anon-key>" \
  -H "Prefer: return=representation"
```

Ücretsiz planda bir hafta kullanılmayan proje duraklatılır; panelden tek tıkla açılır.
