---
title: "Rota 3: AWS EC2"
description: Sunucu sizin. nginx bir EC2'de, içerik S3'ten, önde CloudFront; SSH yerine SSM.
group: Yayın rotaları
order: 4
---

Statik bir site için S3 rotası daha ucuz ve bakımsızdır. EC2 rotası, bir sunucunun nasıl yönetildiğini öğrenmek ya da sunucuda çalışan bir şey (API, özel nginx ayarı) eklemek için.

## Mimari

```text
Ziyaretçi ─HTTPS→ CloudFront ─HTTP:80→ EC2 (nginx) ←sync─ S3 (private)
                                          ↑ SSM Run Command
                              GitHub Actions (deploy rolü)
```

| Karar | Neden |
|---|---|
| CloudFront önde | Domain olmadan ücretsiz HTTPS ve önbellek |
| 80 portu sadece CloudFront'a açık | Güvenlik grubu AWS'nin `cloudfront.origin-facing` IP listesini kullanır; sunucuya doğrudan erişilemez |
| SSH yok, 22 kapalı | Yönetim SSM ile; anahtar dosyası yok |
| İçerik S3'te | CI dosyayı S3'e koyar, sunucu oradan çeker; sunucu yenilense de içerik kaybolmaz |
| Amazon Linux 2023, IMDSv2 zorunlu, şifreli disk | Güncel ve güvenli varsayılanlar |
| Default VPC | NAT Gateway yok (saatlik ücretlidir) |

## Sunucunun açılışı

Instance ilk açıldığında `user_data` betiği çalışır:

```bash
dnf install -y nginx
systemctl enable --now nginx
aws s3 sync "s3://<bucket>/" /usr/share/nginx/html/ --delete || true
```

## Dağıtım: SSH yerine SSM

Workflow her merge'de:

1. `dist/` klasörünü S3'e yükler.
2. Instance'ın SSM'e kaydolmasını bekler (yeni açılmışsa bir iki dakika).
3. SSM Run Command ile sunucuda şunu çalıştırır:
   ```bash
   cloud-init status --wait
   aws s3 sync s3://<bucket>/ /usr/share/nginx/html/ --delete
   ```
4. CloudFront önbelleğini temizler.

`cloud-init status --wait` önemli: ilk açılışta nginx paketi henüz kuruluyorsa, kurulum varsayılan `index.html`'i bizim dosyamızın üstüne yazabilir.

## Sunucuya bağlanmak

```bash
aws ssm start-session --target <instance-id>
```

Session Manager eklentisi gerekir. SSH anahtarı, açık port, bastion yok.

## Maliyet

`t3.micro`, 8 GB gp3 disk ve public IPv4 adresi saatlik ücretlidir; Free plan kredisi varken krediden düşer. Ayda birkaç dolar eder. Deneme bitince silin.
