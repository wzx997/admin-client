/*
包含应用中所有接口请求函数的模板
 */
import ajax from "./ajax";

// const BASE = 'http://localhost:5000'
const BASE = ''

//登录接口
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST');

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');