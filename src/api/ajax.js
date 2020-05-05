/*
发送异步ajax的函数模块
 */

import axios from "axios";
import {notification} from 'antd';

export default function ajax(url, data={}, type='GET') {
    return new Promise(( resolve, reject) => {
        let promise
        // 1. 执行异步ajax请求
        if(type==='GET') { // 发GET请求
            promise = axios.get(url, { // 配置对象
                params: data // 指定请求参数
            });
        } else { // 发POST请求
            promise = axios.post(url, data);
        }
        // 2. 如果成功了, 调用resolve(value)
        promise.then(response => {
            resolve(response.data);
            // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
        }).catch(error => {
            reject(error);
            console.log('出错了：' + error.message);
            notification.error({
                message: 'oh。网络开小差了~~~',
                description: '当前请求无法完成，请检查你的网络或稍后再试，也可以联系管理员协助解决。'
            });
        })
    })
}