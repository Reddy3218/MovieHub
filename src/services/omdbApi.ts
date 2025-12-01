const API_KEY = 'f3808f67';
const BASE_URL = 'https://www.omdbapi.com/';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface MovieDetail extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  imdbRating: string;
  imdbVotes: string;
  BoxOffice?: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface DetailResponse extends MovieDetail {
  Response: string;
  Error?: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'An error occurred');
  }

  return data;
};

export const searchMovies = async (
  query: string,
  type?: string,
  year?: string,
  page: number = 1
): Promise<SearchResponse> => {
  const params = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    page: page.toString(),
  });

  if (type && type !== 'all') {
    params.append('type', type);
  }

  if (year) {
    params.append('y', year);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  return handleResponse<SearchResponse>(response);
};

export const getMovieDetails = async (id: string): Promise<MovieDetail> => {
  const params = new URLSearchParams({
    apikey: API_KEY,
    i: id,
    plot: 'full',
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  return handleResponse<MovieDetail>(response);
};
