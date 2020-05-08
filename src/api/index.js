/*
包含应用中所有接口请求函数的模板
 */
import ajax from "./ajax";

// const BASE = 'http://localhost:5000'
const BASE = ''

//登录接口
export const reqLogin = (username, password) => ajax(
    BASE + '/login', {username, password}, 'POST'
);

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(
    BASE + '/manage/category/list', {parentId});

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(
    BASE + '/manage/category/add', {categoryName, parentId}, 'POST'
);

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(
    BASE + '/manage/category/update', {categoryId, categoryName}, 'POST'
);
// 获取一个分类
export const reqCategory = (categoryId) => ajax(
    BASE + '/manage/category/info', {categoryId}
    );

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(
    BASE + '/manage/product/list', {pageNum, pageSize}
    );

// 搜索商品分页列表 (根据商品名称/商品描述)
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(
    BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
});

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(
    BASE + '/manage/product/updateStatus',
    {productId, status}, 'POST'
);

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(
    BASE + '/manage/img/delete',
    {name}, 'POST'
);

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(
    BASE + '/manage/product/' + ( product._id ? 'update' : 'add'),
    product, 'POST'
);