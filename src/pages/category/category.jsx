import React, {Component} from "react";
import {Card, Table, Button, Icon, message, Modal, Divider, Tooltip, notification} from "antd";

import LinkButton from "../../components/link-button";
import {reqCategorys, reqUpdateCategory, reqAddCategory} from "../../api";

import AddForm from "./add-form";
import UpdateForm from "./update-form";

//商品分类组件
class Category extends Component {

    state = {
        loading: true, // 是否正在获取数据中
        confirmLoading: false, //点击确认后的按钮加载功能
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
                    });
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

    //添加分类
    addCategory = () => {
        this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({confirmLoading: true});
                const {parentId, categoryName} = values;
                reqAddCategory(categoryName, parentId).then((res) => {
                    if (res.status === 0){
                        message.success('添加商品类型成功');
                        this.setState({
                            confirmLoading: false,
                            showStatus: 0
                        });
                        this.form.resetFields();
                        if(parentId === this.state.parentId) {
                            // 添加的分类就是当前分类列表下的分类，即在该分类下面添加子分类，这时需要更新
                            // 重新加载这个父分类下面的类别
                            // 两种情况：在一级列表下添加一级分类，在二级列表下添加该二级列表的子分类，都需要重新加载
                            this.getCategorys();
                        } else if (parentId==='0'){
                            // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要刷新当前显示的二级列表
                            // 重新获取的目的的是为了回退的时可见
                            this.getCategorys('0');
                        }
                        //其他情况1：在一级列表添加二级列表的选项，这时候不用发请求，因为查看二级列表的时候会单独发请求
                        //其他情况2：在二级列表添加其他二级列表的选项，这时候也不用发请求，因为查看二级列表的时候会单独发请求
                    } else {
                        this.setState({confirmLoading: false});
                        message.error('添加商品类型失败');
                    }
                }).catch(_ => {
                    this.setState({confirmLoading: false});
                });
            } else {
                notification.error({
                        message: '发生了一些错误！！！',
                        description: '请确信息填写完成。'
                    }
                );
            }
        });
    }

    //显示更新的模态框
    showUpdate = (category) => {
        // 保存操作对象，更新状态
        this.category = category;
        this.setState({showStatus: 2});
    }

    //更新分类
    updateCategory = () => {
        this.form.validateFieldsAndScroll((err, values) => {
            if (!err){
                this.setState({confirmLoading: true});
                const categoryId = this.category._id;
                const {categoryName} = values;
                reqUpdateCategory({categoryId,categoryName}).then(res => {
                    if (res.status === 0){//更新成功，取消加载、关闭模态框，重置表单，重新请求页面
                        message.success('更新商品类型成功');
                        this.setState({
                            confirmLoading: false,
                            showStatus: 0
                        });
                        this.form.resetFields();
                        this.getCategorys();
                    } else {//更新失败，取消加载，弹框提示
                        this.setState({confirmLoading: false});
                        message.error('更新商品类型失败');
                    }
                }).catch(_ => {
                    this.setState({confirmLoading: false});
                });
            } else {
                notification.error({
                        message: '发生了一些错误！！！',
                        description: '请确信息填写完成。'
                    }
                );
            }
        });
    }

    //响应点击取消: 隐藏确定框
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields()
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
        const {loading, confirmLoading, categorys, subCategorys, parentId, parentName, showStatus,} = this.state;
        const category = this.category || {}; //读取指定的分类,如果还没有指定一个空对象

        // card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <Tooltip title="点击返回到一级分类列表">
                    <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                </Tooltip>
                <Icon type='arrow-right' style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        );

        // card的右侧
        const extra = <Button type='primary' icon="plus" onClick={this.showAdd}>添加</Button>;

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
                    confirmLoading={confirmLoading}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    confirmLoading={confirmLoading}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName = {category ? category.name : ''}
                        setForm={(form) => {this.form = form}}
                        /*
                            可以使用两种方式获取得到子组件的form的对象，一种是上面这种方法，
                        子组件在钩子函数中直接将子组件this.props.form传给父组件，父组件可
                        以根据上面的this.form来调用经过Form.create()包装后的方法，一种是
                        下面这种，但是这样拿到的是完整的子组件对象，需要经过this.UpdateForm
                        .props.form才可以拿到经过Form.create()包装后的方法。
                            第一种主要写一个钩子函数-》组件将要加载的时候。在里面调用setForm
                         方法，将this.props.form传递回来。
                         */
                        // wrappedComponentRef={(inst) => {this.UpdateForm = inst;}}
                    />
                </Modal>
            </div>
        );
    }
}

export default Category;
