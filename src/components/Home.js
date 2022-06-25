import {useEffect, useState} from "react"
import '../App.css'
import axios from 'axios'
import Movie from "./Movie"
import Youtube from 'react-youtube'

import { Container, Center, Heading } from '@chakra-ui/react'
import { FaSearch, FaTimes } from "react-icons/fa";

function App() {
    const MOVIE_API = "https://api.themoviedb.org/3/"
    const SEARCH_API = MOVIE_API + "search/movie"
    const DISCOVER_API = MOVIE_API + "discover/movie"
    const API_KEY = "8f91b528b65bf8ef7aa359232e02a3e3"
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"

    const [playing, setPlaying] = useState(false)
    const [trailer, setTrailer] = useState(null)
    const [movies, setMovies] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [movie, setMovie] = useState({title: "Loading Movies"})

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async (event) => {
        if (event) {
            event.preventDefault()
        }

        const {data} = await axios.get(`${searchKey !== "" ? SEARCH_API : DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
                query: searchKey
            }
        })

        console.log(data.results[0])
        setMovies(data.results)
        setMovie(data.results[0])
        setSearchKey("")

        if (data.results.length) {
            await fetchMovie(data.results[0].id)
        }
    }

    const fetchMovie = async (id) => {
        const {data} = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
        })

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(vid => vid.name === "Official Trailer")
            setTrailer(trailer ? trailer : data.videos.results[0])
        }

        setMovie(data)
    }


    const selectMovie = (movie) => {
        fetchMovie(movie.id)
        setPlaying(false)
        setMovie(movie)
        window.scrollTo(0, 0)
    }

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )

    const clearInput = () => {
        setSearchKey(" ");
        document.getElementById("search").value = "";
    };

    return (
        <>

        <Center pl="15%" pr="10%">
            <header className="center-max-size header">
                <button className="homebutton" onClick={fetchMovies}>Movie App</button>
                <form className="form" onSubmit={fetchMovies}>
                    <input className="search" type="text" id="search"
                        onInput={(event) => setSearchKey(event.target.value)}/>
                    <button className="submit-search" type="submit"> {searchKey ? (<FaSearch />) : (<FaTimes onClick={clearInput} />)}</button>
                </form>
            </header>
        </Center>

            {movies.length ?
                <Container>
                    {movie ?
                        <div className="poster"
                             style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`}}>
                            {playing ?


                                <div className="youtube">
                                    <Youtube
                                        videoId={trailer.key}
                                        opts={
                                            {
                                                width: '100%',
                                                height: '100%',
                                                playerVars: {
                                                    autoplay: 0,
                                                    controls: 1,
                                                    cc_load_policy: 0,
                                                    fs: 0,
                                                    iv_load_policy: 0,
                                                    modestbranding: 0,
                                                    rel: 0,
                                                    showinfo: 0,
                                                },
                                            }
                                        }
                                    />
                                    <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                                    </button>
                                </div> 
                                :
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        {trailer ?
                                            <button className={"button play-video"} onClick={() => setPlaying(true)}
                                                    type="button">Play
                                                Trailer</button>
                                            : 'Sorry, no trailer available'}
                                        <h1>{movie.title}</h1>
                                        <p>{movie.overview}</p>
                                    </div>
                                </div>
                            }
                        </div>
                        : null}

                    <Center pl="15%" pr="10%">
                        <div className="movie-container">
                            {renderMovies()}
                        </div>
                    </Center>
                </Container>
                : <Center> <Heading>UNABLE TO GET MOVIES AT THIS TIME; TRY AGAIN</Heading></Center>}
        </>
    );
}

export default App;
