import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StarIcon from '../../../../public/StarIcon'
import GenreButton from '../../atoms/GenreButton/GenreButton'
import DescHeader from '../../atoms/DescHeader/DescHeader'
import DescText from '../../atoms/DescText/DescText'
import Spinner from '../../atoms/Spinner/Spinner'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const formatVoteAverage = (value) => {
  const str = value.toString();
  const [intPart, decimalPart] = str.split(".");

  if (!decimalPart) return intPart;
  if (decimalPart.length === 1) return value.toFixed(1);

  return `${intPart}.${decimalPart.slice(0, 2)}`;
};

const formatReleaseDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
};

const MovieDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS)
        const data = await response.json()

        setMovie(data)

        const hour = Math.floor(data.runtime / 60);
        const minute = data.runtime % 60;

        setTime(`${hour}h ${minute}m`)

      } catch (error) {
        console.error('Failed to fetch movie details', error)
      }
    }

    fetchMovieDetail();

  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates`, API_OPTIONS);
        const data = await resp.json();

        const usRelease = data.results.find(r => r.iso_3166_1 === 'US');
        const certification = usRelease?.release_dates[0]?.certification || "Not Rated";

        setRating(certification);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();

  }, [id])

  if (!movie) return <div className='flex justify-center items-center h-screen'><Spinner /></div>

  return (
    <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-[120px] my-8 md:my-12 p-4 sm:p-8 md:p-10 lg:p-[50px] rounded-[14px] bg-[#0F0D23] shadow-[0px_0px_100px_0px_rgba(171,139,255,0.3),_0px_12px_32px_0px_rgba(206,206,251,0.02)_inset]">
      <div className="title_rating flex flex-col md:flex-row justify-between gap-y-4 mb-6 md:mb-[30px]">
        <div>
          <h2 className='mb-2 md:mb-[16px] text-xl md:text-2xl font-semibold'>{movie.title}</h2>
          <div className='flex flex-wrap items-center gap-x-3 text-[#A8B5DB] text-base md:text-[18px]'>
            <p>{movie.release_date?.split("-")[0] || "Unknown"}</p>
            <span>•</span>
            <p>{rating}</p>
            <span>•</span>
            <p>{time}</p>
          </div>
        </div>

        <div className='vote flex gap-x-2 items-center bg-[#221F3D] rounded-[6px] px-4 py-2 w-fit'>
          <StarIcon />
          <p className="text-white text-sm md:text-base">
            {formatVoteAverage(movie.vote_average)}/10
            <span className="text-[#A8B5DB]"> ({Math.floor(movie.vote_count)}K)</span>
          </p>
        </div>
      </div>

      <div className="content grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-x-[50px]">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full max-w-[400px] mx-auto lg:mx-0 rounded-lg"
        />

        <div className="descs grid gap-y-[20px]">
          {movie.genres && (
            <div className="desc grid grid-cols-1 md:grid-cols-[150px_1fr] gap-y-2 md:gap-x-[50px] items-start">
              <DescHeader text={"Genere"} />
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <GenreButton key={genre.id} name={genre.name} />
                ))}
              </div>
            </div>
          )}

          {movie.overview && (
            <div className="desc grid grid-cols-1 md:grid-cols-[150px_1fr] gap-y-2 md:gap-x-[50px] items-start">
              <DescHeader text={"Overview"} />
              <DescText text={movie.overview} />
            </div>
          )}

          {movie.status && (
            <div className="desc grid grid-cols-1 md:grid-cols-[150px_1fr] gap-y-2 md:gap-x-[50px] items-start">
              <DescHeader text={"Status"} />
              <DescText text={movie.status} />
            </div>
          )}

          {movie.release_date && (
            <div className="desc grid grid-cols-1 md:grid-cols-[150px_1fr] gap-y-2 md:gap-x-[50px] items-start">
              <DescHeader text={"Release Date"} />
              <DescText text={formatReleaseDate(movie.release_date)} />
            </div>
          )}

          <div className="desc grid grid-cols-1 md:grid-cols-[150px_1fr] gap-y-2 md:gap-x-[50px] items-start">
            <DescHeader text="Production Countries" />
            <ul className="flex gap-2 flex-wrap">
              {movie.production_countries.map((country, index) => (
                <li key={country.id} className="flex items-center">
                  <DescText text={country.name} />
                  {index < movie.production_countries.length - 1 && (
                    <span className="ml-2 text-gray-400">•</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="buttons flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <button
              onClick={() => navigate('/')}
              className='cursor-pointer rounded-[6px] px-5 py-2 text-sm md:text-base font-medium text-black md:h-fit'
              style={{ background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }}
            >
              Return Back
            </button>
            <button
              className='rounded-[6px] px-5 py-2 text-sm md:text-base font-medium text-black md:h-fit'
              style={{ background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }}
            >
              <a href={movie.homepage} target='_blank' rel="noreferrer">Visit Homepage</a>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MovieDetail
