import UserModel from "../models/UserModel.js";

export default class UserManager {

    async createUser(data) {
        const user = await UserModel.create(data);
        return user;
    }

    async getAllUsers() {
        const users = await UserModel.find({});
        return users;
    }

    async getUserById(id) {
        const user = await UserModel.findById(id);
        return user;
    }
}
