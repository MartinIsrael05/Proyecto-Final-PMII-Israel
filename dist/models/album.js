//Clase real de álbum
export class Album {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.artist = data.artist;
        this.year = data.year;
        this.genre = data.genre;
        this.cover = data.cover;
        this.liked = data.liked;
    }
    // Permite crear una instancia de Album a partir de un objeto AlbumData (de JSON a instancia de Album)
    static fromData(data) {
        return new Album(data);
    }
    // Convierte una instancia de Album a un objeto AlbumData para su almacenamiento o transmisión (de instancia de Album a JSON)
    toData() {
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
