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
  Avatar,
  Autocomplete,
} from "@mui/material";
import DataTable from "../../components/Common/DataTable";
import { SongService } from "../../services/SongService";
import { ArtistService } from "../../services/ArtistService";
import { Song, CreateSongRequest, UpdateSongRequest } from "../../models/Song";
import { Artist } from "../../models/Artist";

const SongsPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [searchText, setSearchText] = useState("");

  const [formData, setFormData] = useState<CreateSongRequest>({
    song_name: "",
    artist_id: [],
    audio_url: "",
    country: "",
    duration: 0,
    song_imageUrl: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchText.toLowerCase();
    const filteredData = songs.filter((item) => {
      return item.song_name?.toLowerCase().includes(lowercasedFilter);
    });
    setFilteredSongs(filteredData);
  }, [searchText, songs]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [songData, artistData] = await Promise.all([
        SongService.getAllSongs(),
        ArtistService.getAllArtists(),
      ]);
      setSongs(songData);
      setArtists(artistData.map((a) => ({ ...a, name: a.artist_name })));
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

  const handleOpenDialog = (song?: Song) => {
    if (song) {
      setEditingSong(song);
      setFormData({
        song_name: song.song_name,
        artist_id: song.artist_id,
        audio_url: song.audio_url,
        country: song.country,
        duration: song.duration || 0,
        song_imageUrl: song.song_imageUrl,
        year: song.year,
      });
    } else {
      setEditingSong(null);
      setFormData({
        song_name: "",
        artist_id: [],
        audio_url: "",
        country: "",
        duration: 0,
        song_imageUrl: "",
        year: new Date().getFullYear(),
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
      if (editingSong) {
        const updates: UpdateSongRequest = { ...formData };
        await SongService.updateSong(editingSong.id, updates);
        showSnackbar("Cập nhật bài hát thành công", "success");
      } else {
        const newSong: CreateSongRequest = { ...formData };
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
    {
      field: "song_imageUrl",
      headerName: "Hình ảnh",
      width: 80,
      renderCell: (params) => <Avatar src={params.value} variant="rounded" />,
      sortable: false,
    },
    { field: "song_name", headerName: "Tên bài hát", flex: 2, minWidth: 200 },
    {
      field: "artist_id",
      headerName: "Nghệ sĩ",
      flex: 2,
      minWidth: 180,
      valueGetter: (value: string[]) => {
        if (!value) return "";
        const artistNames = value.map(
          (id) => artists.find((a) => a.id === id)?.artist_name || id
        );
        return artistNames.join(", ");
      },
    },
    { field: "year", headerName: "Năm", width: 100 },
    { field: "play_count", headerName: "Lượt phát", width: 120 },
    { field: "love_count", headerName: "Lượt thích", width: 120 },
  ];

  return (
    <>
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
            <TextField
              fullWidth
              label="Tên bài hát"
              value={formData.song_name}
              onChange={(e) => handleInputChange("song_name", e.target.value)}
              required
            />
            <Autocomplete
              multiple
              options={artists}
              getOptionLabel={(option) => option.artist_name}
              value={artists.filter((artist) =>
                formData.artist_id.includes(artist.id)
              )}
              onChange={(_, value) =>
                handleInputChange(
                  "artist_id",
                  value.map((v) => v.id)
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Nghệ sĩ" required />
              )}
            />
            <TextField
              fullWidth
              label="URL file âm thanh"
              value={formData.audio_url}
              onChange={(e) => handleInputChange("audio_url", e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="URL hình ảnh"
              value={formData.song_imageUrl}
              onChange={(e) =>
                handleInputChange("song_imageUrl", e.target.value)
              }
            />
            <TextField
              fullWidth
              label="Quốc gia"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
            <TextField
              fullWidth
              type="number"
              label="Năm phát hành"
              value={formData.year}
              onChange={(e) =>
                handleInputChange("year", parseInt(e.target.value, 10))
              }
            />
            <TextField
              fullWidth
              type="number"
              label="Thời lượng (giây)"
              value={formData.duration}
              onChange={(e) =>
                handleInputChange("duration", parseInt(e.target.value, 10))
              }
            />
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
    </>
  );
};

export default SongsPage;
