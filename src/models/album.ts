export interface AlbumData {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string;
  cover: string;
  liked: boolean;
}

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

  static fromData(data: AlbumData): Album {
    return new Album(data);
  }

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
