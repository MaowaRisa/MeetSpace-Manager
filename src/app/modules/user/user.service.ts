import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async(payload: TUser) =>{
    const result = await User.create(payload);
    const newUser = await User.findById(result._id).select('_id name email phone role address')
    return newUser;
}
export const UserServices = {
    createUserIntoDB,
}