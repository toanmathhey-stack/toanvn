# Nhập lớp từ Excel

Giáo viên mở **Lớp học của tôi → Tạo lớp từ Excel**, tải mẫu, nhập tên lớp và khối 6–9, chọn file rồi xem trước và xác nhận.

- Nhận `.xlsx`, tối đa 5 MB và 200 học sinh, ba cột đúng tên trong mẫu. Xóa dòng ví dụ trước khi nhập; ô phải là văn bản thuần.
- Sinh mã học sinh đồng thời là tên đăng nhập; mật khẩu ngẫu nhiên riêng cho mỗi tài khoản. Học sinh được gán đúng khối và giáo viên được liên kết với lớp.
- Cùng email và tên phụ huynh trong file tạo một tài khoản có nhiều con. Chỉ tái sử dụng phụ huynh hiện có khi họ đã có con thuộc giáo viên này; các trường hợp khác cần quản trị kiểm tra.
- Từ chối tên lớp trùng của cùng giáo viên, học sinh trùng tên và email trong file, email lỗi, tên phụ huynh không nhất quán và công thức Excel.
- Sau khi tạo, tải CSV chứa tài khoản (Excel mở được). Chỉ bàn giao thông tin cho đúng gia đình. Mật khẩu cũ của phụ huynh không được xuất hoặc thay đổi.
- Xem trước có hiệu lực 30 phút. Gửi lại cùng xác nhận trong thời gian này không tạo trùng. Mật khẩu mới chỉ giữ trong bộ nhớ tạm và màn hình kết quả, không lưu dạng rõ trong cơ sở dữ liệu. Phải tải danh sách trước khi rời trang hoặc khởi động lại máy chủ; nếu đã mất danh sách, liên hệ quản trị để xử lý tài khoản.
- Tài khoản, liên kết và lớp được lưu cùng một lần; lỗi ghi dữ liệu sẽ hoàn tác. Chưa gửi Gmail tự động.

Kiểm tra: `npm test`, `node scripts/check-roster.mjs` (Microsoft Edge).
