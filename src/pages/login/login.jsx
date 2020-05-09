import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import { Form, Icon, Input, Button, message } from "antd";

import "./login.less";
import logo from "../../assets/images/logo.png";
import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

const FormItem = Form.Item;

/**
 * 登录的路由组件
 */
class Login extends Component{
    state = {
        loading: false
    }


    //登录函数
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loading: true});
                const {username, password} = values;
                reqLogin(username, password).then(res => {
                    if (res.status===0) { // 登录成功
                        message.success('登录成功');
                        // 保存user
                        const user = res.data;
                        memoryUtils.user = user; // 保存在内存中
                        storageUtils.saveUser(user); // 保存到local中

                        this.setState({loading: false});
                        this.props.history.replace('/');// 跳转到管理界面 (不需要再回退回到登陆)
                    } else {
                        this.setState({loading: false});
                        message.error(res.msg);
                    }
                }).catch(_ => {
                    this.setState({loading: false});
                });
            }else {
                console.log('校验失败！！！')
            }
        });
    }

    //动态验证密码
    validatePwd = (rule, value, callback) => {
        if(!value) {
            callback('密码必须输入');
        } else if (value.length<4) {;
            callback('密码长度不能小于4位')
        } else if (value.length>12) {
            callback('密码长度不能大于12位');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成');
        } else {
            callback(); // 验证通过
        }
    }

    render() {
        // 如果用户已经登陆, 自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/'/>
        }

        const {loading} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>

                <header className="login-content">
                    <h2>用户登录</h2>
                    <Form className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                initialValue: '',
                                rules: [{ required: true, whitespace: true, message: '用户名必须输入' },
                                    { min: 4, message: '用户名至少4位' },
                                    { max: 12, message: '用户名最多12位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="用户名"
                                    onPressEnter={this.handleSubmit}
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                initialValue:'',
                                rules: [{validator: this.validatePwd}]
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入密码"
                                    type="password"
                                    onPressEnter={this.handleSubmit}
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                className="login-form-button"
                                onClick={this.handleSubmit}
                                loading={loading}
                            >
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </header>
            </div>
        );
    }
}

export default Form.create()(Login);