import { Router } from "express";
import { getUsers, getUser } from "../controller/user.controller.js";
// import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

userRouter.post('/', (req,res)=>res.send({'title':'Create new user'}));

userRouter.put('/:id', (req,res)=>res.send({'title':'update user'}));

userRouter.delete('/:id', (req,res)=>res.send({'title':'delete user'}));

export default userRouter;