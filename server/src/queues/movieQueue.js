import Movie from '../models/Movie.js';

// Movie data to seed
const movieData = [
    {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        rating: 9.3,
        releaseDate: new Date('1994-09-23'),
        duration: 142,
        genre: ['Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
    },
    {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        rating: 9.2,
        releaseDate: new Date('1972-03-24'),
        duration: 175,
        genre: ['Crime', 'Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
    },
    {
        title: 'The Godfather: Part II',
        description: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
        rating: 9.0,
        releaseDate: new Date('1974-12-20'),
        duration: 202,
        genre: ['Crime', 'Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
    },
    {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        rating: 9.0,
        releaseDate: new Date('2008-07-18'),
        duration: 152,
        genre: ['Action', 'Crime', 'Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'
    }
];

// Simple in-memory queue implementation
class MemoryQueue {
    constructor() {
        this.jobs = [];
        this.processCallback = null;
    }

    add(data, options = {}) {
        return new Promise((resolve) => {
            if (options.delay) {
                setTimeout(() => {
                    this.jobs.push(data);
                    if (this.processCallback) {
                        this.processCallback(data);
                    }
                    resolve({ id: Date.now().toString() });
                }, options.delay);
            } else {
                this.jobs.push(data);
                if (this.processCallback) {
                    this.processCallback(data);
                }
                resolve({ id: Date.now().toString() });
            }
        });
    }

    process(callback) {
        this.processCallback = callback;
        // Process any existing jobs
        this.jobs.forEach(callback);
        return this;
    }
}

const movieQueue = new MemoryQueue();

movieQueue.process(async (job) => {
    try {
        const { index } = job;

        if (index < movieData.length) {
            const movie = movieData[index];

            await Movie.findOneAndUpdate(
                { title: movie.title },
                movie,
                { upsert: true, new: true }
            );

            console.log(`Successfully added movie: ${movie.title}`);

            if (index < movieData.length - 1) {
                await movieQueue.add({ index: index + 1 }, { delay: 1000 });
            } else {
                console.log('All movies have been processed');
            }
        }
    } catch (error) {
        console.error('Queue processing error:', error);
        throw error;
    }
});

export const startMovieQueue = async () => {
    try {
        const existingCount = await Movie.countDocuments();

        if (existingCount === 0) {
            console.log('Starting movie queue to seed initial data');
            await movieQueue.add({ index: 0 });
        } else {
            console.log(`Database already contains ${existingCount} movies`);
        }
    } catch (error) {
        console.error('Error starting movie queue:', error);
    }
};

export default movieQueue;
