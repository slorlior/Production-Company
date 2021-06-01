import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoviesApiService } from './movies-api.service';

@Module({
    imports: [HttpModule, ConfigModule.forRoot()],
    providers: [MoviesApiService],
    exports: [MoviesApiService]
})
export class MoviesApiModule { }
