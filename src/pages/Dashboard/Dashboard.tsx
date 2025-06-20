import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  People,
  Person,
  MusicNote,
  Album as AlbumIcon,
  TrendingUp,
  PlayCircleOutline,
} from "@mui/icons-material";
import { UserService } from "../../services/UserService";
import { ArtistService } from "../../services/ArtistService";
import { SongService } from "../../services/SongService";
import { AlbumService } from "../../services/AlbumService";
import { User } from "../../models/User";
import { Artist } from "../../models/Artist";
import { Song } from "../../models/Song";
import { Album } from "../../models/Album";

interface StatCardData {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    artists: 0,
    songs: 0,
    albums: 0,
  });
  const [recentActivities, setRecentActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [users, artists, songs, albums] = await Promise.all([
          UserService.getAllUsers(),
          ArtistService.getAllArtists(),
          SongService.getAllSongs(),
          AlbumService.getAllAlbums(),
        ]);

        setStats({
          users: users.length,
          artists: artists.length,
          songs: songs.length,
          albums: albums.length,
        });

        // Setup Recent Activities
        const activities = [];
        if (users.length > 0)
          activities.push(`Người dùng mới nhất: ${users[0].displayName}`);
        if (artists.length > 0)
          activities.push(`Nghệ sĩ mới nhất: ${artists[0].name}`);
        if (songs.length > 0)
          activities.push(`Bài hát mới nhất: ${songs[0].title}`);
        if (albums.length > 0)
          activities.push(`Album mới nhất: ${albums[0].title}`);
        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards: StatCardData[] = [
    {
      title: "Tổng người dùng",
      value: stats.users,
      icon: <People fontSize="large" />,
      color: "#3f51b5",
      change: "+12%", // Placeholder
    },
    {
      title: "Nghệ sĩ",
      value: stats.artists,
      icon: <Person fontSize="large" />,
      color: "#f50057",
      change: "+5%", // Placeholder
    },
    {
      title: "Bài hát",
      value: stats.songs,
      icon: <MusicNote fontSize="large" />,
      color: "#ff9800",
      change: "+8%", // Placeholder
    },
    {
      title: "Album",
      value: stats.albums,
      icon: <AlbumIcon fontSize="large" />,
      color: "#4caf50",
      change: "+3%", // Placeholder
    },
  ];

  const StatCard: React.FC<{ stat: StatCardData }> = ({ stat }) => (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {stat.title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {loading ? (
                <LinearProgress sx={{ width: 60 }} />
              ) : (
                stat.value.toLocaleString()
              )}
            </Typography>
            {stat.change && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUp
                  sx={{ color: "success.main", fontSize: 16, mr: 0.5 }}
                />
                <Typography variant="body2" color="success.main">
                  {stat.change}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: stat.color,
              width: 56,
              height: 56,
            }}
          >
            {stat.icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tổng quan về hệ thống quản lý ChillWave
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {statCards.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </Box>

      <Box>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Hoạt động gần đây
          </Typography>
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <LinearProgress />
            ) : (
              recentActivities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 1.5,
                    borderBottom:
                      index < recentActivities.length - 1
                        ? "1px solid"
                        : "none",
                    borderColor: "grey.200",
                  }}
                >
                  <PlayCircleOutline sx={{ color: "primary.main", mr: 2 }} />
                  <Typography variant="body2">{activity}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
