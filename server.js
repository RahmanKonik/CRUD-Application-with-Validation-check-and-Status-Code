

// app, express and port variable

const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

// logging enable.
// used the 'dev' format

// GET /movies 200 3.453 ms - 128
// request, / routes, request status, processing time, size ofthe response in byte.

app.use(morgan("dev"));

// Movies data

const movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
    { id: 4, title: "Avater", director: "Jomes Cameron", year: 2009 },
    { id: 5, title: " Avater-2: The way of the water ", director: "Jomes Cameron", year: 2022 }
];

// middleware to parse json format data

app.use(express.json());


// GET request for all movies data.

// and filtering the movies info by query parameters.

app.get('/movies', (req, res) => {

    const{ title, director, year } = req.query;

    let movieFilters = movies;

    // filtering based on title by query parameters.
    if( title) {

        movieFilters = movieFilters.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));

    }

    // filtering based on title by query parameters.
    if( director) {

        movieFilters = movieFilters.filter(movie => movie.director.toLowerCase().includes(director.toLowerCase()));

    }

    // filtering based on title by query parameters.
    if( year) {

        const filterYear = parseInt(year);

        if(!isNaN(filterYear)) {

            movieFilters = movieFilters.filter(movie => movie.year === filterYear);

        } else {
            return res.status(400).json({ message: "you must have a valid year."})
        }

    }

    // checking if no match or find any movies by filtering.

    if(movieFilters.length === 0){
        return res.status(400).json({ message: " Not found movies by this matching  criteria."});
    }

    // displaying the based filtering data in json format.
    res.json(movieFilters);
} );

// GET request for a specific data by its ID number.
app.get('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find( m => m.id === movieId);

    if ( movie) {
        res.json(movie);
    } else {
        res.status(404).json({message: 'Movie not found' });
    }
});

// POST request for create a new movie data and validation check and successful state code.
app.post('/movies', (req, res) => {
    // const newMovies = req.body;
    // validation checking
    const {title, director, year } = req.body;

    if( !title || !director || year === undefined ) {

        return res.status(400).json({ message: " title, director and year are required."});
    }

    if( typeof year !== 'number' || year < 1888 || year > new Date().getFullYear()) {
       return res.status(400).json({ message: "you must put a valid value within a realistic range."})
    }
    const newMovies = {
        id: movies.length + 1,
        title,
        director,
        year
    };

    movies.push(newMovies);
    res.status(201).json(newMovies);
});

// PUT request for update a movie info by it's id
app.put('/movies/:id', (req, res) => {

    const movieID = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieID);

    if(movieIndex === -1) {
       return res.status(404).json({message: "Movie not found"});
    }

    // validattion checking
    const { title, director, year } = req.body;

    if( !title || !director || year === undefined){
        return res.status(404).json({ message: "title , director and name are required"});
    }

    if( typeof year !== 'number' || year < 1888 || year > new Date().getFullYear()) {
        return res.status(404).json({ message: "you must input a valid year within a realistic range"});
    }

    movies[movieIndex] = { id: movieID, title, director, year};
    res.json(movies[movieIndex]);
});

// Delete a request fore delete a movie from movies data by it's id.

app.delete('/movies/:id', (req, res) => {
    const moviesID = parseInt(req.params.id);
    const moviesINdex = movies.findIndex( m => m.id === moviesID);

    if( moviesINdex !== -1) {
        const movieDelete = movies.splice(moviesINdex, 1);
        res.json({message: "Deleted movie.", movieDelete});
    } else {
        res.status(404).json({ message: " Movie not found" });
    }
});


// Starting the server...

app.listen(port, () => {

    console.log(`Server is running on the: http://localhost:${port}`);
});