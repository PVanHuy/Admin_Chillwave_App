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
  Avatar,
} from "@mui/material";
import DataTable from "../../components/Common/DataTable";
import { ArtistService } from "../../services/ArtistService";
import {
  Artist,
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../../models/Artist";

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

const COUNTRIES = [
  "Việt Nam",
  "Hoa Kỳ",
  "Anh",
  "Canada",
  "Úc",
  "Pháp",
  "Đức",
  "Nhật Bản",
  "Hàn Quốc",
  "Trung Quốc",
  "Thái Lan",
  "Singapore",
  "Malaysia",
  "Philippines",
];

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    imageURL: "",
    country: "",
    genre: [] as string[],
    socialLinks: {
      spotify: "" as string | undefined,
      youtube: "" as string | undefined,
      instagram: "" as string | undefined,
      facebook: "" as string | undefined,
    },
    isActive: true,
  });

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = artists.filter((item) => {
      return item.name.toLowerCase().includes(lowercasedFilter);
    });
    setFilteredArtists(filteredData);
  }, [searchTerm, artists]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const artistData = await ArtistService.getAllArtists();
      setArtists(artistData);
      setFilteredArtists(artistData);
    } catch (error) {
      console.error("Error fetching artists:", error);
      showSnackbar("Lỗi khi tải danh sách nghệ sĩ", "error");
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

  const handleOpenDialog = (artist?: Artist) => {
    if (artist) {
      setEditingArtist(artist);
      setFormData({
        name: artist.name,
        bio: artist.bio,
        imageURL: artist.imageURL || "",
        country: artist.country,
        genre: artist.genre,
        socialLinks: {
          spotify: artist.socialLinks?.spotify || "",
          youtube: artist.socialLinks?.youtube || "",
          instagram: artist.socialLinks?.instagram || "",
          facebook: artist.socialLinks?.facebook || "",
        },
        isActive: artist.isActive,
      });
    } else {
      setEditingArtist(null);
      setFormData({
        name: "",
        bio: "",
        imageURL: "",
        country: "",
        genre: [],
        socialLinks: {
          spotify: "",
          youtube: "",
          instagram: "",
          facebook: "",
        },
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingArtist(null);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("socialLinks.")) {
      const socialField = field.split(".")[1];
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingArtist) {
        const updates: UpdateArtistRequest = {
          name: formData.name,
          bio: formData.bio,
          imageURL: formData.imageURL,
          country: formData.country,
          genre: formData.genre,
          socialLinks: formData.socialLinks,
          isActive: formData.isActive,
        };
        await ArtistService.updateArtist(editingArtist.id, updates);
        showSnackbar("Cập nhật nghệ sĩ thành công", "success");
      } else {
        const newArtist: CreateArtistRequest = {
          name: formData.name,
          bio: formData.bio,
          imageURL: formData.imageURL,
          country: formData.country,
          genre: formData.genre,
          socialLinks: formData.socialLinks,
          isActive: formData.isActive,
        };
        await ArtistService.createArtist(newArtist);
        showSnackbar("Thêm nghệ sĩ thành công", "success");
      }
      handleCloseDialog();
      fetchArtists();
    } catch (error) {
      console.error("Error saving artist:", error);
      showSnackbar("Lỗi khi lưu thông tin nghệ sĩ", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nghệ sĩ này?")) {
      try {
        await ArtistService.deleteArtist(id);
        showSnackbar("Xóa nghệ sĩ thành công", "success");
        fetchArtists();
      } catch (error) {
        console.error("Error deleting artist:", error);
        showSnackbar("Lỗi khi xóa nghệ sĩ", "error");
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "imageURL",
      headerName: "Hình ảnh",
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt="Artist"
          sx={{ width: 40, height: 40, borderRadius: 1 }}
          variant="rounded"
        />
      ),
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    { field: "name", headerName: "Tên nghệ sĩ", flex: 2, minWidth: 180 },
    {
      field: "songsCount",
      headerName: "Số bài hát",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "albumsCount",
      headerName: "Số album",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "followersCount",
      headerName: "Followers",
      flex: 1,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <>
      <DataTable
        title="Quản lý nghệ sĩ"
        columns={columns}
        rows={filteredArtists}
        loading={loading}
        onAdd={() => handleOpenDialog()}
        onEdit={(id) => {
          const artist = artists.find((a) => a.id === id);
          if (artist) handleOpenDialog(artist);
        }}
        onDelete={handleDelete}
        addButtonText="Thêm nghệ sĩ"
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
          {editingArtist ? "Chỉnh sửa nghệ sĩ" : "Thêm nghệ sĩ mới"}
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
                label="Tên nghệ sĩ"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              <Autocomplete
                options={COUNTRIES}
                value={formData.country}
                onChange={(_, value) =>
                  handleInputChange("country", value || "")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Quốc gia" required />
                )}
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              fullWidth
              label="Tiểu sử"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
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
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <TextField
                fullWidth
                label="Spotify URL"
                value={formData.socialLinks.spotify}
                onChange={(e) =>
                  handleInputChange("socialLinks.spotify", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="YouTube URL"
                value={formData.socialLinks.youtube}
                onChange={(e) =>
                  handleInputChange("socialLinks.youtube", e.target.value)
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <TextField
                fullWidth
                label="Instagram URL"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  handleInputChange("socialLinks.instagram", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Facebook URL"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  handleInputChange("socialLinks.facebook", e.target.value)
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingArtist ? "Cập nhật" : "Thêm"}
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

export default ArtistsPage;
