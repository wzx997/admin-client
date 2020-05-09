import React, {Component} from "react";
import {Form, Input} from "antd";

const FormItem = Form.Item

/*
更新分类的form组件
 */
class UpdateForm extends Component {

    componentWillMount() {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }

    render() {
        const {categoryName} = this.props;
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };

        return (
            <Form {...formItemLayout}>
                <FormItem label="分类名">
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName,
                            rules: [{required: true, message: '分类名称必须输入'}]
                        })(
                            <Input placeholder='请输入分类名称'/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm);