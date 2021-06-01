import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { DiscoverMoviesResult, Movie } from 'src/models/movie.model';

@Injectable()
export class MoviesApiService {
    private api: string;
    private apiKey: string;
    constructor(private httpService: HttpService, private configService: ConfigService) {
        // TODO: throw error if missing variables
        this.api = this.configService.get<string>("MOVIES_API");
        this.apiKey = this.configService.get<string>("API_KEY");
    }

    public async getCompanyMovies(companyId: string): Promise<Movie[]> {
        let allMovies: Movie[] = [];
        const url = `${this.api}discover/movie?with_companies=${companyId}&release_date.gte=2020-01-01&api_key=${this.apiKey}`;
        const discoverMoviesResult = (await this.httpService.get<DiscoverMoviesResult>(url).toPromise()).data;
        allMovies = [...allMovies, ...discoverMoviesResult.results];
        const totalPages = discoverMoviesResult.total_pages;
        if (totalPages > 1) {
            let pagesPromises = [];
            for (let i = 2; i <= totalPages; i++) {
                const discoverMoviePromise = this.httpService.get<DiscoverMoviesResult>(`${url}&page=${i}`).toPromise();
                pagesPromises.push(discoverMoviePromise);
            }
            const allPages = await Promise.all<AxiosResponse<DiscoverMoviesResult>>(pagesPromises);
            for (let i = 0; i < allPages.length; i++) {
                allMovies = [...allMovies, ...allPages[i].data.results];

            }
        }

        return allMovies;
    }


}
