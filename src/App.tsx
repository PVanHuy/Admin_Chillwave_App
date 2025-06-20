import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AdminLayout from "./components/Layout/AdminLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import UsersPage from "./pages/Users/UsersPage";
import ArtistsPage from "./pages/Artists/ArtistsPage";
import SongsPage from "./pages/Songs/SongsPage";
import AlbumsPage from "./pages/Albums/AlbumsPage";
import theme from "./config/theme";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/songs" element={<SongsPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
          </Routes>
        </AdminLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
