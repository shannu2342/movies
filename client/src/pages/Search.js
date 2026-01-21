import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    TextField,
    Pagination,
    CircularProgress,
    Alert,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Search = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery) {
            fetchMovies();
        }
    }, [page]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get(
                `${API_BASE_URL}/movies/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=10`
            );

            setMovies(response.data.movies);
            setTotalPages(response.data.pagination.total);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setError('Failed to search movies');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchMovies();
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Movie App - Search
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Welcome, {user?.name}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box sx={{ width: 250, padding: 2 }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/')}>
                                <HomeIcon sx={{ mr: 2 }} />
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/search')}>
                                <SearchOutlinedIcon sx={{ mr: 2 }} />
                                <ListItemText primary="Search" />
                            </ListItemButton>
                        </ListItem>
                        {isAdmin() && (
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => navigate('/admin')}>
                                    <SettingsIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Admin Dashboard" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Search Movies
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
                    <TextField
                        placeholder="Search movies by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ minWidth: 400 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton type="submit">
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                        <CircularProgress size={48} />
                    </Box>
                ) : (
                    <>
                        {movies.length > 0 ? (
                            <>
                                <Grid container spacing={3}>
                                    {movies.map((movie) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                {movie.posterUrl && (
                                                    <CardMedia
                                                        component="img"
                                                        height="300"
                                                        image={movie.posterUrl}
                                                        alt={movie.title}
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                )}
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <StarIcon sx={{ color: 'gold', mr: 0.5 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {movie.rating}
                                                        </Typography>
                                                    </Box>
                                                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                                                        {movie.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {formatDate(movie.releaseDate)} • {movie.duration} min
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}>
                                                        {movie.description}
                                                    </Typography>
                                                    {movie.genre.length > 0 && (
                                                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                            {movie.genre.slice(0, 3).map((genre, index) => (
                                                                <Typography key={index} variant="caption" sx={{
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '4px'
                                                                }}>
                                                                    {genre}
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    )}
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small">More Info</Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={handlePageChange}
                                            variant="outlined"
                                            color="primary"
                                        />
                                    </Box>
                                )}
                            </>
                        ) : searchQuery ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No movies found matching "{searchQuery}"
                                </Typography>
                            </Box>
                        ) : null}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Search;
