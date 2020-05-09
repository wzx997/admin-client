import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import { Row, Col, Layout } from 'antd';

import './admin.less';
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/bar";
import Pie from "../charts/pie";
import Line from "../charts/line";
import NotFound from "../not-found/not-found";

const {Footer} = Layout;

/**
 * 后台管理的路由组件
 */
class Admin extends Component{
    render() {
        const user = memoryUtils.user;
        // console.log(user);
        // 如果内存没有存储user ==> 当前没有登陆
        if(!user || !user._id) {
            // 自动跳转到登陆(在render()中)
            return <Redirect to='/login'/>
        }

        return (
            <Row className="container">
                <Col span={4} className="nav-left">
                    <LeftNav/>
                </Col>

                <Col span={20} className="main">
                    <Header/>
                    <Row className="content">
                        <Switch>
                            <Redirect from='/' exact to='/home'/>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Route path="/charts/line" component={Line}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Row>
                    <Footer className="footer">推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Col>
            </Row>
        );
    }
}

export default Admin;