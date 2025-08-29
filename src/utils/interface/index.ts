import { Request } from "express";
import { User } from "src/user/schemas/user.schema";

export interface RequestUser extends Request {
  user: User & {id:string};
}
// export interface CustomRequest extends Request {
//   user: RequestUser;
// }