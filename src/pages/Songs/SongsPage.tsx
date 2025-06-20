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
import { SongService } from "../../services/SongService";
import { ArtistService } from "../../services/ArtistService";
import { AlbumService } from "../../services/AlbumService";
import { Song, CreateSongRequest, UpdateSongRequest } from "../../models/Song";
import { Artist } from "../../models/Artist";
import { Album } from "../../models/Album";

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

const SongsPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [searchText, setSearchText] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    albumId: "",
    duration: 0,
    audioURL: "",
    imageURL: "",
    genre: [] as string[],
    releaseDate: new Date(),
    lyrics: "",
    isActive: true,
    isExplicit: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchText.toLowerCase();
    const filteredData = songs.filter((item) => {
      return (
        item.title?.toLowerCase().includes(lowercasedFilter) ||
        item.artistName?.toLowerCase().includes(lowercasedFilter) ||
        item.albumName?.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredSongs(filteredData);
  }, [searchText, songs]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [songData, artistData, albumData] = await Promise.all([
        SongService.getAllSongs(),
        ArtistService.getAllArtists(),
        AlbumService.getAllAlbums(),
      ]);
      setSongs(songData);
      setArtists(artistData);
      setAlbums(albumData);
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleOpenDialog = (song?: Song) => {
    if (song) {
      setEditingSong(song);
      setFormData({
        title: song.title,
        artistId: song.artistId,
        albumId: song.albumId || "",
        duration: song.duration,
        audioURL: song.audioURL,
        imageURL: song.imageURL || "",
        genre: song.genre,
        releaseDate: song.releaseDate,
        lyrics: song.lyrics || "",
        isActive: song.isActive,
        isExplicit: song.isExplicit,
      });
    } else {
      setEditingSong(null);
      setFormData({
        title: "",
        artistId: "",
        albumId: "",
        duration: 0,
        audioURL: "",
        imageURL: "",
        genre: [],
        releaseDate: new Date(),
        lyrics: "",
        isActive: true,
        isExplicit: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSong(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const artist = artists.find((a) => a.id === formData.artistId);
      const album = albums.find((a) => a.id === formData.albumId);

      if (editingSong) {
        const updates: UpdateSongRequest = {
          title: formData.title,
          artistId: formData.artistId,
          albumId: formData.albumId || undefined,
          duration: formData.duration,
          audioURL: formData.audioURL,
          imageURL: formData.imageURL,
          genre: formData.genre,
          releaseDate: formData.releaseDate,
          lyrics: formData.lyrics,
          isActive: formData.isActive,
          isExplicit: formData.isExplicit,
        };
        await SongService.updateSong(editingSong.id, updates);
        showSnackbar("Cập nhật bài hát thành công", "success");
      } else {
        const newSong: CreateSongRequest = {
          title: formData.title,
          artistId: formData.artistId,
          albumId: formData.albumId || undefined,
          duration: formData.duration,
          audioURL: formData.audioURL,
          imageURL: formData.imageURL,
          genre: formData.genre,
          releaseDate: formData.releaseDate,
          lyrics: formData.lyrics,
          isActive: formData.isActive,
          isExplicit: formData.isExplicit,
        };
        await SongService.createSong(newSong);
        showSnackbar("Thêm bài hát thành công", "success");
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error("Error saving song:", error);
      showSnackbar("Lỗi khi lưu thông tin bài hát", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài hát này?")) {
      try {
        await SongService.deleteSong(id);
        showSnackbar("Xóa bài hát thành công", "success");
        fetchData();
      } catch (error) {
        console.error("Error deleting song:", error);
        showSnackbar("Lỗi khi xóa bài hát", "error");
      }
    }
  };

  const columns: GridColDef[] = [
    createImageColumn(),
    { field: "title", headerName: "Tên bài hát", width: 200 },
    { field: "artistName", headerName: "Nghệ sĩ", width: 150 },
    { field: "albumName", headerName: "Album", width: 150 },
    {
      field: "duration",
      headerName: "Thời lượng",
      width: 100,
      valueFormatter: (value: number) => formatDuration(value),
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
    { field: "playCount", headerName: "Lượt phát", width: 100 },
    { field: "likesCount", headerName: "Lượt thích", width: 100 },
    {
      field: "releaseDate",
      headerName: "Năm phát hành",
      width: 120,
      valueGetter: (value: Date) =>
        value ? new Date(value).getFullYear() : "",
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DataTable
        title="Quản lý bài hát"
        columns={columns}
        rows={filteredSongs}
        loading={loading}
        onAdd={() => handleOpenDialog()}
        onEdit={(id) => {
          const song = songs.find((s) => s.id === id);
          if (song) handleOpenDialog(song);
        }}
        onDelete={handleDelete}
        addButtonText="Thêm bài hát"
        searchText={searchText}
        onSearchTextChange={(e) => setSearchText(e.target.value)}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingSong ? "Chỉnh sửa bài hát" : "Thêm bài hát mới"}
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
                label="Tên bài hát"
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

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Album (Tùy chọn)</InputLabel>
                <Select
                  value={formData.albumId}
                  label="Album (Tùy chọn)"
                  onChange={(e) => handleInputChange("albumId", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Không chọn album</em>
                  </MenuItem>
                  {albums
                    .filter((album) => album.artistId === formData.artistId)
                    .map((album) => (
                      <MenuItem key={album.id} value={album.id}>
                        {album.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Thời lượng (giây)"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value) || 0)
                }
                required
              />
            </Box>

            <TextField
              fullWidth
              label="URL file âm thanh"
              value={formData.audioURL}
              onChange={(e) => handleInputChange("audioURL", e.target.value)}
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
              <DatePicker
                label="Ngày phát hành"
                value={formData.releaseDate}
                onChange={(date) =>
                  handleInputChange("releaseDate", date || new Date())
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>

            <TextField
              fullWidth
              label="Lời bài hát"
              value={formData.lyrics}
              onChange={(e) => handleInputChange("lyrics", e.target.value)}
              multiline
              rows={4}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                  />
                }
                label="Kích hoạt bài hát"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isExplicit}
                    onChange={(e) =>
                      handleInputChange("isExplicit", e.target.checked)
                    }
                  />
                }
                label="Nội dung nhạy cảm"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSong ? "Cập nhật" : "Thêm"}
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

export default SongsPage;
