export const getGenres = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=3933f04d7e157db6a1139691e02664bf&language=pt-BR`,
    {
      next: {
        revalidate: 60 * 64,
      },
    }
  );
  const data = await response.json();
  return data;
};
