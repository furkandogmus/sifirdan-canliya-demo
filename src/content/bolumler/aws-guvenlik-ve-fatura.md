---
title: Güvenli giriş ve sürpriz fatura
description: Root'u kasaya koy, SSO ile çalış, bütçe alarmını AI'dan önce kur.
group: AWS
order: 2
---

## Root tapudur, kasada durur

AWS hesabını açtığın e-posta adresi **root kullanıcıdır**: her şeyi yapabilir, hesabı kapatabilir, ödeme yöntemini değiştirebilir. Bu yüzden:

- Root'a **MFA** ekle (IAM › Security credentials).
- Root için **access key oluşturma**.
- Root ile sadece faturalama ve acil durum işleri yap.

## Günlük kullanıcı: IAM Identity Center

IAM Identity Center ile bir kullanıcı açıp ona hesap üzerinde yetki verirsin. Terminalden girişte kalıcı anahtar yerine **birkaç saatte kendiliğinden düşen geçici oturum** kullanılır.

```bash
aws configure sso                  # bir kere: profil adı "demo", region eu-central-1
aws sso login --profile demo       # her gün
export AWS_PROFILE=demo
aws sts get-caller-identity        # kim olarak bağlıyım?
```

AI ajanı senin oturumunla çalışacağı için bu önemli: bir şey sızsa bile birkaç saat içinde geçersiz olur. `get-caller-identity` çıktısında `:root` görüyorsan dur.

## Bütçe alarmı: ilk kuruşta haber ver

Kaynak kurmadan önce bir bütçe alarmı kur. Konsolda Billing › Budgets › "Zero spend budget" şablonu en kolayı. CLI ile:

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws budgets create-budget --account-id "$ACCOUNT_ID" \
  --budget '{"BudgetName":"sifir-harcama","BudgetLimit":{"Amount":"1","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \
  --notifications-with-subscribers '[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":1,"ThresholdType":"PERCENTAGE"},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"sen@ornek.com"}]}]'
```

Ayrıca Billing › Billing preferences › **Free Tier usage alerts** seçeneğini aç: kota dolmaya yaklaşınca e-posta gelir.

## Sessiz faturacılar

Yeni başlayanları en çok bunlar yakar:

| Kaynak | Neden |
|---|---|
| NAT Gateway | Saatlik ücret, tek başına ayda 30 doları geçer |
| Public IPv4 adresi | 2024'ten beri saatlik ücretli, boştaki Elastic IP dahil |
| RDS | Kapatılmayan veritabanı saat saat yazar |
| EBS disk ve snapshot | Instance silinse bile kalabilir |
| Başka region | Konsolda region değişince kaynaklar "kaybolur" ama çalışmaya devam eder |

## Bu ay ne kadar harcadım?

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-10-01,End=2026-10-31 \
  --granularity MONTHLY --metrics UnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

Cost Explorer API'si istek başına 0,01 USD alır; bir iki sorgu sorun değil, ama AI'a döngüde sorgu attırma.

## Anahtarı git'e koyma

Public bir repoya düşen AWS anahtarı dakikalar içinde botlar tarafından bulunur ve genelde kripto madenciliği için kullanılır. `.env` dosyalarını `.gitignore`'a ekle, CI'da kalıcı anahtar yerine OIDC kullan (CI/CD bölümü).
