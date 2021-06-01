import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Movie } from 'src/models/movie.model';
import { MoviesApiService } from 'src/movies-api/movies-api.service';

@Injectable()
export class MoviesService {
    constructor(private moviesApiService: MoviesApiService) { }
    async start(companyId: string): Promise<void> {
        let movies: Movie[];
        try {
            movies = await this.moviesApiService.getCompanyMovies(companyId);
        }
        catch (e) {
            console.log("TODO: Throw error with relavnt message");
            throw new InternalServerErrorException();
        }

        const { moviesCountPerMonth, moviesScoresPerGenresAndYear } = this.aggregateResult(movies);
        console.log("moviesCountPerMonth")
        console.log(moviesCountPerMonth)
        console.log("##################")

        console.log("moviesScoresPerGenresAndYear")
        console.log(moviesScoresPerGenresAndYear)

        // TODO : save result to DB under companyId

    }

    // TODO: add more types model
    private aggregateResult(movies: Movie[]): { moviesCountPerMonth: any, moviesScoresPerGenresAndYear: any } {
        let moviesCountPerMonth = {};
        let moviesScoresPerGenresAndYear = {};
        movies.forEach(movie => {
            const dateSplitted = movie.release_date.split('-');
            const year = dateSplitted[0];
            const month = dateSplitted[1];
            const date = `${year}-${month}`;
            if (moviesCountPerMonth[date]) {
                moviesCountPerMonth[date]++;
            }
            else {
                moviesCountPerMonth[date] = 1;
            }

            if (movie.vote_count > 0) {
                if (!moviesScoresPerGenresAndYear[year]) {
                    moviesScoresPerGenresAndYear[year] = {};
                }
                movie.genre_ids.forEach(genreId => {
                    if (!moviesScoresPerGenresAndYear[year][genreId]) {
                        moviesScoresPerGenresAndYear[year][genreId] = { scoreSum: 0, movies: 0, average: 0 };
                    }
                    moviesScoresPerGenresAndYear[year][genreId].scoreSum += movie.vote_average;
                    moviesScoresPerGenresAndYear[year][genreId].movies++;
                    moviesScoresPerGenresAndYear[year][genreId].average = moviesScoresPerGenresAndYear[year][genreId].scoreSum / moviesScoresPerGenresAndYear[year][genreId].movies;
                });
            }
        });

        return { moviesCountPerMonth, moviesScoresPerGenresAndYear };
    }
}
