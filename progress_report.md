# BÁO CÁO TIẾN ĐỘ DỰ ÁN
## Hệ thống IoT giám sát môi trường trong phòng làm việc tại Công Ty TNHH Công Nghệ Nam Dương

---

## 1. TỔNG QUAN TIẾN ĐỘ

**Tiến độ tổng thể:** 75%

**Chi tiết tiến độ:**
- Mô hình phần cứng: 80%
- Dashboard Web: 70%
- Kết nối Web - Hardware: Đang hoàn thiện

**Trạng thái:** Đang trong giai đoạn hoàn thiện và tối ưu hóa

---

## 2. CÁC CHỨC NĂNG ĐÃ HOÀN THÀNH VÀ KIỂM TRA

### 2.1. Module cảm biến (✓ Hoạt động ổn định)

**Giám sát nhiệt độ và độ ẩm**
- Cảm biến DHT11/DHT22 hoạt động ổn định
- Thu thập dữ liệu theo thời gian thực chính xác
- Phát hiện tình trạng nóng – lạnh – quá ẩm – quá khô

**Giám sát chất lượng không khí**
- Cảm biến MQ-135, MQ2 đo CO₂ và khí độc chính xác
- Phát hiện môi trường bí – thiếu oxy – có mùi lạ

**Giám sát ánh sáng**
- Cảm biến BH1750 đo độ sáng (lux) chính xác
- Đánh giá đủ sáng – thiếu sáng – chói sáng

**Giám sát mức tiếng ồn**
- Cảm biến KY-038 nhận biết tiếng động và tiếng ồn
- Cảnh báo khi môi trường làm việc quá ồn

### 2.2. Hệ thống cảnh báo (✓ Hoạt động tốt)

- LED RGB đổi màu theo chất lượng môi trường (Xanh – Vàng – Đỏ)
- Còi buzzer phát âm thanh khi thông số vượt ngưỡng
- LCD hiển thị rõ ràng các thông số và trạng thái cảnh báo

### 2.3. Chức năng truyền dữ liệu (⚙ Đang hoàn thiện)

- ESP8266 gửi dữ liệu lên server
- Kết nối WiFi hoạt động
- Đang tối ưu kết nối giữa hardware và web
- Đang kiểm tra độ ổn định truyền dữ liệu realtime

### 2.4. Dashboard Web (⚙ Hoàn thiện 70%)

**Hiển thị dữ liệu thời gian thực**
- Nhiệt độ, độ ẩm, ánh sáng, tiếng ồn, chỉ số khí
- Biểu đồ cột, biểu đồ đường, biểu đồ gauge
- Đang tối ưu hiển thị realtime

**Cơ sở dữ liệu (✓ Đã triển khai)**
- Database lưu trữ dữ liệu lịch sử
- Lưu trữ thông số cảm biến theo thời gian
- Truy vấn dữ liệu cho biểu đồ lịch sử

**Biểu đồ lịch sử**
- Xem lại dữ liệu theo thời gian
- Phân tích xu hướng môi trường
- Đang hoàn thiện giao diện hiển thị

**Cảnh báo trên Dashboard**
- Màu sắc cảnh báo (Xanh – Vàng – Đỏ)
- Popup cảnh báo khi vượt ngưỡng
- Đang tối ưu logic cảnh báo

**Phân tích tổng hợp**
- Chỉ số môi trường trung bình
- Đánh giá "Comfort Index"
- Tình trạng phòng (Good – Medium – Bad)

**Ghi log dữ liệu**
- Lưu trữ dữ liệu vào database
- Theo dõi xu hướng
- Tạo báo cáo môi trường

**Hiển thị trạng thái kết nối**
- Trạng thái ESP8266 (online/offline)
- Thời gian cập nhật cuối cùng
- Đang hoàn thiện tính năng

---

## 3. CÔNG VIỆC ĐANG THỰC HIỆN

### 3.1. Hoàn thiện kết nối Web - Hardware

**Mục tiêu:** Đảm bảo kết nối ổn định giữa ESP8266 và Dashboard Web

- Tối ưu giao thức truyền dữ liệu
- Kiểm tra và xử lý lỗi kết nối
- Đồng bộ dữ liệu realtime
- Tối ưu tốc độ cập nhật dữ liệu

### 3.2. Tối ưu giao diện Dashboard Web (70% → 100%)

**Mục tiêu:** Cải thiện trải nghiệm người dùng và tính thẩm mỹ

- Tối ưu bố cục các thành phần
- Cải thiện màu sắc và typography
- Tăng tính trực quan cho biểu đồ
- Responsive design cho các thiết bị khác nhau
- Thêm hiệu ứng chuyển động mượt mà
- Hoàn thiện các tính năng còn thiếu

### 3.3. Hoàn thiện mô hình vật lý (80% → 100%)

**Trạng thái:** Mô hình đã hoàn thành cấu trúc chính

- Mô hình văn phòng thu nhỏ với tường, bàn ghế
- Đèn LED mô phỏng ánh sáng văn phòng
- Cảm biến đặt đúng vị trí chức năng

**Đang thực hiện:** Trang trí và hoàn thiện chi tiết

- Decor mô hình cho chuyên nghiệp hơn
- Sắp xếp dây dẫn gọn gàng
- Hoàn thiện bảng mạch và vỏ hộp
- Thêm chi tiết trang trí văn phòng

---

## 4. KẾ HOẠCH HOÀN THIỆN (25% còn lại)

### 4.1. Hoàn thiện kết nối Web - Hardware (10%)
- Kiểm tra và tối ưu độ ổn định kết nối
- Xử lý các trường hợp lỗi và mất kết nối
- Đảm bảo truyền dữ liệu realtime mượt mà

### 4.2. Hoàn thiện Dashboard Web (5%)
- Kiểm tra và điều chỉnh responsive design
- Tối ưu hiệu suất tải trang
- Kiểm tra cross-browser compatibility
- Hoàn thiện các tính năng còn thiếu

### 4.3. Hoàn thiện mô hình vật lý (5%)
- Hoàn tất trang trí và decor
- Kiểm tra tổng thể hệ thống
- Chụp ảnh và quay video demo

### 4.4. Tài liệu và báo cáo (5%)
- Hoàn thiện tài liệu hướng dẫn sử dụng
- Chuẩn bị tài liệu thuyết trình
- Viết báo cáo kỹ thuật chi tiết

---

## 5. KẾT LUẬN

Dự án đã hoàn thành 75% với các thành phần chính:
- **Mô hình phần cứng (80%):** Tất cả module cảm biến và hệ thống cảnh báo hoạt động ổn định
- **Dashboard Web (70%):** Đã có database lưu trữ, các tính năng hiển thị và phân tích cơ bản hoạt động tốt
- **Kết nối Web - Hardware:** Đang trong giai đoạn hoàn thiện và tối ưu

Giai đoạn hiện tại tập trung vào hoàn thiện kết nối giữa phần cứng và web, tối ưu hóa giao diện Dashboard để đẹp hơn và trực quan hơn, cùng với hoàn thiện chi tiết trang trí mô hình vật lý. Dự kiến hoàn thành 100% trong thời gian tới.

---

*Ngày cập nhật: 09/01/2026*
