import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    releaseDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    genre: [{
        type: String
    }],
    posterUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ rating: -1 });
movieSchema.index({ releaseDate: -1 });

export default mongoose.model('Movie', movieSchema);
