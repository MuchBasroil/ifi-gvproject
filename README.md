# IFI website, siap deploy ke Vercel

Situs statis, tanpa build step.

## Deploy
1. Unduh dan ekstrak folder ini.
2. Pilih salah satu:
   - **Vercel CLI:** `npm i -g vercel`, lalu jalankan `vercel` di dalam folder ini. Untuk produksi: `vercel --prod`.
   - **Dashboard:** buat repo GitHub berisi folder ini, lalu Import Project di vercel.com. Framework preset: **Other**. Build command dan output directory dikosongkan.
3. Halaman utama `/` otomatis membuka homepage.

## Isi
- `index.html` mengarahkan ke `IFI Homepage v2.dc.html`
- Halaman: Tentang IFI, Membership, Festival, Festival Detail, Industry Hub, Listing Detail, Daftar Listing, Investor, Legal
- Komponen bersama: IFI Navbar, IFI Footer, IFI Closing CTA
- `support.js` runtime halaman, `assets/` gambar
