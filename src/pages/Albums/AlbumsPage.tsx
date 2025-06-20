import React, { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Chip,
  Box,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DataTable, {
  createStatusColumn,
  createDateColumn,
  createImageColumn,
} from "../../components/Common/DataTable";
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

const GENRES = [
  "Pop",
  "Rock",
  "Hip Hop",
  "R&B",
  "Country",
  "Jazz",
  "Classical",
  "Electronic",
  "Folk",
  "Blues",
  "Reggae",
  "Punk",
  "Metal",
  "Alternative",
  "Indie",
  "Soul",
];

const ALBUM_TYPES = [
  { value: "album", label: "Album" },
  { value: "single", label: "Single" },
  { value: "ep", label: "EP" },
];

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

  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    description: "",
    imageURL: "",
    genre: [] as string[],
    releaseDate: new Date(),
    trackList: [] as string[],
    isActive: true,
    type: "album" as "album" | "single" | "ep",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = albums.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercasedFilter) ||
        item.artistName.toLowerCase().includes(lowercasedFilter)
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
        title: album.title,
        artistId: album.artistId,
        description: album.description,
        imageURL: album.imageURL || "",
        genre: album.genre,
        releaseDate: album.releaseDate,
        trackList: album.trackList,
        isActive: album.isActive,
        type: album.type,
      });
    } else {
      setEditingAlbum(null);
      setFormData({
        title: "",
        artistId: "",
        description: "",
        imageURL: "",
        genre: [],
        releaseDate: new Date(),
        trackList: [],
        isActive: true,
        type: "album",
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
      const artist = artists.find((a) => a.id === formData.artistId);

      if (editingAlbum) {
        const updates: UpdateAlbumRequest = {
          title: formData.title,
          artistId: formData.artistId,
          description: formData.description,
          imageURL: formData.imageURL,
          genre: formData.genre,
          releaseDate: formData.releaseDate,
          trackList: formData.trackList,
          isActive: formData.isActive,
          type: formData.type,
        };
        await AlbumService.updateAlbum(editingAlbum.id, updates);
        showSnackbar("Cập nhật album thành công", "success");
      } else {
        const newAlbum: CreateAlbumRequest = {
          title: formData.title,
          artistId: formData.artistId,
          description: formData.description,
          imageURL: formData.imageURL,
          genre: formData.genre,
          releaseDate: formData.releaseDate,
          trackList: formData.trackList,
          isActive: formData.isActive,
          type: formData.type,
        };
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
    (song) => song.artistId === formData.artistId
  );

  const columns: GridColDef[] = [
    createImageColumn(),
    { field: "title", headerName: "Tên album", width: 200 },
    { field: "artistName", headerName: "Nghệ sĩ", width: 150 },
    {
      field: "type",
      headerName: "Loại",
      width: 100,
      renderCell: (params) => {
        const typeLabels = { album: "Album", single: "Single", ep: "EP" };
        return (
          <Chip
            label={typeLabels[params.value as keyof typeof typeLabels]}
            size="small"
          />
        );
      },
    },
    {
      field: "genre",
      headerName: "Thể loại",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value?.slice(0, 1).map((genre: string) => (
            <Chip key={genre} label={genre} size="small" />
          ))}
          {params.value?.length > 1 && (
            <Chip
              label={`+${params.value.length - 1}`}
              size="small"
              color="primary"
            />
          )}
        </Box>
      ),
    },
    {
      field: "trackList",
      headerName: "Số bài hát",
      width: 100,
      valueFormatter: (value: string[]) => value?.length || 0,
    },
    { field: "playCount", headerName: "Lượt phát", width: 100 },
    { field: "likesCount", headerName: "Lượt thích", width: 100 },
    createStatusColumn(),
    createDateColumn("releaseDate", "Ngày phát hành"),
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <TextField
                fullWidth
                label="Tên album"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Nghệ sĩ</InputLabel>
                <Select
                  value={formData.artistId}
                  label="Nghệ sĩ"
                  onChange={(e) =>
                    handleInputChange("artistId", e.target.value)
                  }
                >
                  {artists.map((artist) => (
                    <MenuItem key={artist.id} value={artist.id}>
                      {artist.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              multiline
              rows={3}
              required
            />

            <TextField
              fullWidth
              label="URL hình ảnh"
              value={formData.imageURL}
              onChange={(e) => handleInputChange("imageURL", e.target.value)}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Autocomplete
                multiple
                options={GENRES}
                value={formData.genre}
                onChange={(_, value) => handleInputChange("genre", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Thể loại âm nhạc" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }} required>
                <InputLabel>Loại album</InputLabel>
                <Select
                  value={formData.type}
                  label="Loại album"
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  {ALBUM_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                alignItems: "flex-start",
              }}
            >
              <DatePicker
                label="Ngày phát hành"
                value={formData.releaseDate}
                onChange={(date) =>
                  handleInputChange("releaseDate", date || new Date())
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                  />
                }
                label="Kích hoạt album"
                sx={{ mt: 2 }}
              />
            </Box>

            <Autocomplete
              multiple
              options={availableSongs}
              getOptionLabel={(option) => option.title}
              value={availableSongs.filter((song) =>
                formData.trackList.includes(song.id)
              )}
              onChange={(_, value) =>
                handleInputChange(
                  "trackList",
                  value.map((song) => song.id)
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Danh sách bài hát" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.title}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
              disabled={!formData.artistId}
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
    </LocalizationProvider>
  );
};

export default AlbumsPage;
