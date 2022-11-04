import UserModel from "./UserModel.js";
import bcrypt from 'bcrypt'

export async function ormFindOneUser(username,password) {
    const hash = bcrypt.hashSync(password, username.length);
    return await UserModel.findOne({username,hash})
}
export function validatePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

export async function ormCreateUser(username, password,role) {
    try {
        const hash = hashPassword(password,username);
        const newUser = new UserModel({username:username, password:hash, role:role});
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export function hashPassword(password,username) {
    const hash = bcrypt.hashSync(password, username.length);
    return hash
}