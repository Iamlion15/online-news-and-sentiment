import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const matchPassword = async (password, entered_password) => {
    const match = await bcrypt.compare(password, entered_password);
    return match;
}

export {
    hashPassword,matchPassword
}
