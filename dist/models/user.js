//Clase real de usuario
export class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.password = data.password;
        this.email = data.email;
        this.isSubscribed = data.isSubscribed;
        this.isAdmin = data.isAdmin;
        this.registerDate = data.registerDate;
        this.likedPostIDs = data.likedPostIDs;
    }
    // fromData = crear un nuevo usuario a partir de un objeto UserData (de JSON a instancia de User)
    static fromData(data) {
        return new User(data);
    }
    // toData = convertir una instancia de User a un objeto UserData (de instancia de User a JSON)
    toData() {
        return {
            id: this.id,
            name: this.name,
            password: this.password,
            email: this.email,
            isSubscribed: this.isSubscribed,
            isAdmin: this.isAdmin,
            registerDate: this.registerDate,
            likedPostIDs: this.likedPostIDs
        };
    }
}
