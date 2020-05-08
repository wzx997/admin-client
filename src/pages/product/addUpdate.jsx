import React, {Component} from "react";
import {Card, Icon, Form, Input, Cascader, Button, message, Tooltip} from "antd";

import LinkButton from "../../components/link-button";
import PicturesWall from "./picturesWall";
import RichTextEditor from "./richTextEditor";
import {reqCategorys, reqAddOrUpdateProduct} from '../../api';

const FormItem = Form.Item;
const { TextArea } = Input;

class ProductAddUpdate extends Component{

    state = {
        options: [],
        subCategorys: [],
        confirmLoading: false
    }

    constructor (props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        // this.pw = React.createRef();//文件上传
        this.editor = React.createRef();//富文本编辑器
    }

    //初始化级联选择框的第一级
    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false, // 不是叶子
        }))

        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this;
        const {pCategoryId} = product;
        if(isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId);
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }));

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value===pCategoryId);

            // 关联对应的一级option上
            targetOption.children = childOptions;
        }
        // 更新options状态
        this.setState({options});
    }

    //异步获取一级/二级分类列表, 并显示
    getCategorys = (parentId) => {
        return reqCategorys(parentId).then(res => {
            if (res.status === 0) {
                const categorys = res.data;
                // 如果是一级分类列表
                if (parentId === '0') {
                    this.initOptions(categorys);
                } else {
                    return categorys;
                }
            } else {
                message.error('查询商品分类失败');
            }
        }).catch((err) => {
            console.log(err);
        })
        ;
    }

    // 用加载下一级列表的回调函数
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];// 得到选择的option对象
        targetOption.loading = true; // 显示loading

        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value);
        targetOption.loading = false; // 隐藏loading
        if (subCategorys && subCategorys.length>0) {// 二级分类数组有数据
            const childOptions = subCategorys.map(c => ({// 生成一个二级列表的options
                value: c._id,
                label: c.name,
                isLeaf: true
            }));
            targetOption.children = childOptions;// 关联到当前option上
        } else { // 当前选中的分类没有二级分类
            targetOption.isLeaf = true;
        }
        this.setState({options: [...this.state.options],});// 更新options状态
    }


    //表单验证，数据提交，发送请求
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({confirmLoading: true});
                const {name, desc, price, categoryIds} = values;

                //取出商品的分类信息
                let pCategoryId, categoryId;
                if (categoryIds.length===1) {//只有一个，表名属于一级分类，父分类的id为0
                    pCategoryId = '0';
                    categoryId = categoryIds[0];
                } else {
                    pCategoryId = categoryIds[0];
                    categoryId = categoryIds[1];
                }

                const imgs = this.pw.getImgs();//获取子组件方法方式1
                const detail = this.editor.current.getDetail();//获取子组件方法方式2

                const product = {name, desc, price, imgs, detail, pCategoryId, categoryId};
                // 如果是更新, 需要添加_id
                if(this.isUpdate) {
                    product._id = this.product._id;
                }
                reqAddOrUpdateProduct(product).then(res => {
                    if (res.status===0) {
                        this.setState({confirmLoading: false});
                        message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`);
                        this.props.history.goBack();
                    } else {
                        this.setState({confirmLoading: false});
                        message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`);
                    }
                }).catch(_ => {
                    this.setState({confirmLoading: false});
                });
            }
        });
    }

    //价格自定义的验证函数
    validatePrice = (rule, value, callback) => {
        if (value*1 > 0) {
            callback(); // 验证通过
        } else {
            callback('价格必须大于0');// 验证没通过
        }
    }

    //组件挂载的时候执行
    componentDidMount () {
        this.getCategorys('0');
    }

    //组件将要挂载的时候执行
    componentWillMount () {
        // 取出携带的state
        const product = this.props.location.state;  // 如果是添加没值, 否则有值
        // 保存是否是更新的标识
        this.isUpdate = !!product;
        // 保存商品(如果没有, 保存是{})
        this.product = product || {};
    }


    render() {
        const {isUpdate, product} = this;
        const {pCategoryId, categoryId, imgs, detail} = product;
        const {confirmLoading} = this.state;

        // 用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate) {
            // 商品是一个一级分类的商品
            if(pCategoryId==='0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const {getFieldDecorator} = this.props.form;


        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
        };

        // 头部左侧标题
        const title = (
            <span>
                <LinkButton >
                    <Tooltip title='点击返回商品列表'>
                        <Icon
                            type='arrow-left'
                            style={{marginRight: 10, fontSize: 20}}
                            onClick={() => this.props.history.goBack()}
                        />
                    </Tooltip>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <FormItem label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [{required: true, message: '必须输入商品名称'}]
                        })(
                            <Input placeholder='请输入商品名称'/>
                        )}
                    </FormItem>
                    <FormItem label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [{required: true, message: '必须输入商品描述'}]
                        })(
                            <TextArea
                                placeholder="请输入商品描述"
                                allowClear
                            />
                        )}
                    </FormItem>
                    <FormItem label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [{required: true, message: '必须输入商品价格'},
                                {validator: this.validatePrice}
                            ]
                        })(
                            <Input
                                type='number'
                                placeholder='请输入商品价格'
                                addonAfter='元'
                            />
                        )}
                    </FormItem>
                    <FormItem label="商品分类">
                        {getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [{required: true, message: '必须指定商品分类'},]
                        })(
                            <Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}
                                loadData={this.loadData}
                            />
                        )}
                    </FormItem>
                    <FormItem label="商品图片">
                        {/*可以通过ref={pw => this.pw = pw}拿到子组件对象，
                        或者在构造函数中使用官网推荐的方式，但是这种需要使用this.pw.current
                        才可以拿到子组件对象<PicturesWall ref={this.pw}/>
                        */}
                        <PicturesWall ref={pw => this.pw = pw} imgs={imgs}/>
                    </FormItem>
                    <FormItem label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </FormItem>
                    <FormItem>
                        <Button
                            type='primary'
                            onClick={this.handleSubmit}
                            loading={confirmLoading}
                            style={{marginLeft: 40}}
                        >提交</Button>
                    </FormItem>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate);