// Describe como vienen los datos de un álbum desde el JSON
export interface AlbumData {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string;
  cover: string;
  liked: boolean;
}
//Clase real de álbum
export class Album {
  public id: number;
  public title: string;
  public artist: string;
  public year: number;
  public genre: string;
  public cover: string;
  public liked: boolean;

  constructor(data: AlbumData) {
    this.id = data.id;
    this.title = data.title;
    this.artist = data.artist;
    this.year = data.year;
    this.genre = data.genre;
    this.cover = data.cover;
    this.liked = data.liked;
  }

  // Permite crear una instancia de Album a partir de un objeto AlbumData (de JSON a instancia de Album)
  static fromData(data: AlbumData): Album {
    return new Album(data);
  }
  // Convierte una instancia de Album a un objeto AlbumData para su almacenamiento o transmisión (de instancia de Album a JSON)
  toData(): AlbumData {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      year: this.year,
      genre: this.genre,
      cover: this.cover,
      liked: this.liked
    };
  }
}
