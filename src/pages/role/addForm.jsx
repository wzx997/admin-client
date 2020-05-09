import React, {Component} from "react";
import {Form, Input} from "antd";

const FormItem = Form.Item;

//添加角色的form组件
class AddForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 4},  // 左侧label的宽度
            wrapperCol: {span: 15}, // 右侧包裹的宽度
        }

        return (
            <Form>
                <FormItem label='角色名称' {...formItemLayout}>
                    {getFieldDecorator('roleName', {
                        initialValue: '',
                        rules: [{required: true, message: '角色名称必须输入'}]
                    })(
                        <Input
                            placeholder='请输入角色名称'
                            onPressEnter={this.props.addRole}
                        />
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(AddForm)