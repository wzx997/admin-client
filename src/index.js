import React from "react";
import ReactDOM from "react-dom";

//配置中文主题
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import App from "./App";
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";

moment.locale('zh-cn');

// 读取local中保存user, 保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;

ReactDOM.render(<ConfigProvider locale={zhCN}><App /></ConfigProvider>, document.getElementById('root'));

