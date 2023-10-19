"use client";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import {
  RiErrorWarningLine,
  RiEye2Fill,
  RiEye2Line,
  RiEyeFill,
  RiEyeLine,
  RiLoader2Fill,
  RiStarFill,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { AppContext } from "@/app/_context/AppContext";
import { getGenres } from "@/app/tools/handlers/FetchMovie";
const MoviesList = () => {
  const { fetching, setTotalPages, setCurrentCategory, fetchData } =
    useContext(AppContext);
  const searchParams = useSearchParams();

  const getMovies = async () => {
    const response = await fetch(
      `${
        !searchParams.get("search")
          ? `https://api.themoviedb.org/3/movie/popular?api_key=3933f04d7e157db6a1139691e02664bf&language=pt-BR&page=${
              searchParams.get("page") ? searchParams.get("page") : 1
            } `
          : `https://api.themoviedb.org/3/search/movie?query=${searchParams.get(
              "search"
            )}&include_adult=false&api_key=3933f04d7e157db6a1139691e02664bf&language=pt-BR&page=${
              searchParams.get("page") ? searchParams.get("page") : 1
            }`
      }`,
      {
        next: {
          revalidate: 10,
        },
      }
    );
    console.log(searchParams.get("category"));

    const data = await response.json();
    return data;
  };

  const {
    data: movies,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });

  const {
    data: genres,
    isLoading: isLoadingGenres,
    refetch: refetchGenres,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const moviesList = movies?.results;
  setTotalPages(movies?.total_pages);

  const handleChangeCategory = ({ category }: { category: string }) => {
    setCurrentCategory(category);
  };

  useEffect(() => {
    refetch();
    setTotalPages(movies?.total_pages);
  }, [fetching]);

  return (
    <section className=" w-full h-full flex p-4">
      {isLoading ? (
        <div className="flex w-full h-[calc(100vh-400px)] justify-center items-center">
          <span className="text-4xl text-cRed  animate-spin">
            <RiLoader2Fill />
          </span>
        </div>
      ) : moviesList.length === 0 ? (
        <div className="flex w-full h-[calc(100vh-400px)] justify-center items-center">
          <h1 className="text-xl text-cWhite font-semibold flex items-center gap-2">
            <span className="text-4xl text-cRed">
              <RiErrorWarningLine />
            </span>{" "}
            Não há resultados
          </h1>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="generos flex flex-wrap gap-2">
            {genres?.genres.map((genre: any) => (
              <span
                onClick={() => handleChangeCategory({ category: genre.name })}
                className="text-cWhite bg-cBlueLight px-3 py-1 hover:bg-cRed cursor-pointer transition-all hover:scale-90 rounded-md  text-sm"
                key={genre.id}
              >
                {genre.name}
              </span>
            ))}
          </div>
          <div
            className={`cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-5 ${
              isLoading && "opacity-0"
            }`}
          >
            {moviesList
              ?.filter((movie: any) => movie.title && movie.poster_path)
              .map((movie: any) => (
                <div
                  key={movie.id}
                  className="card relative group w-full h-full max-sm:max-h-52 px-2  py-1  bg-cBlueLight  flex justify-center items-center rounded-lg gap-3 cursor-pointer hover:outline transition-all hover:outline-cRed
          "
                >
                  <div className="imageArea z-50  max-w-[140px] overflow-hidden w-full group-hover:w-1/3 transition-all h-min rounded-lg shadow-lg  ">
                    <Image
                      className="w-full h-full object-contain "
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt="cover"
                      width={500}
                      height={500}
                      loading="eager"
                    />
                  </div>
                  <div className="content z-50 w-full flex flex-col h-full gap-6  justify-center">
                    <div className="flex flex-col w-full gap-2">
                      <h1 className="text-xl text-cWhite font-bold line-clamp-1">
                        {movie.title}
                      </h1>
                      <p className="text-sm  text-cGray line-clamp-5">
                        {movie.overview}
                      </p>
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="stars flex  items-center gap-1  ">
                        <span className="text-sm text-cRed">
                          <RiStarFill />
                        </span>
                        <span className="text-cWhite text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center opacity-0 scale-90 group-hover:scale-100 group-hover:opacity-100 transition-all gap-1">
                        <span className="text-cRed text-sm">
                          <RiEyeFill />
                        </span>
                        <span className="text-xs text-cWhite">Saber mais</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="opacity-0 scale-90 group-hover:scale-100 group-hover:opacity-10 transition-all"
                    style={{
                      content: '"dddddd"',
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url('https://image.tmdb.org/t/p/w500/${movie.backdrop_path}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",

                      zIndex: 1,
                      borderRadius: "inherit",
                    }}
                  ></div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MoviesList;
