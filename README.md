# श्री बांके बिहारी शिक्षा प्रसार समिति — Website

A modern, fully **bilingual** (Hindi default + English toggle), responsive, multi-page website for the NGO **श्री बांके बिहारी शिक्षा प्रसार समिति**, Lalitpur, UP.

Built with pure **HTML + CSS + Vanilla JS** — no build step, no framework. Deploy free to GitHub Pages, Netlify, Cloudflare Pages, etc.

> **Three pillars:** शिक्षा (Free Education — primary) • गौ सेवा • असहाय सेवा

---

## 📁 Folder Structure

```
website/
├── index.html              # Home (Hindi + EN)
├── about.html              # About / Vision / Registrations
├── activities.html         # Education programs + welfare work
├── seva.html               # 🐄 Gau Seva + 🤝 Asahay Seva
├── events.html             # JSON-driven events page
├── gallery.html            # JSON-driven photo gallery
├── documents.html          # Downloadable legal docs
├── donate.html             # UPI QR + bank + cheque + CSR
├── contact.html            # Contact form + map
│
├── css/style.css           # All styles
├── js/
│   ├── i18n.js             # Language toggle (हिं ⇄ EN)
│   ├── data-loader.js      # Renders events + gallery from JSON
│   └── main.js             # Mobile nav + counters + UX
│
├── data/
│   ├── events.json         # 👈 ADD/EDIT EVENTS HERE
│   └── gallery.json        # 👈 ADD/EDIT GALLERY PHOTOS HERE
│
├── media/
│   ├── events/             # Drop event photos here (one folder per event)
│   └── gallery/            # Drop loose gallery photos here
│
└── documents/              # NGO PDFs / images for download
    ├── 12A-Certificate.pdf
    ├── CSR-Certificate.pdf
    ├── e-Anudaan-Certificate.pdf
    ├── Society-Registration-Bylaws.pdf
    ├── Society-Renewal-Certificate.jpeg
    └── PAN-Card.jpeg
```

---

## ✨ Bilingual System — How it works

- Hindi is the **default** language. Visitors see Hindi first.
- A **हिं | EN** pill toggle in the top bar switches the entire site instantly.
- Choice is remembered via `localStorage`.
- Every translatable text is wrapped like:
  ```html
  <span class="hi">हिंदी</span><span class="en">English</span>
  ```
  CSS hides whichever is not active. No JS needed for the basic switch.

To add a new translatable string anywhere, just use that pattern.

---

## ➕ How to add a new EVENT (Easy!)

**Step 1.** Drop your photos in a new folder:
```
media/events/<short-event-id>/
  ├── cover.jpg     (the main banner image)
  ├── 1.jpg
  ├── 2.jpg
  └── 3.jpg
```

**Step 2.** Open `data/events.json` and add a new block at the **top** of the array:

```json
{
  "id": "winter-blanket-2027",
  "title_hi": "शीतकालीन कंबल वितरण 2027",
  "title_en": "Winter Blanket Distribution 2027",
  "date": "2027-01-10",
  "category": "asahay-seva",
  "category_hi": "असहाय सेवा",
  "category_en": "Asahay Seva",
  "location_hi": "ग्राम बंगरिया, ललितपुर",
  "location_en": "Village Bangariya, Lalitpur",
  "description_hi": "इस वर्ष ... (पूरा विवरण लिखें)",
  "description_en": "This year ... (full description)",
  "cover": "media/events/winter-blanket-2027/cover.jpg",
  "photos": [
    "media/events/winter-blanket-2027/1.jpg",
    "media/events/winter-blanket-2027/2.jpg",
    "media/events/winter-blanket-2027/3.jpg"
  ],
  "video": ""
}
```

**Step 3.** Commit + push to GitHub. The events page auto-renders the new card. ✨

### Field reference

| Field | Required | What goes here |
|---|---|---|
| `id` | ✅ | Unique short kebab-case slug (used internally only) |
| `title_hi`, `title_en` | ✅ | Event title in both languages |
| `date` | ✅ | ISO format `YYYY-MM-DD` (used for sorting; newest first) |
| `category` | ✅ | One of: `shiksha`, `gau-seva`, `asahay-seva`, `general` |
| `category_hi`, `category_en` | ✅ | Display names of the category |
| `location_hi`, `location_en` | recommended | Place where the event happened |
| `description_hi`, `description_en` | ✅ | A paragraph or two about the event |
| `cover` | ✅ | Path to the cover image (e.g. `media/events/xyz/cover.jpg`) |
| `photos` | optional | Array of photo paths shown inside the modal |
| `video` | optional | YouTube **embed** URL (`https://www.youtube.com/embed/XXX`). Leave `""` to skip |

> 💡 You can also use external image URLs for the `cover` and `photos` (e.g. CDN or Google Drive direct-link). Local paths are recommended for reliability.

---

## ➕ How to add a GALLERY photo

Open `data/gallery.json` and add an entry:

```json
{
  "src": "media/gallery/coaching-class-1.jpg",
  "category": "shiksha",
  "caption_hi": "निःशुल्क कोचिंग कक्षा",
  "caption_en": "Free coaching class"
}
```

**Categories available:** `shiksha`, `gau-seva`, `asahay-seva`, `health`, `environment`, `cultural`.

That's it. The gallery filter buttons handle the rest.

---

## 🚀 Deploy to GitHub Pages (free)

```bash
cd website/
git init
git add .
git commit -m "Initial commit – SBBSPS website"
git branch -M main
git remote add origin https://github.com/<your-username>/sbbsps.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source = "Deploy from branch" → main / (root) → Save**.

Live URL: `https://<your-username>.github.io/sbbsps/`

### 🌐 Custom domain (optional)

1. Add a file named **`CNAME`** containing your domain, e.g.: `bankebiharisamiti.org`
2. DNS: add A records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a CNAME for `www` → `<your-username>.github.io`
3. GitHub → Settings → Pages → enable **HTTPS**.

---

## 🧪 Test locally

Because the site fetches JSON files (`fetch('data/events.json')`), you cannot just open `index.html` from disk — browsers block `file://` fetches. Run a tiny local server:

```bash
cd website/
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or use `npx serve`, `php -S localhost:8000`, etc.

---

## 🙏 NGO Contact (auto-filled across the site)

| | |
|---|---|
| Phone / WhatsApp | **+91 9559322718** |
| Email | **bankebiharisikaha@gmail.com** |
| UPI ID | **9559322718m@pnb** |
| Bank | Punjab National Bank • A/c **1239002100016010** • IFSC **PUNB0123900** |
| PAN | ABBAS7128L |
| 12A | ABBAS7128LE20251 (AY 2026-29) |
| CSR | CSR00108288 |
| e-Anudaan | UP/00055864 |
| Society Reg. | 133/2016-17 (Renewal J0-340/2023-24) |
| Address | ग्राम बंगरिया, पोस्ट पटौवा, ब्लॉक बिरधा, तहसील पाली, ज़िला ललितपुर, उ.प्र. - 284403 |

The UPI QR is generated on-the-fly via the public qrserver.com API — no QR image file needed. To swap to a custom QR, replace the `<img src="...">` in `donate.html`.

---

## 📃 License

Custom-built for Shri Banke Bihari Shiksha Prasar Samiti. All NGO documents in `documents/` are property of the samiti.

🙏 Designed with seva-bhāv for a noble cause. **जय श्री बांके बिहारी।**
