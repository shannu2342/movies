import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    Alert,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Snackbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AddMovie = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rating: 5,
        releaseDate: '',
        duration: 0,
        genre: [],
        posterUrl: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const { id } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchMovie();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchMovie = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
            const movie = response.data;

            setFormData({
                title: movie.title,
                description: movie.description,
                rating: movie.rating,
                releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
                duration: movie.duration,
                genre: movie.genre,
                posterUrl: movie.posterUrl,
            });
        } catch (error) {
            console.error('Error fetching movie:', error);
            setError('Failed to load movie');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (formData.rating < 0 || formData.rating > 10) {
            newErrors.rating = 'Rating must be between 0 and 10';
        }

        if (!formData.releaseDate) {
            newErrors.releaseDate = 'Release date is required';
        }

        if (formData.duration <= 0) {
            newErrors.duration = 'Duration must be greater than 0';
        }

        if (formData.genre.length === 0) {
            newErrors.genre = 'At least one genre is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            const movieData = {
                ...formData,
                genre: formData.genre,
            };

            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/movies/${id}`, movieData);
                setSuccessMessage('Movie updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/movies`, movieData);
                setSuccessMessage('Movie added successfully');
                setFormData({
                    title: '',
                    description: '',
                    rating: 5,
                    releaseDate: '',
                    duration: 0,
                    genre: [],
                    posterUrl: '',
                });
            }
        } catch (error) {
            console.error('Error saving movie:', error);
            setError(error.response?.data?.message || 'Failed to save movie');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData({ ...formData, [name]: parseFloat(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, genre: value });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                        {isEditMode ? 'Edit Movie' : 'Add Movie'}
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
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/admin')}>
                                <SettingsIcon sx={{ mr: 2 }} />
                                <ListItemText primary="Admin Dashboard" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/admin')}
                        sx={{ mb: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                    <Typography variant="h4" component="h1">
                        {isEditMode ? 'Edit Movie' : 'Add New Movie'}
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Rating (0-10)"
                                    name="rating"
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    error={!!errors.rating}
                                    helperText={errors.rating}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Duration (minutes)"
                                    name="duration"
                                    type="number"
                                    min="1"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    error={!!errors.duration}
                                    helperText={errors.duration}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Release Date"
                                    name="releaseDate"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.releaseDate}
                                    onChange={handleChange}
                                    error={!!errors.releaseDate}
                                    helperText={errors.releaseDate}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth required error={!!errors.genre}>
                                    <InputLabel>Genres</InputLabel>
                                    <Select
                                        multiple
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleGenreChange}
                                        label="Genres"
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        <MenuItem value="Action">Action</MenuItem>
                                        <MenuItem value="Adventure">Adventure</MenuItem>
                                        <MenuItem value="Animation">Animation</MenuItem>
                                        <MenuItem value="Comedy">Comedy</MenuItem>
                                        <MenuItem value="Crime">Crime</MenuItem>
                                        <MenuItem value="Drama">Drama</MenuItem>
                                        <MenuItem value="Fantasy">Fantasy</MenuItem>
                                        <MenuItem value="Horror">Horror</MenuItem>
                                        <MenuItem value="Mystery">Mystery</MenuItem>
                                        <MenuItem value="Romance">Romance</MenuItem>
                                        <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                                        <MenuItem value="Thriller">Thriller</MenuItem>
                                        <MenuItem value="Western">Western</MenuItem>
                                    </Select>
                                    {errors.genre && (
                                        <FormHelperText>{errors.genre}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Poster URL"
                                    name="posterUrl"
                                    value={formData.posterUrl}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => navigate('/admin')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Save')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => navigate('/admin')}
                    >
                        View Movies
                    </Button>
                }
            />
        </Box>
    );
};

export default AddMovie;
