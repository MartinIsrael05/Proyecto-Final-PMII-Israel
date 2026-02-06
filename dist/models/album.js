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
    static fromData(data) {
        return new Album(data);
    }
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
