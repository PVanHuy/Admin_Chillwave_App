import React from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Paper, Box, Typography, Button, Chip, TextField } from "@mui/material";
import { Edit, Delete, Add, Visibility, Search } from "@mui/icons-material";

interface DataTableProps {
  title: string;
  columns: GridColDef[];
  rows: any[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  showActions?: boolean;
  addButtonText?: string;
  searchText?: string;
  onSearchTextChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  rows,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  addButtonText = "Thêm mới",
  searchText,
  onSearchTextChange,
}) => {
  const enhancedColumns: GridColDef[] = [
    ...columns,
    ...(showActions
      ? [
          {
            field: "actions",
            type: "actions" as const,
            headerName: "Thao tác",
            flex: 0.5,
            minWidth: 100,
            align: "center" as const,
            headerAlign: "center" as const,
            getActions: (params: GridRowParams) => {
              const actions: React.ReactElement<any>[] = [];

              if (onView) {
                actions.push(
                  <GridActionsCellItem
                    key="view"
                    icon={<Visibility />}
                    label="Xem"
                    onClick={() => onView(params.id as string)}
                    color="primary"
                  />
                );
              }

              if (onEdit) {
                actions.push(
                  <GridActionsCellItem
                    key="edit"
                    icon={<Edit />}
                    label="Sửa"
                    onClick={() => onEdit(params.id as string)}
                    color="primary"
                  />
                );
              }

              if (onDelete) {
                actions.push(
                  <GridActionsCellItem
                    key="delete"
                    icon={<Delete sx={{ color: "error.main" }} />}
                    label="Xóa"
                    onClick={() => onDelete(params.id as string)}
                    color="inherit"
                  />
                );
              }

              return actions;
            },
          },
        ]
      : []),
  ];

  return (
    <Paper
      sx={{ p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            color="text.primary"
          >
            {title}
          </Typography>
          {onSearchTextChange && (
            <TextField
              size="small"
              variant="outlined"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={onSearchTextChange}
              InputProps={{
                startAdornment: (
                  <Search
                    fontSize="small"
                    sx={{ mr: 1, color: "text.disabled" }}
                  />
                ),
              }}
              sx={{
                minWidth: { xs: "auto", sm: 250 },
              }}
            />
          )}
        </Box>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
            }}
          >
            {addButtonText}
          </Button>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={enhancedColumns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: [],
              },
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "grey.50",
              borderRadius: 1,
            },
            "& .MuiDataGrid-cell": {
              borderColor: "grey.200",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default DataTable;

// Helper functions for common column types
export const createStatusColumn = (field: string = "isActive"): GridColDef => ({
  field,
  headerName: "Trạng thái",
  width: 120,
  renderCell: (params) => (
    <Chip
      label={params.value ? "Hoạt động" : "Tạm dừng"}
      color={params.value ? "success" : "error"}
      size="small"
    />
  ),
});

export const createDateColumn = (
  field: string,
  headerName: string,
  showTime: boolean = false
): GridColDef => ({
  field,
  headerName,
  flex: 1.5,
  minWidth: 160,
  align: "left" as const,
  headerAlign: "left" as const,
  valueFormatter: (value: any) => {
    if (!value) return "";
    try {
      const date = new Date(value);
      const dateString = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (showTime) {
        const timeString = date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${timeString} ${dateString}`;
      }
      return dateString;
    } catch (e) {
      return "Ngày không hợp lệ";
    }
  },
});

export const createImageColumn = (field: string = "imageURL"): GridColDef => ({
  field,
  headerName: "Hình ảnh",
  width: 80,
  renderCell: (params) =>
    params.value ? (
      <img
        src={params.value}
        alt=""
        style={{
          width: 40,
          height: 40,
          borderRadius: 4,
          objectFit: "cover",
        }}
      />
    ) : (
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          bgcolor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" color="grey.500">
          N/A
        </Typography>
      </Box>
    ),
  sortable: false,
  filterable: false,
});
