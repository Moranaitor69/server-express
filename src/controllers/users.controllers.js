import UserManager from "../managers/UserManager.js";

const um = new UserManager();

export const createUser = async (req, res) => {
    try {
        const newUser = await um.createUser(req.body);
        res.status(201).send(newUser);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await um.getAllUsers();
        res.send(users);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await um.getUserById(req.params.id);
        if (!user) return res.status(404).send({ error: "Usuario no encontrado" });
        res.send(user);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};
