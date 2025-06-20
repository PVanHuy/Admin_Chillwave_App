# ChillWave Admin Dashboard

Ứng dụng quản trị viên cho hệ thống âm nhạc ChillWave - một trang web admin chuyên nghiệp với đầy đủ tính năng CRUD để quản lý người dùng, nghệ sĩ, bài hát và album.

## ✨ Tính năng

### 🎯 Quản lý toàn diện

- **Dashboard**: Tổng quan hệ thống với thống kê và biểu đồ
- **Quản lý người dùng**: CRUD hoàn chỉnh cho users với vai trò admin/user
- **Quản lý nghệ sĩ**: Thêm, sửa, xóa nghệ sĩ với thông tin chi tiết
- **Quản lý bài hát**: Upload và quản lý bài hát với metadata đầy đủ
- **Quản lý album**: Tạo và quản lý album với danh sách bài hát

### 🎨 UI/UX Chuyên nghiệp

- **Material-UI**: Thiết kế hiện đại, responsive
- **DataGrid**: Bảng dữ liệu mạnh mẽ với tìm kiếm, lọc, phân trang
- **Sidebar Navigation**: Điều hướng thông minh với highlight active
- **Modal Dialogs**: Form nhập liệu thân thiện với validation
- **Snackbar Notifications**: Thông báo realtime cho mọi thao tác

### 🔥 Công nghệ hiện đại

- **React 19** với TypeScript
- **Firebase Firestore** cho database
- **Material-UI v7** cho UI components
- **React Router** cho routing
- **Date-fns** cho xử lý ngày tháng

## 🏗️ Cấu trúc dự án

```
src/
├── components/
│   ├── Layout/
│   │   └── AdminLayout.tsx      # Layout chính với sidebar
│   └── Common/
│       └── DataTable.tsx        # Component bảng dữ liệu tái sử dụng
├── config/
│   └── firebase.ts              # Cấu hình Firebase
├── models/
│   ├── User.ts                  # Interface cho User
│   ├── Artist.ts                # Interface cho Artist
│   ├── Song.ts                  # Interface cho Song
│   └── Album.ts                 # Interface cho Album
├── services/
│   ├── UserService.ts           # CRUD operations cho Users
│   ├── ArtistService.ts         # CRUD operations cho Artists
│   ├── SongService.ts           # CRUD operations cho Songs
│   └── AlbumService.ts          # CRUD operations cho Albums
├── pages/
│   ├── Dashboard/
│   │   └── Dashboard.tsx        # Trang tổng quan
│   ├── Users/
│   │   └── UsersPage.tsx        # Quản lý users
│   ├── Artists/
│   │   └── ArtistsPage.tsx      # Quản lý artists
│   ├── Songs/
│   │   └── SongsPage.tsx        # Quản lý songs
│   └── Albums/
│       └── AlbumsPage.tsx       # Quản lý albums
└── App.js                       # Main App component
```

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js 16+
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình Firebase

1. Tạo project trên [Firebase Console](https://console.firebase.google.com/)
2. Tạo Firestore Database
3. Cập nhật cấu hình trong `src/config/firebase.ts` với thông tin project của bạn

### Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build cho production

```bash
npm run build
```

## 📊 Database Schema

### Collections trong Firestore

#### Users

```typescript
{
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  favoriteArtists?: string[];
  favoriteSongs?: string[];
  favoriteAlbums?: string[];
}
```

#### Artists

```typescript
{
  id: string;
  name: string;
  bio: string;
  imageURL?: string;
  country: string;
  genre: string[];
  socialLinks: {
    spotify?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  songsCount: number;
  albumsCount: number;
  followersCount: number;
}
```

#### Songs

```typescript
{
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumName?: string;
  duration: number; // in seconds
  audioURL: string;
  imageURL?: string;
  genre: string[];
  releaseDate: Date;
  lyrics?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  likesCount: number;
  isExplicit: boolean;
}
```

#### Albums

```typescript
{
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  description: string;
  imageURL?: string;
  genre: string[];
  releaseDate: Date;
  trackList: string[]; // song IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  likesCount: number;
  type: 'album' | 'single' | 'ep';
}
```

## 🎨 Tính năng nổi bật

### Dashboard Analytics

- Thống kê tổng quan: số users, artists, songs, albums
- Biểu đồ tăng trưởng theo thời gian
- Hoạt động gần đây
- Các chỉ số quan trọng

### CRUD Operations

- **Create**: Form modal với validation đầy đủ
- **Read**: DataGrid với tìm kiếm, lọc, sắp xếp
- **Update**: Edit inline hoặc modal form
- **Delete**: Xác nhận trước khi xóa

### Advanced Features

- Upload và quản lý files (ảnh, audio)
- Multi-select cho genres, social links
- Date picker cho ngày phát hành
- Status toggle (active/inactive)
- Relationship management (artist-album-song)

## 🔧 Customization

### Thêm field mới

1. Cập nhật interface trong `src/models/`
2. Thêm field vào form trong page component
3. Cập nhật service method

### Thêm page mới

1. Tạo component trong `src/pages/`
2. Thêm route trong `src/App.js`
3. Thêm menu item trong `AdminLayout.tsx`

### Styling

- Cập nhật theme trong `src/App.js`
- Customize component styles trong từng file
- Sử dụng Material-UI sx prop cho inline styling

## 📝 Best Practices

### Code Organization

- Separation of concerns: models, services, components
- Reusable components
- TypeScript interfaces cho type safety
- Consistent naming conventions

### Performance

- Lazy loading cho components
- Memoization cho expensive operations
- Efficient Firebase queries
- Image optimization

### Security

- Input validation
- Firebase security rules
- Authentication checks
- CORS configuration

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Contact

- **Developer**: [Your Name]
- **Email**: [your.email@example.com]
- **Project Link**: [https://github.com/yourusername/chillwave-admin](https://github.com/yourusername/chillwave-admin)

---

⭐ **Nếu project hữu ích, hãy give một star!** ⭐
