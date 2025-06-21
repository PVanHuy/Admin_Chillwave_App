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
} from "@mui/material";
import DataTable from "../../components/Common/DataTable";
import { ArtistService } from "../../services/ArtistService";

// Temporary interfaces to match Firebase structure
interface Artist {
  id: string;
  artist_name: string;
  bio: string;
  artist_images: string;
  love_count: number;
}

interface CreateArtistRequest {
  artist_name: string;
  bio: string;
  artist_images: string;
}

interface UpdateArtistRequest {
  artist_name?: string;
  bio?: string;
  artist_images?: string;
}

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

  const [formData, setFormData] = useState<CreateArtistRequest>({
    artist_name: "",
    bio: "",
    artist_images: "",
  });

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = artists.filter((item) => {
      return item.artist_name?.toLowerCase().includes(lowercasedFilter);
    });
    setFilteredArtists(filteredData);
  }, [searchTerm, artists]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      // Casting the result to the local Artist interface
      const artistData = (await ArtistService.getAllArtists()) as Artist[];
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
        artist_name: artist.artist_name,
        bio: artist.bio,
        artist_images: artist.artist_images || "",
      });
    } else {
      setEditingArtist(null);
      setFormData({
        artist_name: "",
        bio: "",
        artist_images: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingArtist(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editingArtist) {
        const updates: UpdateArtistRequest = {
          artist_name: formData.artist_name,
          bio: formData.bio,
          artist_images: formData.artist_images,
        };
        await ArtistService.updateArtist(editingArtist.id, updates);
        showSnackbar("Cập nhật nghệ sĩ thành công", "success");
      } else {
        const newArtist: CreateArtistRequest = {
          artist_name: formData.artist_name,
          bio: formData.bio,
          artist_images: formData.artist_images,
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
      field: "artist_images",
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
    { field: "artist_name", headerName: "Tên nghệ sĩ", flex: 2, minWidth: 180 },
    {
      field: "bio",
      headerName: "Tiểu sử",
      flex: 3,
      minWidth: 250,
    },
    {
      field: "love_count",
      headerName: "Lượt yêu thích",
      flex: 1,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
      valueGetter: (value) => value || 0,
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
            <TextField
              fullWidth
              label="Tên nghệ sĩ"
              value={formData.artist_name}
              onChange={(e) => handleInputChange("artist_name", e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Tiểu sử"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              multiline
              rows={4}
              required
            />

            <TextField
              fullWidth
              label="URL hình ảnh"
              value={formData.artist_images}
              onChange={(e) =>
                handleInputChange("artist_images", e.target.value)
              }
            />
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
