# Bảng điều khiển quản trị ChillWave

Một bảng điều khiển quản trị chuyên nghiệp cho hệ thống âm nhạc ChillWave, được xây dựng bằng React và TypeScript. Ứng dụng này cung cấp chức năng CRUD đầy đủ để quản lý người dùng, nghệ sĩ, bài hát và album với giao diện hiện đại và trực quan.

## ✨ Tính năng

### 🎯 Quản lý toàn diện

- **Bảng điều khiển (Dashboard)**: Tổng quan hệ thống với các số liệu thống kê thời gian thực và hoạt động gần đây.
- **Quản lý người dùng**: CRUD đầy đủ cho người dùng, với phân quyền (quản trị viên/người dùng).
- **Quản lý nghệ sĩ**: Thêm, sửa và xóa nghệ sĩ với thông tin chi tiết.
- **Quản lý bài hát**: Tải lên và quản lý bài hát với siêu dữ liệu hoàn chỉnh.
- **Quản lý album**: Tạo và quản lý album cũng như danh sách bài hát trong đó.

### 🎨 Giao diện & Trải nghiệm người dùng chuyên nghiệp (UI/UX)

- **Material-UI (MUI)**: Thiết kế hiện đại, đáp ứng (responsive).
- **DataGrid**: Bảng dữ liệu mạnh mẽ với chức năng tìm kiếm và sắp xếp phía máy khách.
- **Điều hướng thông minh**: Thanh bên (sidebar) với chức năng tô sáng trang đang hoạt động.
- **Hộp thoại (Modal Dialogs)**: Các biểu mẫu thân thiện với người dùng để nhập dữ liệu.
- **Thông báo (Snackbar)**: Phản hồi thời gian thực cho mọi hoạt động.

### 🔥 Công nghệ cốt lõi

- **React** & **TypeScript**
- **Firebase Firestore** cho cơ sở dữ liệu
- **Material-UI (MUI)** cho các thành phần giao diện
- **React Router** để điều hướng trang
- **Date-fns** để xử lý ngày tháng

## 🏗️ Cấu trúc dự án

```
src/
├── components/
│   ├── Layout/AdminLayout.tsx   # Layout chính với sidebar
│   └── Common/DataTable.tsx     # Component bảng dữ liệu có thể tái sử dụng
├── config/
│   └── firebase.ts            # Cấu hình Firebase
├── models/
│   ├── User.ts                # Interface TypeScript cho Người dùng
│   ├── Artist.ts              # Interface TypeScript cho Nghệ sĩ
│   ├── Song.ts                # Interface TypeScript cho Bài hát
│   └── Album.ts               # Interface TypeScript cho Album
├── services/
│   ├── UserService.ts         # CRUD Firestore cho Người dùng
│   ├── ArtistService.ts       # CRUD Firestore cho Nghệ sĩ
│   ├── SongService.ts         # CRUD Firestore cho Bài hát
│   └── AlbumService.ts        # CRUD Firestore cho Album
├── pages/
│   ├── Dashboard/Dashboard.tsx  # Trang tổng quan
│   ├── Users/UsersPage.tsx      # Trang quản lý người dùng
│   ├── Artists/ArtistsPage.tsx  # Trang quản lý nghệ sĩ
│   ├── Songs/SongsPage.tsx      # Trang quản lý bài hát
│   └── Albums/AlbumsPage.tsx    # Trang quản lý album
└── App.tsx                      # Component App chính với định tuyến (routing)
```

## 🚀 Cài đặt

### Yêu cầu

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

### Cài đặt

```bash
npm install
```

### Cấu hình Firebase

1.  Tạo một dự án trên [Bảng điều khiển Firebase](https://console.firebase.google.com/).
2.  Thiết lập một Cơ sở dữ liệu Firestore.
3.  Trong cài đặt dự án của bạn, tìm đối tượng cấu hình cho ứng dụng web của bạn.
4.  Sao chép cấu hình Firebase của bạn và dán vào `src/config/firebase.ts`.

### Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ có sẵn tại `http://localhost:3000`.

### Xây dựng cho Production

```bash
npm run build
```

## 📊 Lược đồ Firestore (Schema)

Cơ sở dữ liệu sử dụng các collection và lược đồ sau:

#### `users`

```typescript
{
  username: string,
  email: string,
  bio?: string,
  phone?: string,
  photoUrl?: string,
  position?: string,
  role: 'admin' | 'user',
  created_at: Date,
  updatedAt: Date
}
```

#### `artists`

```typescript
{
  artist_name: string,
  artist_images: string,
  bio: string,
  love_count: number
}
```

#### `songs`

```typescript
{
  song_name: string,
  artist_id: string[],
  audio_url: string,
  country: string,
  duration: number | null,
  love_count: number,
  play_count: number,
  song_imageUrl: string,
  year: number
}
```

#### `albums`

```typescript
{
  album_name: string,
  artist_id: string,
  album_imageUrl: string,
  songs_id: string[]
}
```

## 🧑‍💻 Nhà phát triển

- **Tên**: Phan Văn Huy
- **GitHub**: [@PVanHuy](https://github.com/PVanHuy/Admin_Chillwave_App)
- **Email**: huy0812200415@gmail.com

---
