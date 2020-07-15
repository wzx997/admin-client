import React, {Component} from "react";
import {Card, Button, Table, Modal, message, notification} from "antd";

import memoryUtils from "../../utils/memoryUtils"
import {formatDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles, reqAddRole, reqUpdateRole} from "../../api";

import AddForm from "./addForm";
import AuthForm from "./authForm";


//角色组件
class Role extends Component{

    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        loading: false,
        confirmLoading: false,
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
    }

    // 初始化列
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formatDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formatDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    onRow = (role) => {
        return {
            onClick: () => { // 点击行
                // console.log('row onClick()', role);
                this.setState({role});
            },
        }
    }

    //获取所有角色
    getRoles = () => {
        this.setState({loading: true});
        reqRoles().then(res => {
            if (res.status === 0) {
                const roles = res.data;
                this.setState({roles, loading: false});
            } else {
                this.setState({loading: false});
            }
        }).catch(() => {
            this.setState({loading: false});
        })
    }

    //创建角色
    addRole = () => {
        this.AddForm.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({confirmLoading: true});
                const {roleName} = values;

                reqAddRole(roleName).then(res => {
                    if (res.status ===0 ){
                        message.success('添加角色成功');
                        this.setState({
                            confirmLoading: false,
                            isShowAdd: false
                        });
                        this.AddForm.props.form.resetFields();
                        // this.getRoles(); // 再次请求接口获取最新的列表

                        // 或者直接更新state
                        const role = res.data;
                        this.setState(state => ({roles: [...state.roles, role]}));
                    } else {
                        message.success('添加角色失败');
                        this.setState({confirmLoading: false});
                    }
                }).catch(() => {
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

    // 更新角色
    updateRole = () => {
        this.setState({confirmLoading: true});
        // 状态中存入role就是选择的role，即需要更新的role，这是一个应用变量，也关联到了roles数组上
        // 它的改变也会带来整个数组的改变
        const role = this.state.role;
        const menus = this.auth.getMenus();
        role.menus = menus;
        role.auth_time = Date.now();
        role.auth_name = memoryUtils.user.username;

        reqUpdateRole(role).then(res => {
            if (res.status === 0) {
                if (role._id === memoryUtils.user.role_id) {
                    memoryUtils.user = {}
                    storageUtils.removeUser()
                    this.props.history.replace('/login')
                    message.success('当前用户角色权限成功，请重新登录')
                } else {
                    message.success('设置角色权限成功')
                    this.setState({
                        roles: [...this.state.roles],
                        confirmLoading: false,
                        isShowAuth: false
                    })
                }
                // message.success('设置角色权限成功');
                //
                // //可以直接请求接口获取最新的数据或者更新state中的roles
                // this.setState({
                //     roles: [...this.state.roles],
                //     confirmLoading: false,
                //     isShowAuth: false
                // });
            } else {
                message.success('设置角色权限失败');
                this.setState({confirmLoading: false});
            }
        }).catch(() => {
            this.setState({confirmLoading: false});
        });
    }


    // 将要挂载组件的时候执行
    componentWillMount () {
        this.initColumn();
    }

    //异步请求获取数据
    componentDidMount () {
        this.getRoles();
    }

    render() {
        const { roles, role, loading, confirmLoading, isShowAdd, isShowAuth} = this.state;

        const title = (
            <span>
                <Button type='primary'
                        style={{marginRight: 50}}
                        onClick={() => this.setState({isShowAdd: true})}
                >创建角色</Button>
                <Button type='primary'
                        disabled={!role._id}
                        onClick={() => this.setState({isShowAuth: true})}
                >设置角色权限</Button>
            </span>
        )

        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey='_id'
                        loading={loading}
                        dataSource={roles}
                        columns={this.columns}
                        pagination={{defaultPageSize: PAGE_SIZE}}
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: [role._id],
                            onSelect: (role) => {
                                this.setState({role});
                            }
                        }}
                        onRow={this.onRow}
                    />
                </Card>

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    confirmLoading={confirmLoading}
                    onCancel={() => {
                        this.setState({isShowAdd: false});
                        this.AddForm.props.form.resetFields();
                    }}
                >
                    <AddForm
                        addRole={this.addRole}
                        wrappedComponentRef={(inst) => {this.AddForm = inst;}}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    confirmLoading={confirmLoading}
                    onCancel={() => {this.setState({isShowAuth: false});}}
                >
                    <AuthForm ref={auth => this.auth = auth} role={role}/>
                </Modal>
            </div>
        );
    }
}

export default Role;
