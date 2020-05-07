import React, {Component} from "react";
import {Card, Select, Input, Button, Table, message, Badge} from "antd";

import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";

const Option = Select.Option;

class ProductHome extends Component{

    state = {
        total: 0, // 商品的总数量
        products: [], // 商品的数组
        loading: true, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据哪个字段搜索
    }

    //初始化列名
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                ellipsis: true,
                width: 200,
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                ellipsis: true,
                dataIndex: 'desc',
            },
            {
                title: '价格',
                width: 100,
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 130,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    //状态为1：在售中，状态为2：已下架
                    const {status, _id} = product;
                    const newStatus = status === 1 ? 2 : 1;
                    return (
                        <span>
                            <span>
                                {status === 1 ?
                                    (<Badge status='success' text='在售中'/>) :
                                    (<Badge status='error' text='已下架'/>)
                                }
                            </span>
                            <LinkButton
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >{status === 1 ? '下架' : '上架'}</LinkButton>
                        </span>
                    )
                }
            },
            {
                width: 120,
                title: '操作',
                render: (product) => (
                    <span>
                        {/*会把product对想放到目录路由组件的state中。
                        通过this.props.location.state可以取出值
                        可以用大括号括起来传递一个对象，也可以单独传值*/}
                        <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                        <LinkButton>修改</LinkButton>
                    </span>
                )

            },
        ];
    }

    //请求商品列表接口
    getProducts = (pageNum) => {
        this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
        this.setState({loading: true}); // 显示loading

        const {searchName, searchType} = this.state;
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let response;
        if (searchName) {
            response = reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType});
        } else { // 一般分页请求
            response = reqProducts(pageNum, PAGE_SIZE);
        }

        response.then(res => {
            if (res.status === 0) {
                // 取出分页数据, 更新状态, 显示分页列表
                const {total, list} = res.data;
                this.setState({
                    total,
                    products: list,
                    loading: false
                })
            } else {
                this.setState({loading: false});
                message.error('获取分类列表失败');
            }
        }).catch(_ => {
            this.setState({loading: false});
        });
    }

    // 更新指定商品的状态
    updateStatus = (productId, status) => {
        reqUpdateStatus(productId, status).then(res => {
            if(res.status===0) {
                message.success('更新商品状态成功');
                this.getProducts(this.pageNum);
            } else {
                message.success('更新商品状态失败');
            }
        }).catch(err => {
            console.log(err);
        });
    }

    //开始初始化表格列，在组件将要挂载的时候
    componentWillMount () {
        this.initColumns()
    }

    //异步请求接口
    componentDidMount() {
        this.getProducts(1);
    }

    render() {
        // 取出状态数据
        const {products, total, loading, searchType, searchName} = this.state;


        //定义card的标题
        const title = (
            <span>
                <Select
                    value= {searchType}
                    style={{width: 300}}
                    onChange={value => this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{width: 300, margin: '0 30px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        );

        //定义card的额外信息
        const extra = (
            <Button type='primary' icon="plus">
                添加商品
            </Button>
        );

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        );
    }
}

export default ProductHome;