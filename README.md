# GiuaKi-DienToanDamMay-23IT102

Ung dung quan ly sach cho Le Nhat Huy - lop 23SE2.

## Thong tin bai
- MSSV: `23IT102`
- Database: `DB_23IT102`
- Tien to ma san pham: `102`
- VAT: `7%` (chu so cuoi MSSV 2 + 5)

## Chay local
```bash
npm install
copy .env.example .env
npm run dev
```

Dien cac chuoi ket noi MongoDB that trong `.env`. Khong commit `.env`.

## Deploy Vercel
Project da co `vercel.json`. Tren Vercel, chon repository nay, Build Command de trong mac dinh, Output Directory de trong mac dinh, sau do them cac Environment Variables trong `.env.example`.

## Import du lieu mau
File `data/books-import.json` la du lieu mau cho collection `books`. Khong import vao collection `user`.

```text
DB_23IT102 -> books -> Import JSON -> data/books-import.json
```

Du lieu mau dung tien to `102` va VAT `7%` theo MSSV `23IT102`.

Khong commit `.env`, mat khau MongoDB hoac URI co mat khau.
