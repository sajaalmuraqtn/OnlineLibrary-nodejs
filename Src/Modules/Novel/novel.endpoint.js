import { auth, roles } from "../../Middleware/auth.js"

export const endPoint={
    create:roles.User,
    update:roles.User,
    delete:roles.User,
    sendDeleteNovelCode: roles.User,
    publish: roles.User,
    myNovels: roles.User
}