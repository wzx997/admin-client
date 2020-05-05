import React, {Component} from "react";
import {Card, Table, Button, Icon, message, Modal, Divider} from "antd";

import LinkButton from "../../components/link-button";
import {reqCategorys} from "../../api";

//商品分类组件
class Category extends Component {

    state = {
        loading: true, // 是否正在获取数据中
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类ID
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    }

    //初始化表格列
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( // 返回需要显示的界面标
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ?
                            <span>
                                <Divider type="vertical"/>
                                <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>
                            </span>
                            :
                            null
                        }
                    </span>
                )
            }
        ]
    }

    //获取一级/二级分类列表显示
    getCategorys = (parentId) => {
        this.setState({loading: true});
        parentId = parentId || this.state.parentId;
        reqCategorys(parentId).then(res => {//开始调用接口
            if (res.status === 0) {
                // 取出分类数组(可能是一级也可能二级的)
                const categorys = res.data;
                if (parentId === '0') {
                    // 更新一级分类状态
                    this.setState({
                        categorys,
                        loading: false
                    });
                } else {
                    // 更新二级分类状态
                    this.setState({
                        subCategorys: categorys,
                        loading: false
                    })
                }
            } else {
                this.setState({loading: false});
                message.error('获取分类列表失败');
            }
        }).catch((_) => {
            this.setState({loading: false});
        })

    }

    //查看子分类
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新且重新render()后执行
            // 获取二级分类列表显示
            this.getCategorys();
        })
    }

    //回退到一级列表，不需要请求接口，只需要把pid设置成0，pname设置成空，子菜单设置为空
    //然后重新render即可
    showCategorys = () => {
        // 更新为显示一列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        });
    }

    //显示添加的模态框
    showAdd = () => {
        this.setState({showStatus: 1});
    }

    //显示更新的模态框
    showUpdate = (category) => {
        // 保存操作对象，更新状态
        this.category = category;
        this.setState({showStatus: 2});
    }

    //响应点击取消: 隐藏确定框
    handleCancel = () => {
        // 清除输入数据
        // this.form.resetFields()
        // 隐藏确认框
        this.setState({showStatus: 0});
    }

    //为第一次render()准备数据,初始化列,该函数只会加载一次
    componentWillMount() {
        this.initColumns();
    }

    // 执行异步任务: 发异步ajax请求, 组件加载完成后调用，数据的首次加载
    componentDidMount() {
        // 获取一级分类列表显示
        this.getCategorys();
    }


    render() {
        const {loading, categorys, subCategorys, parentId, parentName, showStatus,} = this.state;
        // card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        )

        // card的右侧
        const extra = <Button type='primary' icon="plus" onClick={this.showAdd}>添加</Button>

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey='_id'
                        loading={loading}
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        pagination={{defaultPageSize: 6, showQuickJumper: true}}
                    />
                </Card>

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    // onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >

                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    // onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >

                </Modal>
            </div>
        );
    }
}

export default Category;