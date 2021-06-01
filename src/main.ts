import { NestFactory } from '@nestjs/core';
import { MoviesModule } from './movies/movies.module';
import { MoviesService } from './movies/movies.service';

async function bootstrap(args: string[]) {
	const moviesModule = await NestFactory.create(MoviesModule);
	const moviesService = moviesModule.get<MoviesService>(MoviesService);
	await moviesService.start(args[0]);

}
// TODO: receive argument in a better way
bootstrap(process.argv.slice(2));
