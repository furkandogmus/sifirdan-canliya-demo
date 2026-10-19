# Sıfırdan Canlıya

AI ajanı ve CLI araçlarıyla bir websitesini sıfırdan yayına almayı anlatan site. Aynı içerik üç yerde birden yayında; hepsi bu repodan, GitHub Actions ile yönetiliyor.

| Rota | Workflow | Altyapı |
|---|---|---|
| Netlify | `.github/workflows/netlify.yml` | Netlify (CLI ile oluşturuldu) |
| AWS S3 + CloudFront | `.github/workflows/aws-s3.yml` | `infra/s3-site` |
| AWS EC2 + nginx | `.github/workflows/aws-ec2.yml` | `infra/ec2-site` |

`infra/bootstrap` bir kere, lokalde kurulur: Terraform state bucket'ı, GitHub OIDC ve rolleri.

Tamamı [sifirdan-canliya](https://github.com/furkandogmus/sifirdan-canliya) skill'leriyle kuruldu.

## Geliştirme

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # dist/
```

Astro 7 + Tailwind CSS 4. Bölümler `src/content/bolumler/*.md`.

## Katkı

[CONTRIBUTING.md](CONTRIBUTING.md): yeni bölüm bir Markdown dosyası, PR'da önizleme linki gelir.
