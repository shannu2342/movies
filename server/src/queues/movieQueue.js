import Bull from 'bull';
import Movie from '../models/Movie.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const movieQueue = new Bull('movieQueue', REDIS_URL);

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
    },
    {
        title: '12 Angry Men',
        description: 'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
        rating: 9.0,
        releaseDate: new Date('1957-04-10'),
        duration: 96,
        genre: ['Crime', 'Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg'
    },
    {
        title: "Schindler's List",
        description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution.',
        rating: 8.9,
        releaseDate: new Date('1993-12-15'),
        duration: 195,
        genre: ['Biography', 'Drama', 'History'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg'
    },
    {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        rating: 8.9,
        releaseDate: new Date('1994-10-14'),
        duration: 154,
        genre: ['Crime', 'Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        rating: 8.9,
        releaseDate: new Date('2003-12-17'),
        duration: 201,
        genre: ['Action', 'Adventure', 'Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
    },
    {
        title: 'The Good, the Bad and the Ugly',
        description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
        rating: 8.8,
        releaseDate: new Date('1966-12-23'),
        duration: 161,
        genre: ['Western'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_.jpg'
    },
    {
        title: 'Fight Club',
        description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
        rating: 8.8,
        releaseDate: new Date('1999-10-15'),
        duration: 139,
        genre: ['Drama'],
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjJmYTNkNmItYjYyZC00MGUxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
    }
];

movieQueue.process(async (job) => {
    try {
        const { index } = job.data;

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
