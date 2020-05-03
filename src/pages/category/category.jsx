import React, {Component} from "react";
import {Card, Table, Button, Icon, message, Modal, Divider} from "antd";

import LinkButton from "../../components/link-button";

//商品分类组件
class Category extends Component{

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
                        <LinkButton >修改分类</LinkButton>
                        <Divider type="vertical"/>
                        <LinkButton >查看子分类</LinkButton>
                    </span>
                )
            }
        ]
    }

    //为第一次render()准备数据,初始化列
    componentWillMount () {
        this.initColumns();
    }


    render() {
        // card的左侧
        const title = '一级分类列表';

        // card的右侧
        const extra = <Button type='primary' icon="plus">添加</Button>

        //模拟数据源，后期利用接口
        const dataSource = [
            {
                "parentId": "0",
                "_id": "5c2ed631f352726338607046",
                "name": "分类001",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "5c2ed647f352726338607047",
                "name": "分类2",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "5c2ed64cf352726338607048",
                "name": "1分类3",
                "__v": 0
            }
        ];
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={dataSource}
                        columns={this.columns}
                    />
                </Card>
            </div>
        );
    }
}

export default Category;