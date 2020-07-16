import React, {Component} from "react";
import {Card, Button} from "antd";
import ReactEcharts from "echarts-for-react";


//折线图组件
class Line extends Component{
    state = {
        sales: [5, 20, 36, 10, 10, 20], // 销量的数组
        stores: [6, 10, 25, 20, 15, 10], // 库存的数组
    }

    //配置项
    getOption = (sales, stores) => {
        return {
            title: {
                text: 'ECharts 入门示例',
                // left: 'center'
            },
            tooltip: {},
            legend: {
                // orient: 'vertical',
                // left: 'left',
                data:['销量', '库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '销量',
                type: 'line',
                label: {
                    show: true,
                    position: 'top'
                },
                data: sales
            }, {
                name: '库存',
                type: 'line',
                label: {
                    show: true,
                    position: 'top'
                },
                data: stores
            }]
        }
    }

    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            stores: state.stores.reduce((pre, store) => {
                pre.push(store-1)
                return pre
            }, []),
        }))
    }

    render() {
        const {sales, stores} = this.state;
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.update}>更新</Button>
                </Card>

                <Card title="柱状图一">
                    <ReactEcharts option={this.getOption(sales, stores)} />
                </Card>
            </div>
        );
    }
}

export default Line;