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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Chip,
  Typography,
} from "@mui/material";
import {
  PersonOutline,
  MailOutline,
  PhoneOutlined,
  AdminPanelSettings,
  Person,
} from "@mui/icons-material";
import DataTable, { createDateColumn } from "../../components/Common/DataTable";
import { UserService } from "../../services/UserService";
import { User, CreateUserRequest, UpdateUserRequest } from "../../models/User";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    username: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    photoUrl: "",
    bio: "",
    position: "",
    role: "user" as "admin" | "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = users.filter((item) => {
      const nameMatch =
        item.username?.toLowerCase().includes(lowercasedFilter) || false;
      const emailMatch =
        item.email?.toLowerCase().includes(lowercasedFilter) || false;
      const phoneMatch = item.phone?.includes(lowercasedFilter) || false;
      return nameMatch || emailMatch || phoneMatch;
    });
    setFilteredUsers(filteredData);
  }, [searchTerm, users]);

  const validate = (): boolean => {
    const tempErrors = { email: "", username: "", phone: "" };
    let isValid = true;

    if (!formData.username.trim()) {
      isValid = false;
      tempErrors.username = "Tên người dùng không được để trống.";
    }

    if (!formData.email.trim()) {
      isValid = false;
      tempErrors.email = "Email không được để trống.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      isValid = false;
      tempErrors.email = "Email không đúng định dạng.";
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      isValid = false;
      tempErrors.phone = "Số điện thoại phải có 10 hoặc 11 chữ số.";
    }

    setFormErrors(tempErrors);
    return isValid;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getAllUsers();
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Lỗi khi tải danh sách người dùng", "error");
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

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        username: user.username,
        phone: user.phone || "",
        photoUrl: user.photoUrl || "",
        bio: user.bio || "",
        position: user.position || "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        username: "",
        phone: "",
        photoUrl: "",
        bio: "",
        position: "",
        role: "user",
      });
    }
    setFormErrors({ email: "", username: "", phone: "" });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormErrors({ email: "", username: "", phone: "" });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      if (editingUser) {
        const updates: UpdateUserRequest = {
          username: formData.username,
          phone: formData.phone,
          photoUrl: formData.photoUrl,
          bio: formData.bio,
          position: formData.position,
          role: formData.role,
        };
        await UserService.updateUser(editingUser.id, updates);
        showSnackbar("Cập nhật người dùng thành công", "success");
      } else {
        const newUser: CreateUserRequest = {
          email: formData.email,
          username: formData.username,
          phone: formData.phone,
          photoUrl: formData.photoUrl,
          bio: formData.bio,
          position: formData.position,
          role: formData.role,
        };
        await UserService.createUser(newUser);
        showSnackbar("Thêm người dùng thành công", "success");
      }
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showSnackbar("Lỗi khi lưu thông tin người dùng", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await UserService.deleteUser(id);
        showSnackbar("Xóa người dùng thành công", "success");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        showSnackbar("Lỗi khi xóa người dùng", "error");
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "username",
      headerName: "Tên Người Dùng",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonOutline color="primary" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MailOutline fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Số Điện Thoại",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneOutlined fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Vai trò",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value === "admin" ? <AdminPanelSettings /> : <Person />}
          label={params.value === "admin" ? "Admin" : "User"}
          color={params.value === "admin" ? "primary" : "default"}
          size="small"
        />
      ),
    },
    createDateColumn("created_at", "Ngày tạo", true),
  ];

  return (
    <>
      <DataTable
        title="Quản Lý Người Dùng"
        columns={columns}
        rows={filteredUsers}
        loading={loading}
        onAdd={() => handleOpenDialog()}
        onEdit={(id) => {
          const user = users.find((u) => u.id === id);
          if (user) handleOpenDialog(user);
        }}
        onDelete={handleDelete}
        addButtonText="Thêm Người Dùng"
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
          {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!!editingUser}
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              fullWidth
              label="Tên người dùng"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              required
              error={!!formErrors.username}
              helperText={formErrors.username}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
            <TextField
              fullWidth
              label="URL ảnh đại diện"
              value={formData.photoUrl}
              onChange={(e) => handleInputChange("photoUrl", e.target.value)}
            />
            <TextField
              fullWidth
              label="Tiểu sử"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
            />
            <TextField
              fullWidth
              label="Chức vụ"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                alignItems: "flex-start",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.role}
                  label="Vai trò"
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? "Cập nhật" : "Thêm"}
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

export default UsersPage;
