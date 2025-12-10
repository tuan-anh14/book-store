Kiểm thử hệ thống 


Test case chức năng đăng ký
TH
Mô Tả Tình Huống
Dữ Liệu
Mong Đợi
Fail/Pass
Chức năng đăng ký
1
Đăng ký hợp lệ với tất cả các trường được điền đúng
- Họ tên: "Nguyễn Văn A"
- Email: "test@gmail.com"
- Mật khẩu: "Password123!"
- Số điện thoại: "0123456789"
- Tài khoản được tạo thành công
- Hiển thị thông báo "Đăng ký thành công. Vui lòng kiểm tra email để xác thực!"
- Chuyển hướng đến trang verify-email
Pass
2
Trường Họ tên để trống
- Họ tên: [để trống]
- Email: "test@gmail.com"
- Mật khẩu: "Password123!"
- Số điện thoại: "0123456789"
- Hiển thị thông báo lỗi "Họ tên không được để trống!"
- Biểu mẫu không được gửi đi
Pass
3
Email không đúng định dạng
- Họ tên: "Nguyễn Văn A"
- Email: "invalidemail.com"
- Mật khẩu: "Password123!"
- Số điện thoại: "0123456789"
- Hiển thị thông báo lỗi "Email không đúng định dạng!"
- Biểu mẫu không được gửi đi
Pass
4
Trường Email để trống
- Họ tên: "Nguyễn Văn A"
- Email: [để trống]
- Mật khẩu: "Password123!"
- Số điện thoại: "0123456789"
- Hiển thị thông báo lỗi "Email không được để trống!"
- Biểu mẫu không được gửi đi
Pass
5
Trường Mật khẩu để trống
- Họ tên: "Nguyễn Văn A"
- Email: "test@gmail.com"
- Mật khẩu: [để trống]
- Số điện thoại: "0123456789"
- Hiển thị thông báo lỗi "Mật khẩu không được để trống!"
- Biểu mẫu không được gửi đi
Pass
6
Trường Số điện thoại để trống
- Họ tên: "Nguyễn Văn A"
- Email: "test@gmail.com"
- Mật khẩu: "Password123!"
- Số điện thoại: [để trống]
- Hiển thị thông báo lỗi "Số điện thoại không được để trống!"
- Biểu mẫu không được gửi đi
Pass
7
Đăng ký với Email đã tồn tại
- Họ tên: "Nguyễn Văn A"
- Email: "admin@gmail.com"
- Mật khẩu: "Password123!"
- Số điện thoại: "0123456789
- Hiển thị thông báo lỗi rằng email đã tồn tại
- Biểu mẫu không được gửi đi
Pass






Test case chức năng đăng nhập
TH
Mô Tả Tình Huống
Dữ Liệu
Mong Đợi
Fail/Pass
1
Đăng nhập thành công với thông tin hợp lệ
- Email: "admin@gmail.com"
  - Mật khẩu: "123456"
- Đăng nhập thành công
  - Hiển thị thông báo "Đăng nhập thành công"
  - Chuyển hướng đến trang chủ
  - Lưu token vào localStorage
  - Cập nhật trạng thái đăng nhập và thông tin user
Pass
2
Đăng nhập với email không tồn tại
- Email: "nonexistent@gmail.com"
  - Mật khẩu: "Password123!"
- Hiển thị thông báo lỗi "Có lỗi xảy ra" với mô tả lỗi từ server
  - Không chuyển hướng
  - Không lưu token
Pass
3
Đăng nhập với mật khẩu không chính xác
- Email: "admin@gmail.com"
  - Mật khẩu: "WrongPassword"
- Hiển thị thông báo lỗi "Có lỗi xảy ra" với mô tả lỗi từ server
  - Không chuyển hướng
  - Không lưu token
Pass
4
Trường email để trống
- Email: [để trống]
  - Mật khẩu: "Password123!"
- Hiển thị thông báo lỗi "Email không được để trống!"
  - Biểu mẫu không được gửi đi
Pass
5
Trường mật khẩu để trống
- Email: "admin@gmail.com"
  - Mật khẩu: [để trống]
- Hiển thị thông báo lỗi "Mật khẩu không được để trống!"
  - Biểu mẫu không được gửi đi
Pass
6
Định dạng email không hợp lệ
- Email: "invalidemail.com"
  - Mật khẩu: "Password123!"
- Hiển thị thông báo lỗi "Email không đúng định dạng!"
  - Biểu mẫu không được gửi đi
Pass
7
Đăng nhập với tài khoản chưa xác thực email
- Email: "unverified@gmail.com"
  - Mật khẩu: "Password123!"
- Hiển thị thông báo lỗi từ server về việc chưa xác thực email
  - Không chuyển hướng
  - Không lưu token
Pass

Bảng 4.2: bảng Test case chức năng đăng nhập
 
 
 
 
 
 
 
 
 
 
Test chức năng quên mật khẩu
TH
Mô Tả Tình Huống
Dữ Liệu
Mong Đợi
Fail/Pass
1
Nhập email rỗng
- Email: [để trống]
- Hiển thị thông báo lỗi "Email không được để trống!"
  - Biểu mẫu không được gửi đi
Pass
2
Nhập email không đúng định dạng
- Email: "admin.com"
- Hiển thị thông báo lỗi "Email không đúng định dạng!"
  - Biểu mẫu không được gửi đi
Pass
3
Email chưa đăng ký trong hệ thống
- Email: "pat@gmail.com"
- Hiển thị thông báo lỗi từ server về việc email không tồn tại
  - Không gửi email reset password
Pass
4
Email đã đăng ký trong hệ thống
- Email: "admin@gmail.com"
- Hiển thị thông báo "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!"
  - Gửi email reset password
  - Hiển thị trạng thái loading trong quá trình xử lý
Pass
5
Gửi yêu cầu nhiều lần liên tiếp
- Email: "admin@gmail.com"
  (gửi nhiều lần)
- Hiển thị thông báo thành công mỗi lần
  - Gửi email reset password mỗi lần
  - Không bị chặn hoặc giới hạn số lần gửi
Pass
6
Xử lý lỗi server
- Email: "admin@gmail.com"
  (khi server gặp lỗi)
- Hiển thị thông báo lỗi "Có lỗi xảy ra!"
  - Không gửi email reset password
Pass

Bảng 4.3: bảng Test chức năng quên mật khẩu
 





 
Test case chức năng quản lý user
TH
Mô Tả Tình Huống
Dữ Liệu
Mong Đợi
Fail/Pass
1
Xem danh sách user
- Truy cập trang quản lý user
- Hiển thị bảng danh sách user với các cột: Id, Full Name, Email, Created At, Action
  - Có phân trang (5 user/trang)
  - Có nút Export, Import, Add new
Pass
2
Tìm kiếm user theo email
- Email: "example@gmail.com"
- Hiển thị danh sách user có email chứa "example@gmail.com"
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
3
Tìm kiếm user theo tên
- Full Name: "John"
- Hiển thị danh sách user có tên chứa "John"
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
4
Tìm kiếm user theo ngày tạo
- Date R
ange: [01/01/2024 - 31/01/2024]
- Hiển thị danh sách user được tạo trong khoảng thời gian này
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
5
Sắp xếp theo ngày tạo
- Click vào cột Created At
- Sắp xếp danh sách user theo thứ tự tăng dần/giảm dần của ngày tạo
  - Cập nhật phân trang
Pass
6
Xem chi tiết user
- Click vào Id của user
- Hiển thị modal chi tiết thông tin user
  - Hiển thị đầy đủ thông tin: Id, Full Name, Email, Created At
Pass
7
Thêm user mới
- Click nút "Add new"
  - Điền thông tin user mới
- Hiển thị modal thêm user mới
  - Sau khi thêm thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách user
   + Đóng modal
Pass
8
Cập nhật thông tin user
- Click icon Edit
  - Cập nhật thông tin
- Hiển thị modal cập nhật thông tin
  - Sau khi cập nhật thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách user
   + Đóng modal
Pass
9
Xóa user
- Click icon Delete
  - Xác nhận xóa
- Hiển thị popup xác nhận xóa
  - Sau khi xóa thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách user
Pass
10
Export danh sách user
- Click nút Export
- Tải file CSV chứa danh sách user
  - File có tên "export-user.csv"
  - File chứa đầy đủ thông tin user
Pass
11
Import danh sách user
- Click nút Import
  - Chọn file CSV
- Hiển thị modal import
  - Sau khi import thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách user
   + Đóng modal
Pass
12
Xử lý lỗi khi thêm user
- Thêm user với email đã tồn tại
- Hiển thị thông báo lỗi
  - Không thêm user mới
  - Giữ nguyên danh sách user
Pass
13
Xử lý lỗi khi cập nhật user
- Cập nhật với email đã tồn tại
- Hiển thị thông báo lỗi
  - Không cập nhật thông tin
  - Giữ nguyên thông tin cũ
Pass
14
Xử lý lỗi khi xóa user
- Xóa user không tồn tại
- Hiển thị thông báo lỗi
  - Không xóa user
  - Giữ nguyên danh sách user
Pass

Bảng 4.4: bnagr Test case chức năng quản lý user
 
 
 
 
 
 
 
Test chức năng quản lý sách
TH
Mô Tả Tình Huống
Dữ Liệu
Mong Đợi
Fail/Pass
1
Xem danh sách sách
Truy cập trang quản lý sách
Hiển thị bảng danh sách sách với các cột: Id, Tên sách, Thể loại, Tác giả, Giá tiền, Ngày cập nhật, Action
  - Có phân trang (5 sách/trang)
  - Có nút Export, Import, Add new
Pass
2
Tìm kiếm sách theo tên
Tên sách: "Đắc nhân tâm"
Hiển thị danh sách sách có tên chứa "Đắc nhân tâm"
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
3
Tìm kiếm sách theo tác giả
Tác giả: "Dale Carnegie"
Hiển thị danh sách sách của tác giả "Dale Carnegie"
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
4
Tìm kiếm sách theo ngày tạo
Date Range: [01/01/2024 - 31/01/2024]
Hiển thị danh sách sách được tạo trong khoảng thời gian này
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
5
Sắp xếp theo giá tiền
Click vào cột Giá tiền
Sắp xếp danh sách sách theo thứ tự tăng dần/giảm dần của giá tiền
  - Cập nhật phân trang
Pass
6
Xem chi tiết sách
Click vào Id của sách
Hiển thị modal chi tiết thông tin sách
  - Hiển thị đầy đủ thông tin: Id, Tên sách, Thể loại, Tác giả, Giá tiền, Ngày cập nhật
Pass
7
Thêm sách mới
Click nút "Add new"
  - Điền thông tin sách mới:
   + Tên sách: "Đắc nhân tâm"
   + Thể loại: "Kỹ năng sống"
   + Tác giả: "Dale Carnegie"
   + Giá tiền: 100000
   + Hình ảnh: [file ảnh]
Hiển thị modal thêm sách mới
  - Sau khi thêm thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách sách
   + Đóng modal
Pass
8
Cập nhật thông tin sách
Click icon Edit
  - Cập nhật thông tin:
   + Tên sách: "Đắc nhân tâm (Tái bản)"
   + Giá tiền: 120000
Hiển thị modal cập nhật thông tin
  - Sau khi cập nhật thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách sách
   + Đóng modal
Pass
9
Xóa sách
Click icon Delete
  - Xác nhận xóa
Hiển thị popup xác nhận xóa
  - Sau khi xóa thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách sách
Pass
10
Export danh sách sách
Click nút Export
Tải file CSV chứa danh sách sách
  - File có tên "export-book.csv"
  - File chứa đầy đủ thông tin sách
Pass
11
Import danh sách sách
Click nút Import
  - Chọn file CSV
Hiển thị modal import
  - Sau khi import thành công:
   + Hiển thị thông báo thành công
   + Cập nhật danh sách sách
   + Đóng modal
Pass
12
Xử lý lỗi khi thêm sách
Thêm sách với tên đã tồn tại
Hiển thị thông báo lỗi
  - Không thêm sách mới
  - Giữ nguyên danh sách sách
Pass
13
Xử lý lỗi khi cập nhật sách
Cập nhật với tên đã tồn tại
Hiển thị thông báo lỗi
  - Không cập nhật thông tin
  - Giữ nguyên thông tin cũ
Pass
14
Xử lý lỗi khi xóa sách
Xóa sách không tồn tại
Hiển thị thông báo lỗi
  - Không xóa sách
  - Giữ nguyên danh sách sách
Pass
15
Kiểm tra định dạng hình ảnh
Upload file không phải định dạng JPEG, PNG
Hiển thị thông báo lỗi về định dạng file không hợp lệ
  - Không cho phép upload
Pass
16
Kiểm tra giá tiền âm
Nhập giá tiền: -100000
Hiển thị thông báo lỗi về giá tiền không hợp lệ
  - Không cho phép lưu
Pass

Bảng 4.5: bảng Test chức năng quản lý sách
 
 
 
 
 
 
 
 
 
Test case chức năng quản lý đơn hàng
TH
Mô Tả Tình Huống
Dữ Liệu
Mong Đợi
Fail/Pass
1
Xem danh sách đơn hàng
- Truy cập trang quản lý đơn hàng
- Hiển thị bảng danh sách đơn hàng với các cột: Id, Full Name, Address, Giá tiền, Created At
  - Có phân trang (5 đơn hàng/trang)
  - Sắp xếp theo thời gian đặt (mới nhất lên đầu)
Pass
2
Tìm kiếm đơn hàng theo tên khách hàng
- Tên khách hàng: "Nguyễn Văn A"
- Hiển thị danh sách đơn hàng của khách hàng có tên chứa "Nguyễn Văn A"
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
3
Tìm kiếm đơn hàng theo địa chỉ
- Địa chỉ: "Hà Nội"
- Hiển thị danh sách đơn hàng có địa chỉ chứa "Hà Nội"
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
4
Tìm kiếm đơn hàng theo ngày tạo
- Date Range: [01/01/2024 - 31/01/2024]
- Hiển thị danh sách đơn hàng được tạo trong khoảng thời gian này
  - Cập nhật phân trang theo kết quả tìm kiếm
Pass
5
Sắp xếp theo ngày tạo
- Click vào cột Created At
- Sắp xếp danh sách đơn hàng theo thứ tự tăng dần/giảm dần của ngày tạo
  - Cập nhật phân trang
Pass
6
Xem chi tiết đơn hàng
- Click vào Id của đơn hàng
- Hiển thị modal chi tiết thông tin đơn hàng
  - Hiển thị đầy đủ thông tin:
   + Thời gian đặt
   + Thông tin khách hàng
   + Phương thức thanh toán
   + Đơn vị vận chuyển
   + Chi tiết sản phẩm
   + Chi phí ship
   + Giảm giá
   + Thuế
   + Tổng tiền
Pass
7
Cập nhật trạng thái đơn hàng (Chờ xác nhận)
- Đơn hàng ở trạng thái "Chờ xác nhận"
  - Chọn trạng thái mới: "Đã xác nhận"
- Cập nhật trạng thái thành công
  - Hiển thị thông báo thành công
  - Cập nhật danh sách đơn hàng
Pass
8
Cập nhật trạng thái đơn hàng (Đã xác nhận)
- Đơn hàng ở trạng thái "Đã xác nhận"
  - Chọn trạng thái mới: "Đang giao hàng"
- Cập nhật trạng thái thành công
  - Hiển thị thông báo thành công
  - Cập nhật danh sách đơn hàng
Pass
9
Cập nhật trạng thái đơn hàng (Đang giao hàng)
- Đơn hàng ở trạng thái "Đang giao hàng"
  - Chọn trạng thái mới: "Giao hàng thành công"
- Cập nhật trạng thái thành công
  - Hiển thị thông báo thành công
  - Cập nhật danh sách đơn hàng
Pass
10
Cập nhật trạng thái đơn hàng (Đã hoàn thành)
- Đơn hàng ở trạng thái "Giao hàng thành công"
  - Thử thay đổi trạng thái
- Không cho phép thay đổi trạng thái
  - Hiển thị thông báo lỗi
Pass
11
Cập nhật trạng thái đơn hàng (Đã hủy)
- Đơn hàng ở trạng thái "Đã hủy"
  - Thử thay đổi trạng thái
- Không cho phép thay đổi trạng thái
  - Hiển thị thông báo lỗi
Pass
12
Cập nhật trạng thái đơn hàng (Giao hàng thất bại)
- Đơn hàng ở trạng thái "Giao hàng thất bại"
  - Thử thay đổi trạng thái
- Không cho phép thay đổi trạng thái
  - Hiển thị thông báo lỗi
Pass
13
Cập nhật trạng thái không chọn
- Không chọn trạng thái mới
- Không cho phép cập nhật
  - Hiển thị thông báo yêu cầu chọn trạng thái
Pass
14
Hủy đơn hàng
- Đơn hàng ở trạng thái "Chờ xác nhận"
  - Chọn trạng thái: "Đã hủy"
- Cập nhật trạng thái thành công
  - Tăng số lượng sản phẩm trong kho
  - Hiển thị thông báo thành công
Pass
15
Giao hàng thất bại
- Đơn hàng ở trạng thái "Đang giao hàng"
  - Chọn trạng thái: "Giao hàng thất bại"
- Cập nhật trạng thái thành công
  - Tăng số lượng sản phẩm trong kho
  - Hiển thị thông báo thành công
Pass

Bảng 4.6: bảng Test case chức năng quản lý đơn hàng

 
Test case chức năng báo cáo thống kê
TH
Mô Tả Tình Huống
Dữ Liệu
Mong Đợi
Fail/Pass
1
Thống kê top sản phẩm bán chạy
- Truy cập trang dashboard
  - Xem phần "Sản phẩm bán chạy nhất"
- Hiển thị danh sách sản phẩm bán chạy
  - Hiển thị số lượng bán của từng sản phẩm
  - Chỉ hiển thị sản phẩm đã bán và thanh toán thành công
  - Sắp xếp theo số lượng bán giảm dần
Pass
2
Thống kê khách hàng mua nhiều nhất
- Truy cập trang dashboard
  - Xem phần "Top Customers"
- Hiển thị danh sách khách hàng mua nhiều nhất
  - Hiển thị thông tin:
   + Tên khách hàng
   + Hình ảnh
   + Tổng tiền đã mua
   + Số đơn hàng đã mua
  - Sắp xếp theo tổng tiền mua giảm dần
Pass
3
Thống kê tổng số đơn hàng
- Truy cập trang dashboard
  - Xem phần "Tổng Đơn hàng"
- Hiển thị tổng số đơn hàng
  - Bao gồm tất cả trạng thái:
   + Giao thành công
   + Giao thất bại
   + Chờ xác nhận
   + Đã xác nhận
   + Đang giao hàng
  - Số liệu khớp với bảng quản lý đơn hàng
Pass
4
Thống kê đơn hàng đã giao
- Truy cập trang dashboard
  - Xem phần "Orders By Status"
- Hiển thị số đơn hàng đã giao thành công
  - Số liệu khớp với bảng quản lý đơn hàng
Pass
5
Thống kê tổng doanh thu
- Truy cập trang dashboard
  - Xem phần "Real Time Revenue"
- Hiển thị tổng doanh thu
  - Chỉ tính các đơn hàng giao thành công
  - Hiển thị theo định dạng tiền tệ VND
Pass
6
Thống kê tổng khách hàng
- Truy cập trang dashboard
  - Xem phần "Tổng Users"
- Hiển thị tổng số khách hàng đã đăng ký
  - Số liệu khớp với bảng quản lý user
Pass
7
Thống kê đánh giá sản phẩm
- Truy cập trang dashboard
  - Xem phần "Customer Reviews"
- Hiển thị tổng số đánh giá sản phẩm
  - Hiển thị chi tiết:
   + Số sao trung bình
   + Số lượng đánh giá theo từng sao
   + Danh sách đánh giá mới nhất
Pass
8
Thống kê doanh thu theo thời gian
- Truy cập trang dashboard
  - Xem phần "Revenue Trends"
- Hiển thị biểu đồ doanh thu theo thời gian
  - Có thể chọn khoảng thời gian:
   + Ngày
   + Tuần
   + Tháng
   + Năm
Pass
9
Thống kê hiệu suất bán hàng
- Truy cập trang dashboard
  - Xem phần "Sales Performance"
- Hiển thị các chỉ số:
   + Doanh thu
   + Số đơn hàng
   + Giá trị đơn hàng trung bình
   + Tỷ lệ chuyển đổi
Pass
10
Xuất báo cáo thống kê
- Truy cập trang dashboard
  - Click nút "Export Report"
- Cho phép xuất báo cáo theo:
   + Khoảng thời gian
   + Loại báo cáo
  - Xuất file Excel/PDF
  - Báo cáo chứa đầy đủ thông tin thống kê
Pass

Bảng 4.7: bảng Test case chức năng báo cáo thống kê
