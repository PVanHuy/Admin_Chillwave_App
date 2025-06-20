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
import { PersonOutline, MailOutline, PhoneOutlined } from "@mui/icons-material";
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

  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    phoneNumber: "",
    photoURL: "",
    role: "user" as "admin" | "user",
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = users.filter((item) => {
      const nameMatch =
        item.displayName?.toLowerCase().includes(lowercasedFilter) || false;
      const emailMatch =
        item.email?.toLowerCase().includes(lowercasedFilter) || false;
      const phoneMatch = item.phoneNumber?.includes(lowercasedFilter) || false;
      return nameMatch || emailMatch || phoneMatch;
    });
    setFilteredUsers(filteredData);
  }, [searchTerm, users]);

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
        displayName: user.displayName,
        phoneNumber: user.phoneNumber || "",
        photoURL: user.photoURL || "",
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        displayName: "",
        phoneNumber: "",
        photoURL: "",
        role: "user",
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        const updates: UpdateUserRequest = {
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber,
          photoURL: formData.photoURL,
          role: formData.role,
          isActive: formData.isActive,
        };
        await UserService.updateUser(editingUser.id, updates);
        showSnackbar("Cập nhật người dùng thành công", "success");
      } else {
        const newUser: CreateUserRequest = {
          email: formData.email,
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber,
          photoURL: formData.photoURL,
          role: formData.role,
          isActive: formData.isActive,
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
      field: "displayName",
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
      field: "phoneNumber",
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
    createDateColumn("createdAt", "Ngày tạo", true),
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
            />
            <TextField
              fullWidth
              label="Tên hiển thị"
              value={formData.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
            <TextField
              fullWidth
              label="URL ảnh đại diện"
              value={formData.photoURL}
              onChange={(e) => handleInputChange("photoURL", e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                alignItems: "flex-start",
              }}
            >
              <FormControl sx={{ flex: 1 }}>
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
