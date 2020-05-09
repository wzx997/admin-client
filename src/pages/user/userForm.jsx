import React, {PureComponent} from "react"
import {Form, Select, Input} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {

    //动态验证密码
    validatePwd = (rule, value, callback) => {
        if (value.length<4) {;
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
        const {roles, user} = this.props;
        const {getFieldDecorator} = this.props.form;

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 4},  // 左侧label的宽度
            wrapperCol: {span: 15}, // 右侧包裹的宽度
        }

        return (
            <Form {...formItemLayout}>
                <FormItem label='用户名'>
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [{ required: true, whitespace: true, message: '用户名必须输入' },
                            { min: 4, message: '用户名至少4位' },
                            { max: 12, message: '用户名最多12位' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                        ],
                    })(
                        <Input placeholder='请输入用户名'/>
                    )}
                </FormItem>

                {user._id ? null : (
                    <FormItem label='密码'>
                        {getFieldDecorator('password', {
                            initialValue: user.password,
                            rules: [{ required: true, message: '用户名必须输入' },
                                {validator: this.validatePwd},
                            ]
                        })(
                            <Input.Password type='password' placeholder='请输入密码'/>
                        )}
                        </FormItem>
                    )
                }

                <FormItem label='手机号'>
                    {getFieldDecorator('phone', {
                        initialValue: user.phone || '',
                    })(
                        <Input placeholder='请输入手机号'/>
                    )}
                </FormItem>
                <FormItem label='邮箱'>
                    {getFieldDecorator('email', {
                        initialValue: user.email || '',
                        rules: [{type:'email', message: '请输入合法邮箱格式！'}]
                    })(
                        <Input placeholder='请输入邮箱'/>
                    )}
                </FormItem>

                <FormItem label='角色'>
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id || '',
                    })(
                        <Select>
                            {
                                roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                            }
                        </Select>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(UserForm);