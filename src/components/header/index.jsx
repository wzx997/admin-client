import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import { Modal} from "antd";

import "./index.less";
import LinkButton from "../link-button";
import {formatDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/menuConfig";


/*
头部组件
 */
class Header extends Component{
    state = {
        currentTime: formatDate(Date.now()), // 当前时间字符串
    }

    //获取时间
    getTime = () => {
        // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    //获取标题
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname;
        let title = '首页';
        menuList.forEach(item => {
            if (item.key === path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
                title = item.title;
            } else if (item.children) {
                // 在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                // const cItem = item.children.find(cItem => cItem.key === path);
                // 如果有值才说明有匹配的
                if (cItem) {
                    // 取出它的title
                    title = cItem.title;
                }
            }
        })
        return title;
    }

    //退出登录
    logout = () => {
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
                // 删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};

                // 跳转到login
                this.props.history.replace('/login');
            }
        });
    }

    //组件加载完成后调用方法，第一次render后执行
    componentDidMount () {
        // 获取当前的时间
        this.getTime();
    }

    //组件卸载的时候清除定时器
    componentWillUnmount () {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime} = this.state;
        const username = memoryUtils.user.username;
        const title = this.getTitle();

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎您, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2707399742,3400686078&fm=26&gp=0.jpg" alt="weather"/>
                        <span>晴</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
