export class Movie {
    id: number;
    genre_ids: number[];
    release_date: string;
    vote_average: number;
    vote_count: number;
}

export class DiscoverMoviesResult {
    results: Movie[];
    total_pages: number;
}