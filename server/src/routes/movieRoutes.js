import express from 'express';
import Movie from '../models/Movie.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const movies = await Movie.find()
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Movie.countDocuments();

        res.json({
            movies,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                limit,
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Get movies error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const movies = await Movie.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Movie.countDocuments({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        });

        res.json({
            movies,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                limit,
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Search movies error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/sorted', async (req, res) => {
    try {
        const { by = 'rating' } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const validSortFields = ['title', 'rating', 'releaseDate', 'duration'];
        const sortField = validSortFields.includes(by) ? by : 'rating';
        const sortOrder = sortField === 'rating' ? -1 : 1;

        const movies = await Movie.find()
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await Movie.countDocuments();

        res.json({
            movies,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                limit,
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Sorted movies error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        console.error('Get movie error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, rating, releaseDate, duration, genre, posterUrl } = req.body;

        const movie = new Movie({
            title,
            description,
            rating,
            releaseDate,
            duration,
            genre,
            posterUrl
        });

        await movie.save();

        res.status(201).json(movie);
    } catch (error) {
        console.error('Add movie error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, rating, releaseDate, duration, genre, posterUrl } = req.body;

        const movie = await Movie.findByIdAndUpdate(
            id,
            {
                title,
                description,
                rating,
                releaseDate,
                duration,
                genre,
                posterUrl
            },
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        console.error('Update movie error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findByIdAndDelete(id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Delete movie error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
