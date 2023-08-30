import { Router } from "express";
import userControl from '../controller/user_control'

const route = Router()

route.post('/login', userControl.handleLogIn)
route.post('/register', userControl.handleRegister)
route.post('/signout', userControl.handleSignOut)

module.exports = route