/*
包含应用中所有接口请求函数的模板
 */
import ajax from "./ajax";

// const BASE = 'http://localhost:5000'
const BASE = ''

//开始写接口
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');