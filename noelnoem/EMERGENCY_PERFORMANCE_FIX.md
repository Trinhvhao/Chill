# 🚨 EMERGENCY PERFORMANCE FIX

## Vấn đề hiện tại
- FPS chỉ đạt 6-11 thay vì 60
- Draw calls quá thấp (1) - có thể do rendering issue
- Cần khắc phục ngay lập tức

## ⚡ Các fix đã áp dụng

### 1. Giảm drastically particle count
```javascript
// TỪ:
count: 2000, dustCount: 3000

// THÀNH:
count: 600, dustCount: 800 (high-end)
count: 400, dustCount: 600 (standard)
```

### 2. Tắt tất cả hiệu ứng tốn performance
```javascript
// Tắt:
- Bloom effects
- CSS animations (snow, aurora, particles)
- Antialiasing
- Fog
- High pixel ratio
```

### 3. Giảm star field
```javascript
// TỪ: 800 stars
// THÀNH: 200 stars
```

### 4. Emergency performance mode
```javascript
// Auto-activate khi FPS < 20
emergencyPerformanceFix()
```

## 🎮 Console Commands để test ngay

Mở Console (F12) và chạy:

```javascript
// Test với particle count cực thấp
GPU_CONTROLS.testMode()

// Chế độ minimal
GPU_CONTROLS.minimalMode()

// Emergency mode (tắt hết)
GPU_CONTROLS.emergencyMode()

// Xem FPS hiện tại
GPU_CONTROLS.getCurrentFPS()

// Set particle count thủ công
GPU_CONTROLS.setParticleCount(100)

// Set pixel ratio thấp
GPU_CONTROLS.setPixelRatio(0.5)
```

## 🔧 Troubleshooting Steps

### Bước 1: Test minimal
```javascript
GPU_CONTROLS.testMode()
```
- Nếu FPS vẫn thấp → Vấn đề ở renderer/WebGL
- Nếu FPS tăng → Vấn đề ở particle count

### Bước 2: Kiểm tra WebGL
```javascript
// Kiểm tra WebGL context
console.log(renderer.getContext())
console.log(renderer.info)
```

### Bước 3: Kiểm tra GPU usage
- Mở Task Manager → Performance → GPU
- Xem GPU usage có tăng không

### Bước 4: Browser settings
1. Chrome: `chrome://settings/system` → Enable hardware acceleration
2. Chrome: `chrome://flags/#ignore-gpu-blocklist` → Enabled
3. Restart browser

## 🚨 Nếu vẫn lag nghiêm trọng

### Option 1: Tắt hoàn toàn 3D
```javascript
// Chỉ hiển thị UI, tắt canvas
document.getElementById('canvas-container').style.display = 'none';
```

### Option 2: Fallback to 2D
```javascript
// Chuyển sang canvas 2D thay vì WebGL
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
```

### Option 3: Static image
```javascript
// Hiển thị ảnh tĩnh thay vì 3D
document.getElementById('canvas-container').innerHTML = 
    '<img src="christmas-tree-static.jpg" style="width:100%;height:100%;object-fit:cover;">';
```

## 📊 Expected Results sau fix

### Minimal Mode:
- Particles: 200/300
- FPS: 30-45
- Draw calls: 50-100

### Test Mode:
- Particles: 50/100  
- FPS: 45-60
- Draw calls: 20-50

### Emergency Mode:
- Particles: 0 (chỉ UI)
- FPS: 60
- Draw calls: 1-5

## 🔍 Debug Commands

```javascript
// Xem renderer info
console.log(renderer.info.render)

// Xem memory usage
console.log(renderer.info.memory)

// Xem WebGL extensions
console.log(renderer.getContext().getSupportedExtensions())

// Force garbage collection (Chrome)
if (window.gc) window.gc()
```

## ⚠️ Lưu ý

1. **Reload page** sau khi thay đổi settings
2. **Clear cache** nếu vẫn lag
3. **Check browser console** để xem errors
4. **Monitor GPU usage** trong Task Manager
5. **Test trên browser khác** (Firefox, Edge)

## 🎯 Mục tiêu

- **Minimum**: 30 FPS stable
- **Target**: 45-60 FPS
- **Draw calls**: 100-500 (không phải 1)
- **GPU usage**: 50-80%

Hãy test ngay với `GPU_CONTROLS.testMode()` và báo kết quả!