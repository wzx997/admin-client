import React, {Component} from "react";
import { Form, Icon, Input, Button } from 'antd';
// import { Button,} from 'antd';


import "./login.less";
import logo from "./images/logo.png"

/**
 * 登录的路由组件
 */
class Login extends Component{
    render() {
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>

                <header className="login-content">
                    <h2>用户登陆</h2>
                    <Form className="login-form">
                        <Form.Item>
                            <Input
                                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </header>
            </div>
        );
    }
}

export default Login;