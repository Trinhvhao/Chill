Xây dựng hệ thống IoT giám sát môi trường trong phòng làm việc tại Công Ty TNHH Công Nghệ Nam Dương
 
 
Chức năng mô hình 
1. Chức năng giám sát môi trường (Core Monitoring Functions)
 Giám sát nhiệt độ và độ ẩm
•	Thu thập nhiệt độ và độ ẩm theo thời gian thực.
•	Phát hiện tình trạng nóng – lạnh – quá ẩm hoặc quá khô.
•	Dựa trên cảm biến: DHT11/DHT22.
Giám sát chất lượng không khí (CO₂, khí độc(gas))
•	Đo mức tạp chất trong không khí (CO₂ tương đối, bụi, khí độc).
•	Phát hiện môi trường bí – thiếu oxy – có mùi lạ.
•	Dựa trên cảm biến MQ-135, MQ2
 Giám sát ánh sáng văn phòng
•	Đo độ sáng (lux) của mô hình hoặc không gian làm việc.
•	Đánh giá đủ sáng – thiếu sáng – chói sáng.
•	Dựa trên BH1750.
Giám sát mức tiếng ồn
•	Nhận biết tiếng động hoặc tiếng ồn vượt mức.
•	Cảnh báo khi môi trường làm việc quá ồn.
•	Dựa trên KY-038.
2. Chức năng cảnh báo (Warning & Alert Functions)
Cảnh báo bằng đèn LED RGB
•	LED đổi màu theo chất lượng môi trường:
o	Xanh – Tốt
o	Vàng – Trung bình
o	Đỏ – Nguy hiểm
•	Giúp người xem nhận biết nhanh tình trạng môi trường.
Cảnh báo bằng còi buzzer
•	Phát âm thanh khi thông số vượt ngưỡng:
o	CO₂ cao
o	Nhiệt độ quá nóng
o	Tiếng ồn lớn
•	Tăng tính tương tác trực tiếp.
 Hiển thị cảnh báo trên LCD
•	LCD hiển thị rõ ràng các thông số và các trạng thái cảnh báo.
3. Chức năng hiển thị & trực quan hóa (Visualization Functions)
Hiển thị bằng LED trong mô hình văn phòng
•	Bật tắt đèn trần mô phỏng theo độ sáng.
•	Mô phỏng hành vi văn phòng thông minh.
4. Chức năng truyền dữ liệu (Communication Functions)
Gửi dữ liệu lên Internet
•	Gửi dữ liệu từ ESP8266 → Firebase, Thingspeak hoặc server web.
Theo dõi từ xa qua Dashboard (nếu triển khai)
•	Biểu đồ thời gian thực.
•	Theo dõi từ máy tính hoặc điện thoại.
 5. Chức năng mô hình hóa văn phòng (Model Simulation Functions)
Tạo mô hình văn phòng thu nhỏ
•	Có đầy đủ tường, cửa, bàn ghế, đèn, quạt mini.
Đặt cảm biến đúng vị trí "tính năng"
•	BH1750 đặt gần trần → đo ánh sáng.
•	MQ135 đặt gần khu vực nhân viên → đo chất lượng không khí.
•	KY-038 đặt gần cửa/đường đi → đo tiếng động mô phỏng.
 6. Chức năng đánh giá & phân tích (Analytics Functions)
Phân loại chất lượng môi trường
•	Tốt – Trung bình – Kém.
•	Dựa trên ngưỡng của MQ135, DHT, BH1750.
Tính “chỉ số thoải mái” (Comfort Index) (tùy chọn)
•	Dựa trên nhiệt độ, độ ẩm, ánh sáng, tiếng ồn.
 7. Chức năng mở rộng (Future Enhancement)
Dùng cảm biến CO₂ chính xác (MH-Z19B)
 Kết nối MQTT Broker
 Lưu dữ liệu dài hạn (Big Data)
Các chức năng web
Dưới đây là các chức năng chi tiết:
1. Chức năng hiển thị dữ liệu thời gian thực (Realtime Monitoring)
Nhận dữ liệu trực tiếp từ ESP8266
•	Nhiệt độ
•	Độ ẩm
•	Cường độ ánh sáng
•	Tiếng ồn
•	Chỉ số khí MQ-135
 Hiển thị dạng:
•	Số liệu (live value)
•	Biểu đồ cột
•	Biểu đồ đường (theo thời gian)
•	Biểu đồ gauge (vòng tròn)
 2. Chức năng biểu đồ lịch sử (History Chart)
Cho phép xem lại:
•	Mức CO₂ theo giờ
•	Biến thiên ánh sáng
•	Thay đổi nhiệt độ trong ngày
•	Thay đổi tiếng ồn theo thời điểm
 Giúp phân tích môi trường làm việc giống hệ thống Smart Office thực tế.
3. Chức năng cảnh báo trên Dashboard
Màu sắc cảnh báo:
•	Xanh – môi trường tốt
•	Vàng – trung bình
•	Đỏ – nguy hiểm
 Popup cảnh báo khi vượt ngưỡng
•	CO₂ cao
•	Nhiệt độ quá nóng
•	Độ ẩm quá thấp
•	Ánh sáng quá tối
•	 Âm thanh hoặc hiệu ứng nhấp nháy (tùy chọn)
 4. Chức năng phân tích tổng hợp (Analytics Overview)
Trang Dashboard Summary sẽ cung cấp:
•	Chỉ số môi trường trung bình
Biểu đồ mức ồn trong ngày
•	Đánh giá “Comfort Index”
Tình trạng phòng (Good – Medium – Bad)
 5. Chức năng ghi log (Data Logging)
•	Theo dõi xu hướng
•	So sánh các thời điểm trong ngày
•	Tạo báo cáo môi trường
 6. Chức năng hiển thị trạng thái kết nối
Dashboard cho biết:
•	ESP8266 đang online hay offline
•	Thời gian cập nhật cuối cùng
•	Tín hiệu WiFi mạnh/yếu (tùy chọn)
 7. Giao diện trực quan – dễ dùng
Dashboard gồm 4 mục chính:
1.	Home Overview – tổng quan môi trường
2.	Realtime Monitor – biểu đồ realtime
3.	History Chart – biểu đồ lịch sử
4.	Control Panel – điều khiển từ xa
Tông kết: 
Dashboard Web giúp:
•	Theo dõi từ xa
•	Cảnh báo trực quan
•	Lưu lịch sử dữ liệu
•	Trình diễn mô hình Smart Office chuyên nghiệp

