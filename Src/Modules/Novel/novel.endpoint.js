import { auth, roles } from "../../Middleware/auth.js"

export const endPoint={
    create:roles.User,
    update:roles.User,
    delete:roles.User,
    publish: roles.User
}