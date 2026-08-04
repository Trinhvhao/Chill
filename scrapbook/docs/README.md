# Our Little Story — Scrapbook Gift

> Một bức thư điện tử kỹ thuật số tặng người yêu, kết hợp hoạt cảnh pháo hoa hoa tươi, album ảnh lật trang, và nhạc nền.

---

## Tổng quan

Dự án là một trang web tặng quà tình yêu đơn trang (single-page) với trải nghiệm mở quà theo phong cách "scrapbook kỹ thuật số":

1. **Màn hình landing** — Phong bì thư với lời nhắn *"For you, my baby"*, giao diện màu đào/hồng nhạt.
2. **Pháo hoa hoa** — Khi nhấn phong bì, ~560–980 bông hoa tuôn ra từ tâm màn hình theo quy luật golden-angle, bay lơ lửng rồi rơi xuống.
3. **Album ảnh** — Sau khi hoa rơi xong, hiện ra cuốn sách ảnh 20 trang dùng thư viện **PageFlip**, có hiệu ứng lật trang, ghim xoắn ốc vẽ bằng Canvas.
4. **Nhạc nền** — File nhạc MP3 phát lặp khi mở phong bì.

---

## Cấu trúc thư mục

```
scrapbook/
├── index.html                  # Entry point
├── assets/
│   ├── css/
│   │   ├── app.css             # Layout, hoạt cảnh, scrapbook
│   │   └── css2.css           # Font-face preload
│   ├── js/
│   │   ├── app.js             # Logic chính (bloom, fall, PageFlip)
│   │   ├── page-flip.browser.min.js  # Thư viện lật trang
│   │   └── anti-devtools.js   # Chống mở DevTools
│   ├── images/                 # 20 ảnh trang (2 version: gốc + hash)
│   │   ├── envelope-closed.png
│   │   ├── envelope-opened.png
│   │   └── [1-20].png
│   ├── flowers/                # 3 asset hoa PNG
│   ├── fonts/                  # Google Fonts woff2 offline
│   └── assets/
│       └── gift-music.mp3     # Nhạc nền
└── docs/
    └── README.md               # (file này)
```

---

## Luồng trải nghiệm (UX Flow)

```
[Landing] → (tap envelope)
    ↓
[Rung phong bì ~550ms] → [Bloom: hoa tuôn ra 5.8s]
    ↓
[Fall: hoa rơi ~2.1s] → [Album hiện dần]
    ↓
[Scrapbook] → (lật trang / kéo góc)
```

---

## Công nghệ & Thư viện

| Công nghệ | Vai trò |
|-----------|---------|
| **HTML/CSS/JS** | Nguyên bản, không framework |
| **PageFlip.js** | Thư viện lật trang sách |
| **Google Fonts** | Caveat (chữ viết tay), Quicksand |
| **Canvas API** | Vẽ ghim xoắn ốc (spiral binding) |
| **CSS Animations** | Hoa nở, rơi, nhấp nháy, bob |
| **Audio API** | Phát nhạc nền khi mở quà |

---

## Tính năng chính

### Gift Landing
- Phong bì với animation rung khi hover/click
- Chuyển đổi ảnh closed ↔ opened qua opacity transition
- Caption "For you, my baby." bằng font Caveat

### Flower Bloom System
- Thuật toán **golden-angle spiral** phân bố hoa tự nhiên
- Số lượng hoa thích ứng theo kích thước màn hình và DPI
- Mỗi hoa có: kích thước ngẫu nhiên, xoay ngẫu nhiên, bão hòa/màu ngẫu nhiên, blur ngẫu nhiên
- Animation float vô hạn sau khi nở
- Sparkle particles nền

### Flower Fall
- Hoa rơi xuống với độ trễ khác nhau, xoay và lắc (sway)
- Sử dụng CSS custom properties cho từng hoa
- Scrapbook hiện ra phía sau trong quá trình rơi

### Scrapbook / Album ảnh
- 20 trang ảnh kèm chú thích (chapter, sunset & smiles, held your hand...)
- Cover trước + cover sau với doodle SVG
- **Spiral binding vẽ bằng Canvas** — ghim xoắn ốc mô phỏng sách thật
- **Spine shadow** — bóng gáy sách giữa 2 trang
- Responsive: điều chỉnh kích thước theo orientation và viewport
- Single-page view centering (trang đầu/cuối căn giữa)
- Landscape spread hiển thị 2 trang cạnh nhau

### Anti-DevTools
- Script chống inspect DevTools (dùng `devtools-detect` hoặc tương đương)

---

## Responsive Breakpoints

| Breakpoint | Hành vi |
|-----------|---------|
| `< 480px` | Font hint nhỏ hơn |
| `portrait & <= 700px` | Album rộng 88vw, Cao 80vh |
| `portrait & <= 380px` | Album rộng 94vw, Cao 75vh |
| `landscape & <= 520px` | Album rộng 60vw, Cao 78% |
| Desktop | Album rộng tối đa 800px, Cao 520px |

---

## Cách tuỳ chỉnh

### Thêm/sửa ảnh trang
1. Đặt ảnh vào `assets/images/` (đặt tên `1.png`, `2.png`, ...)
2. Cập nhật `<div class="page">` trong `index.html`:
   ```html
   <div class="page" data-density="soft" data-spiral="right">
     <img alt="page N" src="assets/images/N.png"/>
     <span class="caption">your caption here</span>
   </div>
   ```

### Đổi nhạc nền
Thay file `assets/assets/gift-music.mp3` và cập nhật hash trong tên file trong `index.html`.

### Đổi hoa
Thay 3 file trong `assets/flowers/` (flower-1.png, flower-2.png, flower-3.png).

### Đổi thông điệp
- Caption: sửa `.gift-caption` text trong `index.html`
- Cover title: sửa `.cover-title` text trong `index.html`
- Cover back: sửa `.cover-back-title`, `.cover-back-name` trong `index.html`

---

## Deployment

Dự án là **static site**, không cần build. Chỉ cần serve file `index.html` qua bất kỳ web server nào:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve

# VS Code Live Server extension
```

---

## Browser Support

| Browser | Hỗ trợ |
|---------|---------|
| Chrome 90+ | ✅ Đầy đủ |
| Firefox 88+ | ✅ Đầy đủ |
| Safari 14+ | ✅ Đầy đủ |
| Edge 90+ | ✅ Đầy đủ |
| Mobile Chrome/Safari | ✅ Đầy đủ (touch events) |

---

## Credits

- **PageFlip.js** — [Turn.js fork](https://github.com/nvnnvnn/page-flip)
- **Fonts** — Google Fonts (Caveat, Quicksand)
- **Design** — Handmade với tình yêu 💕
