import React, { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Snackbar,
  Chip,
  Autocomplete,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DataTable from "../../components/Common/DataTable";
import { AlbumService } from "../../services/AlbumService";
import { ArtistService } from "../../services/ArtistService";
import { SongService } from "../../services/SongService";
import {
  Album,
  CreateAlbumRequest,
  UpdateAlbumRequest,
} from "../../models/Album";
import { Artist } from "../../models/Artist";
import { Song } from "../../models/Song";

const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState<CreateAlbumRequest>({
    album_name: "",
    artist_id: "",
    album_imageUrl: "",
    songs_id: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = albums.filter(
      (item) =>
        item.album_name.toLowerCase().includes(lowercasedFilter) ||
        getArtistName(item.artist_id)?.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredAlbums(filteredData);
  }, [searchTerm, albums]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [albumData, artistData, songData] = await Promise.all([
        AlbumService.getAllAlbums(),
        ArtistService.getAllArtists(),
        SongService.getAllSongs(),
      ]);
      setAlbums(albumData);
      setArtists(artistData);
      setSongs(songData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Lỗi khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const getArtistName = (artistId: string) => {
    return artists.find((a) => a.id === artistId)?.artist_name;
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (album?: Album) => {
    if (album) {
      setEditingAlbum(album);
      setFormData({
        album_name: album.album_name,
        artist_id: album.artist_id,
        album_imageUrl: album.album_imageUrl || "",
        songs_id: album.songs_id || [],
      });
    } else {
      setEditingAlbum(null);
      setFormData({
        album_name: "",
        artist_id: "",
        album_imageUrl: "",
        songs_id: [],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAlbum(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editingAlbum) {
        const updates: UpdateAlbumRequest = { ...formData };
        await AlbumService.updateAlbum(editingAlbum.id, updates);
        showSnackbar("Cập nhật album thành công", "success");
      } else {
        const newAlbum: CreateAlbumRequest = { ...formData };
        await AlbumService.createAlbum(newAlbum);
        showSnackbar("Thêm album thành công", "success");
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error("Error saving album:", error);
      showSnackbar("Lỗi khi lưu thông tin album", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa album này?")) {
      try {
        await AlbumService.deleteAlbum(id);
        showSnackbar("Xóa album thành công", "success");
        fetchData();
      } catch (error) {
        console.error("Error deleting album:", error);
        showSnackbar("Lỗi khi xóa album", "error");
      }
    }
  };

  const availableSongs = songs.filter(
    (song) => song.artist_id && song.artist_id.includes(formData.artist_id)
  );

  const columns: GridColDef[] = [
    {
      field: "album_imageUrl",
      headerName: "Hình ảnh",
      width: 80,
      renderCell: (params) => <Avatar src={params.value} variant="rounded" />,
    },
    { field: "album_name", headerName: "Tên album", flex: 2, minWidth: 200 },
    {
      field: "artist_id",
      headerName: "Nghệ sĩ",
      flex: 1.5,
      minWidth: 150,
      valueGetter: (value) => getArtistName(value) || value,
    },
    {
      field: "songs_id",
      headerName: "Số bài hát",
      width: 120,
      align: "center",
      headerAlign: "center",
      valueGetter: (value: string[]) => value?.length || 0,
    },
  ];

  return (
    <>
      <DataTable
        title="Quản lý album"
        columns={columns}
        rows={filteredAlbums}
        loading={loading}
        onAdd={() => handleOpenDialog()}
        onEdit={(id) => {
          const album = albums.find((a) => a.id === id);
          if (album) handleOpenDialog(album);
        }}
        onDelete={handleDelete}
        addButtonText="Thêm album"
        searchText={searchTerm}
        onSearchTextChange={(e) => setSearchTerm(e.target.value)}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAlbum ? "Chỉnh sửa album" : "Thêm album mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="Tên album"
              value={formData.album_name}
              onChange={(e) => handleInputChange("album_name", e.target.value)}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Nghệ sĩ</InputLabel>
              <Select
                value={formData.artist_id}
                label="Nghệ sĩ"
                onChange={(e) => handleInputChange("artist_id", e.target.value)}
              >
                {artists.map((artist) => (
                  <MenuItem key={artist.id} value={artist.id}>
                    {artist.artist_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="URL hình ảnh"
              value={formData.album_imageUrl}
              onChange={(e) =>
                handleInputChange("album_imageUrl", e.target.value)
              }
            />

            <Autocomplete
              multiple
              options={availableSongs}
              getOptionLabel={(option) => option.song_name}
              value={songs.filter((s) => formData.songs_id.includes(s.id))}
              onChange={(_, value) =>
                handleInputChange(
                  "songs_id",
                  value.map((v) => v.id)
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Danh sách bài hát" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.song_name}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
              disabled={!formData.artist_id}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAlbum ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlbumsPage;
