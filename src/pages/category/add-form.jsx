import React, {Component} from "react";
import {Form, Select, Input} from "antd";

const FormItem = Form.Item
const Option = Select.Option

/*
添加分类的form组件
 */
class AddForm extends Component {

    componentWillMount() {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form);
    }

    render() {
        const {categorys, parentId} = this.props;
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
                <FormItem label="父分类">
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId,
                            rules: [{required: true, message: '分类名称必须输入'}]
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }

                </FormItem>

                <FormItem label="分类名">
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
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

export default Form.create()(AddForm);