import React, {Component} from "react";
import {Card, Button, Table, Modal, message} from "antd";

import LinkButton from "../../components/link-button";
import {formatDate} from "../../utils/dateUtils";
import {PAGE_SIZE} from "../../utils/constants";
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from "../../api";

import UserForm from "./userForm";

//用户组件
class User extends Component{

    state = {
        users: [], // 所有用户列表
        roles: [], // 所有角色列表
        isShow: false, // 是否显示确认框
        loading: false,
        confirmLoading: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },

            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    //获取所有用户
    getUsers = () => {
        this.setState({loading:true});
        reqUsers().then(res => {
            if (res.status===0) {
                const {users, roles} = res.data;
                this.initRoleNames(roles);//初始化角色名
                this.setState({users, roles, loading: false});
            } else {
                this.setState({loading:false});
                message.error('获取用户列表失败');
            }

        }).catch(() => {
            this.setState({loading:false});
        });
    }

    //根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        }, {});
        // 保存
        this.roleNames = roleNames;
    }

    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除用户：${user.username} 吗?`,
            onOk:  () => {
                reqDeleteUser(user._id).then( res => {
                    if(res.status===0) {
                        message.success('删除用户成功');
                        this.getUsers();
                    } else {
                        message.success('删除用户失败');
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }

    // 打开添加操作的模态框
    showAdd = () => {
        this.user = null; // 去除前面保存的user
        this.setState({isShow: true});
    }

    // 打开更新操作的模态框
    showUpdate = (user) => {
        this.user = user; // 保存user
        this.setState({isShow: true});
    }

    // 处理更新或者操作的提交
    addOrUpdateUser = () => {
        this.UpdateForm.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({confirmLoading: true});

                let user = values; // 1. 收集输入数据

                if (this.user) {// 如果是更新, 需要给user指定_id属性
                    user._id = this.user._id;
                }

                reqAddOrUpdateUser(user).then(res => {
                    if(res.status === 0) {
                        message.success(`${this.user ? '修改' : '添加'}用户成功`);
                        this.setState({isShow: false, confirmLoading: false});
                        this.UpdateForm.props.form.resetFields();//成功后重置表单
                        this.getUsers();
                    } else {
                        message.success(`${this.user ? '修改' : '添加'}用户失败`);
                        this.setState({confirmLoading: false});
                    }
                }).catch(() => {
                    this.setState({confirmLoading: false});
                });
            }
        });
    }

    //初始化表格列
    componentWillMount () {
        this.initColumns();
    }

    // 发送请求
    componentDidMount () {
        this.getUsers();
    }

    render() {
        const {users, roles, isShow, loading, confirmLoading} = this.state;
        const user = this.user || {};

        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>;

        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={users}
                        loading={loading}
                        columns={this.columns}
                        pagination={{defaultPageSize: PAGE_SIZE}}
                    />
                </Card>

                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    confirmLoading={confirmLoading}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.UpdateForm.props.form.resetFields();
                        this.setState({isShow: false});
                    }}
                >
                    <UserForm
                        roles={roles}
                        user={user}
                        wrappedComponentRef={(inst) => {this.UpdateForm = inst;}}
                    />
                </Modal>

            </div>
        );
    }
}

export default User;