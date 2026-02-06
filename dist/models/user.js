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
    static fromData(data) {
        return new User(data);
    }
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
