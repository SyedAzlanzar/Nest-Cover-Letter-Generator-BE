import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSaltSync();
    return await bcrypt.hashSync(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compareSync(password, hash);
};
