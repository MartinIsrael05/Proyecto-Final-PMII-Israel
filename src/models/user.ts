// Describe como vienen los datos de un usuario desde el JSON
export interface UserData {
  id: number;
  name: string;
  password: string;
  email: string;
  isSubscribed: boolean;
  isAdmin: boolean;
  registerDate: string;
  likedPostIDs: number[];
}

//Clase real de usuario
export class User {
  public id: number;
  public name: string;
  public password: string;
  public email: string;
  public isSubscribed: boolean;
  public isAdmin: boolean;
  public registerDate: string;
  public likedPostIDs: number[];

  constructor(data: UserData) {
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
  static fromData(data: UserData): User {
    return new User(data);
  }

  // toData = convertir una instancia de User a un objeto UserData (de instancia de User a JSON)
  toData(): UserData {
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
