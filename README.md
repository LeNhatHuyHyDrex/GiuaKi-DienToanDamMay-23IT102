# Giữa Kỳ Điện Toán Đám Mây - 23IT102

Hệ thống Web Quản lý Sách được thiết kế chuẩn hạ tầng Điện toán đám mây: **Bảo mật phân quyền (Least Privilege)**, **Kiến trúc Stateless (Auto-scaling)** và **Quy trình DevOps chuẩn**.

---

## 1. Thông Tin Sinh Viên & Thông Số Đề Bài
- **Họ và tên**: Lê Nhật Huy
- **MSSV**: `23IT102`
- **Lớp**: `23SE2`
- **Database Atlas**: `DB_23IT102`
- **Quy tắc mã sản phẩm**: Tiền tố bắt buộc là 3 số cuối MSSV: `102` (VD: `102001`, `102ABC`)
- **Công thức VAT**: `(Chữ số cuối MSSV + 5)%` = `(2 + 5)%` = **`7%`**
- **Giá sau thuế**: Tự động tính toán trước khi lưu xuống Cloud MongoDB Atlas: `priceAfterTax = priceBeforeTax * 1.07`

---

## 2. Đáp Ứng 4 Tiêu Chí Đề Bài

### Tiêu chí 1: Kiến trúc Bảo mật Cơ sở dữ liệu Cloud (2.5 điểm)
- Database mang tên `DB_23IT102` trên **MongoDB Atlas**.
- Nguyên tắc đặc quyền tối thiểu (**Least Privilege**):
  - **Tài khoản Đọc**: `read_23IT102` (Chỉ có quyền `read` trên database `DB_23IT102`).
  - **Tài khoản Ghi**: `write_23IT102` (Quyền `readWrite` trên database `DB_23IT102` phục vụ thêm sách và lưu trữ session).
  - Network Access: Cho phép IP `0.0.0.0/0` (Allow Access from Anywhere) để cloud server và local kết nối được.

### Tiêu chí 2: Logic Backend & Kiến trúc Stateless (4.5 điểm)
- **Đa luồng kết nối**:
  - `src/config/database.js` khởi tạo đồng thời 2 connection riêng biệt: `readConnection` và `writeConnection`.
  - Mongoose models tách bạch: `ReadBook` và `WriteBook`.
  - Query `find()` tự động điều hướng qua tài khoản Đọc.
  - Query `create()` tự động điều hướng qua tài khoản Ghi.
- **Stateless Session (Auto-scaling)**:
  - Tuyệt đối không lưu session trong bộ nhớ RAM của server.
  - Cấu hình `express-session` kết hợp `connect-mongo` lưu trữ tập trung phiên làm việc trực tiếp vào MongoDB Atlas tại collection `sessions`.
  - Hỗ trợ reverse proxy với `app.set('trust proxy', 1)`.
- **Thuật toán cá nhân hóa**:
  - Middleware `validateBook` kiểm tra tiền tố 3 số cuối MSSV (`102`). Nếu không thỏa mãn, từ chối xử lý và báo lỗi ngay tại tầng middleware.
  - Tính thuế VAT tự động `7%` và cập nhật `priceAfterTax` trước khi ghi vào MongoDB.
  - Footer trang web hiển thị đầy đủ: `Họ tên: Lê Nhật Huy | MSSV: 23IT102 | Lớp: 23SE2 | Mức VAT áp dụng: 7%`.

### Tiêu chí 3: Quản lý Mã Nguồn & Kiểm Soát DevOps (1.5 điểm)
- Cấu hình `.gitignore` chặn hoàn toàn file `.env`, `node_modules/` và các tài liệu nhạy cảm.
- Lịch sử Git được bóc tách trên 02 nhánh tính năng:
  - `feature/database`: Cấu hình kết nối DB read/write.
  - `feature/session`: Cấu hình stateless session và logic ứng dụng.
  - Cả 2 nhánh đã được merge về `main` với các nút gộp (Merge Node) được bảo lưu đầy đủ trên cây Git (`--no-ff`).

### Tiêu chí 4: Triển Khai Hệ Thống Thực Tế (1.5 điểm)
- Mã nguồn đẩy lên GitHub ở chế độ **Private**, cấp quyền Collaborator cho Giảng viên.
- Triển khai ứng dụng chạy trực tuyến 24/7 trên nền tảng PaaS (**Render** hoặc **Vercel**). Toàn bộ chuỗi kết nối và bí mật được thiết lập qua giao diện Environment Variables của Cloud.

---

## 3. Cấu Trúc Biến Môi Trường (`.env`)

Tạo file `.env` từ `.env.example`:

```env
PORT=3000
NODE_ENV=development
MSSV=23IT102
FULL_NAME=Le Nhat Huy
CLASS_NAME=23SE2
MONGODB_READ_URI=mongodb+srv://read_23IT102:<MAT_KHAU>@<CLUSTER>.mongodb.net/DB_23IT102
MONGODB_WRITE_URI=mongodb+srv://write_23IT102:<MAT_KHAU>@<CLUSTER>.mongodb.net/DB_23IT102
MONGODB_SESSION_URI=mongodb+srv://write_23IT102:<MAT_KHAU>@<CLUSTER>.mongodb.net/DB_23IT102
SESSION_SECRET=chuoi-bi-mat-ngau-nhien-it102
```

---

## 4. Hướng Dẫn Chạy Cục Bộ (Local)

1. Cài đặt thư viện:
   ```bash
   npm install
   ```
2. Cấu hình biến môi trường:
   ```bash
   copy .env.example .env
   # Mở file .env và điền connection string thật từ MongoDB Atlas
   ```
3. Chạy ứng dụng:
   ```bash
   npm run dev
   # hoặc
   npm start
   ```
4. Truy cập trình duyệt: `http://localhost:3000`

---

## 5. Hướng Dẫn Deploy Lên Render (PaaS Khuyên Dùng)

1. Đăng nhập [render.com](https://render.com), chọn **New +** -> **Web Service**.
2. Kết nối với repository GitHub: `LeNhatHuyHyDrex/GiuaKi-DienToanDamMay-23IT102`.
3. Điền thông số cấu hình:
   - **Name**: `giuaki-dientoandammay-23it102`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Vào mục **Environment Variables** trên Render và thêm các biến:
   - `NODE_ENV` = `production`
   - `MSSV` = `23IT102`
   - `FULL_NAME` = `Le Nhat Huy`
   - `CLASS_NAME` = `23SE2`
   - `MONGODB_READ_URI` = *(Connection string của user read_23IT102)*
   - `MONGODB_WRITE_URI` = *(Connection string của user write_23IT102)*
   - `MONGODB_SESSION_URI` = *(Connection string của user write_23IT102)*
   - `SESSION_SECRET` = *(Chuỗi bí mật bất kỳ)*
5. Bấm **Deploy Web Service** và lấy đường dẫn URL trực tuyến (VD: `https://giuaki-dientoandammay-23it102.onrender.com`).

---

## 6. Dữ Liệu Mẫu (Sample Data)

Trong thư mục `data/books-import.json` đã có sẵn 3 bản ghi chuẩn:
- Mã sản phẩm đều có tiền tố `102` (`102001`, `102002`, `102003`).
- Thuế VAT `7%`.
- Có thể dùng tính năng Import của MongoDB Compass/Atlas vào collection `books` thuộc database `DB_23IT102`.
