import { Module } from '@nestjs/common';
import { MoviesApiModule } from 'src/movies-api/movies-api.module';
import { MoviesService } from './movies.service';

@Module({
	imports:[MoviesApiModule],
	providers: [MoviesService]
})
export class MoviesModule { }
