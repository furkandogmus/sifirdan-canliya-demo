---
title: Temizlik
description: Demo bitti, fatura bitmesin. Önce envanter, sonra onay, sonra doğru sırayla silme.
group: Kapanış
order: 2
---

Altyapıyı kodla kurmanın en büyük kazancı burada: kurduğun her şeyi aynı kodla silebilirsin.

## 1. Envanter

Hiçbir şey silmeden önce ne olduğunu listele. Tüm kaynaklar `project` etiketi taşıdığı için tüm region'larda aramak kolay:

```bash
for r in $(aws ec2 describe-regions --query 'Regions[].RegionName' --output text); do
  aws resourcegroupstaggingapi get-resources --region "$r" \
    --tag-filters Key=project,Values=demo \
    --query 'ResourceTagMappingList[].ResourceARN' --output text
done | tr '\t' '\n' | sort -u

netlify sites:list
gh repo list --limit 50
```

## 2. Sıra önemli

```text
1. infra/s3-site   ve  infra/ec2-site    (state'leri bootstrap'in bucket'ında)
2. infra/bootstrap                        (state bucket, OIDC rolleri)
3. Netlify sitesi
4. GitHub reposu                          (değişkenler ve secret'lar da gider)
```

Bootstrap'i önce silersen site katmanlarının state'i gider ve kaynaklar yetim kalır: fatura gelmeye devam eder.

## 3. Silme

Her Terraform katmanında önce silinecek listeyi gör:

```bash
cd infra/ec2-site
terraform init -backend-config="bucket=<state-bucket>" -backend-config="region=eu-central-1"
terraform plan -destroy -out tfplan
terraform apply tfplan
```

Sonra workflow dosyalarını kaldır; yoksa bir sonraki merge her şeyi yeniden kurmaya çalışır.

```bash
netlify sites:delete <site-id> --force
gh auth refresh -h github.com -s delete_repo
gh repo delete <sahip>/<repo> --yes
```

## 4. Kontrol

Envanter komutlarını tekrar çalıştır; boş dönmeli. AWS faturası günlük güncellenir: ertesi gün Billing ekranında harcamanın durduğuna bak.

## Ödev

1. **Kolay:** Kendi tanıtım sayfanı Netlify rotasıyla yayına al.
2. **Orta:** Supabase ile bir ziyaretçi defteri ekle; RLS açık olsun.
3. **Orta:** Kendi domain'ini bağla, HTTPS'i doğrula.
4. **Zor:** AWS rotalarından birini Terraform ile kur, `destroy` et, tekrar kur. Kaç dakika sürüyor?
