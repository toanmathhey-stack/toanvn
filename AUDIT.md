# Rà soát chức năng ngày 29/09/2026

Phạm vi: chức năng hiện có trên mã nguồn, API và trình duyệt cho học sinh, giáo viên, phụ huynh, quản trị. Kiểm thử bằng cơ sở dữ liệu tạm; không tạo bài làm giả trong tài khoản thật, không gửi email thật, không thay dữ liệu snapshot Render.

## Những điểm đã phát hiện và sửa

| Vấn đề | Kết quả sau sửa |
| --- | --- |
| Nhiệm vụ theo chủ đề từ màn hình giáo viên cũ không có danh sách câu, nên bị bỏ khỏi báo cáo mới | Nhiệm vụ mới chốt các câu theo đúng khối; báo cáo quy đổi nhiệm vụ cũ theo chủ đề. Học sinh và phụ huynh thấy cùng nhiệm vụ và điểm. |
| Giáo viên có thể thấy bài giáo viên khác giao được tính như bài mình giao; danh sách giao bài có nội dung không phải của mình | Thống kê, biểu đồ và danh sách câu giao của giáo viên được giới hạn về nội dung/nhiệm vụ của chính người đó. Học sinh và phụ huynh vẫn thấy đủ bài của các giáo viên. |
| Đường dẫn nhiệm vụ cũ và nút luyện thêm trong công thức có thể đưa giáo viên sang trang dành cho học sinh | Nhiệm vụ mở hồ sơ học sinh; giáo viên xem tài liệu công thức qua thư viện giáo viên. |
| Đổi giáo viên hoặc đổi khối có thể làm bài giáo viên soạn trong lịch sử không còn được nhận diện và làm hỏng lượt lưu tiếp theo | Bài đã giao/làm được giữ riêng để đọc và ôn lịch sử. Không mở quyền tới bài chưa liên quan của giáo viên cũ. |
| Tên sửa trong hồ sơ không đồng bộ với danh sách giáo viên; Excel cho tên 80 ký tự nhưng hồ sơ chỉ cho 40; khối dạng số từ Excel có thể làm ô chọn hồ sơ mặc định nhầm lớp 6 | Đồng bộ tên, thống nhất giới hạn 80 ký tự và hiển thị đúng khối tài khoản vừa nhập. Sau đổi khối, tải lại nội dung tương ứng ngay. |
| “Lưu để giáo viên xem” chưa có đường nhận xét thuận tiện trong hồ sơ mới, đặc biệt với bài đúng ngay từ đầu | Hồ sơ có mục lời giải thích và nhận xét cho cả bài đúng và sai; nhận xét đến đúng học sinh và phụ huynh liên kết. |
| Khám phá 3D và câu tự kiểm tra công thức chỉ tồn tại trong trình duyệt | Có lưu kết quả vào máy chủ, giáo viên xem và nhận xét trong hồ sơ; học sinh/phụ huynh xem lại. Theo dõi riêng với điểm nhiệm vụ. |
| Không có cách bổ sung email cho phụ huynh cũ hoặc khôi phục tài khoản khi mất mật khẩu Excel | Quản trị có biểu mẫu cập nhật email và đặt mật khẩu mới cho tài khoản khác. Đổi mật khẩu kết thúc phiên đăng nhập cũ. |
| Lời giải có cả văn xuôi và LaTeX bị đưa vào bộ dựng phép tính thuần; công thức `$...$` chưa được kiểm tra khi đăng | Dùng đúng bộ dựng văn xuôi/công thức và kiểm tra cả các kiểu dấu bao LaTeX được hỗ trợ. |
| Bộ chấm biểu thức chỉ thử một vài giá trị x nên có thể nhận nhầm đa thức khác thành đáp án đúng | So sánh hệ số biểu thức bậc nhất; từ chối mẫu có biến và tích phi tuyến. Chấp nhận chia cho hằng số như `(6x+12)/2`. |
| Client có thể tự khai “đã sửa đúng” cho lượt mới mà không gửi đáp án sửa; thời gian tương lai có thể làm lệch báo cáo | Máy chủ kiểm tra đáp án sửa; chặn thời gian tương lai. Bằng chứng/đáp án sửa đã lưu được giữ khi tab cũ gửi lại. |
| Kết thúc hành trình có thể hiện đã lưu dù mạng lỗi | Chỉ chuyển sang bước đã lưu sau khi máy chủ xác nhận; lỗi lưu có trạng thái rõ và có thể thử lại. |
| Bài giáo viên đăng chưa có danh sách trực tiếp ở ngân hàng đề | Thêm danh sách bài đã đăng và đường mở nội dung. |
| Gợi ý AI đã lưu không hết hiệu lực khi giao thêm nhiệm vụ; lớp nhập tay cho phép trùng tên và ngày không tồn tại | Bổ sung các dữ liệu này vào kiểm tra thay đổi/đầu vào. |

## Kết quả kiểm tra

- `npm test`: **39 kiểm thử đạt**.
- **16 kịch bản trình duyệt đạt ở lượt kiểm tra cuối**: content, learning, upload, roster, parent-mail, parent-dashboard, teacher-dashboard, roles, grades, routing-stats, lessons, math, design, atlas, explore, workflow-audit.
- Kịch bản mới kiểm tra xuyên vai trò: học sinh nộp hoạt động/công thức → giáo viên nhận xét → phụ huynh xem; quản trị bổ sung email → giáo viên xem trước email đúng người; khôi phục tài khoản.
- Kiểm tra mới cho trường hợp hai giáo viên cùng phụ trách một học sinh, thu hồi liên kết, tên dài từ Excel, giữ bài lịch sử, đáp án sửa giả, công thức LaTeX sai và biểu thức khớp điểm thử nhưng không tương đương.
- Kiểm tra PWA, 3D/WebGL và dự phòng, chuyển lớp 6–9, điện thoại, đổi tab, đăng xuất và khóa quyền ngoại tuyến nằm trong các kịch bản trên.

## Phần cần cấu hình hoặc giới hạn hiện tại

1. **Gmail thật:** chưa xác nhận giao email đầu cuối. Cần `GMAIL_USER`, `GMAIL_APP_PASSWORD` và email phụ huynh hợp lệ; làm theo [GMAIL.md](GMAIL.md). Kiểm thử gửi dùng SMTP giả lập. Chấp nhận gửi không đồng nghĩa đã nhận/đọc thư. Chưa có lịch tự động gửi báo cáo định kỳ.
2. **Gemini thật:** đã kiểm tra định dạng, phân quyền, phản hồi giả lập và nhánh dự phòng; đợt rà soát này không gọi API trả phí để đánh giá câu trả lời thực tế. AI vẫn cần giáo viên duyệt.
3. **Ngoại tuyến:** PWA cache giao diện, công thức và mô hình; xác thực và lưu lên máy chủ cần mạng. Chưa có hàng đợi bài làm ngoại tuyến bền vững; không đóng/tải lại trang khi đang báo chưa lưu được.
4. **Dữ liệu 3D cũ:** kết quả chưa từng được lưu trước bản cập nhật này không thể tự khôi phục. Hoạt động mới hiển thị 100 bản gần nhất, tối đa 5.000 bản/học sinh.
5. **Nội dung/đánh giá:** kho bài vẫn là nội dung demo, không đại diện đầy đủ chương trình. Chấm tự động chỉ xác nhận phần số/biểu thức được hỗ trợ, không xác nhận chất lượng lập luận. Giáo viên xem toàn bộ lịch sử lỗi; tiến độ trên trang chủ học sinh được lọc theo khối hiện tại.
6. **Vận hành:** chưa thực hiện kiểm thử tải nhiều người dùng hay kiểm tra một bản deploy Render trực tiếp. Dự án dùng một tiến trình máy chủ với JSON trên ổ bền vững; không chạy nhiều tiến trình cùng ghi vào một file dữ liệu.

Không thể kết luận ứng dụng không còn bất kỳ lỗi nào chỉ từ kiểm thử tự động. Các kết quả trên mô tả phạm vi đã kiểm tra và những lỗi đã tái hiện/sửa.
