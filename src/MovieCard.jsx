import { useState, useEffect } from 'react';
import Modal from './Modal';
import './MovieCard.css';

const MovieCard = (props) => {
    const [isClicked, setIsClicked] = useState(false);
    const [genres, setGenres] = useState([]);
    const [runtime, setRuntime] = useState('');
    const [backdrop, setBackdrop] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        fetchMoreInfo(props.id);
        fetchVideo();
      }, [isClicked])

    const toggleModal = () => {
        setIsClicked(!isClicked);
    }

    const toggleLike = () => {
        setIsLiked(!isLiked);
    }

    const toggleWatched = () => {
        setIsChecked(!isChecked);
    }

    const increaseLikes = () => {
        if (likeCount === 0) {
            const heart = document.getElementById(props.id).querySelector('#like-count');
            setLikeCount(likeCount + 1);
            heart.innerText = `❤️`;
        } else if (likeCount >= 1) {
            const heart = document.getElementById(props.id).querySelector('#like-count');
            setLikeCount(likeCount - 1);
            heart.innerText = `♡`;
        }
    }


    const fetchMoreInfo = async () => {
        const url = `https://api.themoviedb.org/3/movie/${props.id}?language=en-US&api_key=0d7613c1b95dbc61f3dd491c8f802475`
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
            }
          };

          const response = await fetch(url, options);
          const jsonResponse = await response.json();
          setBackdrop(jsonResponse.backdrop_path);
          setGenres(jsonResponse.genres);
          setRuntime(jsonResponse.runtime);
    }

    const fetchVideo = async () => {
        const url = `https://api.themoviedb.org/3/movie/${props.id}/videos?language=en-US&api_key=0d7613c1b95dbc61f3dd491c8f802475`
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
            }
        };

        const response = await fetch(url, options);
        const jsonResponse = await response.json();
        const results = jsonResponse.results;
        let videoKey;
        results.forEach(item => {
            videoKey = item.key;
        });
        setVideoLink(`https://www.youtube.com/embed/${videoKey}`);
    }

    function handleLike() {
        increaseLikes();
        toggleLike();
        if (isLiked) {
            if (props.likedList.some(movie => movie.id === props.id)) {
                const updatedLikedList = props.likedList.filter(movie => movie.id !== props.id);
                props.setLikedList(updatedLikedList);
            }
        } else {
            if (!props.likedList.some(movie => movie.id === props.id)) {
                props.setLikedList(isLikedList => [...isLikedList, { id: props.id, image: props.image, title: props.title }]);
            }
        }
    }

    function handleWatched() {
        toggleWatched();
        if (isChecked) {
            if (props.watchedList.some(movie => movie.id === props.id)) {
                const updatedWatchedList = props.watchedList.filter(movie => movie.id !== props.id);
                props.setWatchedList(updatedWatchedList);
            }
        }else {
            if (!props.watchedList.some(movie => movie.id === props.id)) {
                props.setWatchedList(isWatchedList => [...isWatchedList, {id: props.id, image: props.image, title: props.title}])
            }
        }
    }

    const className = Number(props.rating) < 5 ? 'bad' : Number(props.rating) < 7.5 ? 'okay' : 'good'
    return (
        <div>
            <div className="imageContainer" id={props.id} >
                <img src={props.image} id="movie-poster" onClick={toggleModal} alt={props.title}/>
                <p id="movie-title" >{props.title} </p>
                <label id="check-box"><input type="checkbox" onChange={handleWatched}/>Watched </label>
                <p><span id="movie-rating" className={className}>{props.rating}</span><span id="like-count" onClick={handleLike}> ♡</span></p>
            </div>
            <Modal  id={props.id} isClicked={isClicked} toggleModal={toggleModal} movieTitle={props.title}
            image={props.image} releaseDate={props.releaseDate} movieOverview={props.movieOverview}
            movieGenres={props.movieGenres} runtime={runtime} genres={genres} videoLink={videoLink} backdrop={backdrop}/>
        </div>
    )
}

export default MovieCard
