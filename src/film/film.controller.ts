import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FilmService } from './film.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  findAll(): Promise<Film[]> {
    return this.filmService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Film>): Promise<Film> {
    return this.filmService.createFilm(data);
  }
}