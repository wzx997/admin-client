import React, {Component} from "react";
import {Icon, Card, Statistic, DatePicker, Timeline} from "antd";
import moment from "moment";

import Line from "./line";
import Bar from "./bar";

const dateFormat = 'YYYY/MM/DD';
const {RangePicker} = DatePicker;

//Home组件
class Home extends Component {
    render() {

        return (
            <div>
                <Card>
                    <div style={{height: 300}}>

                        <div style={{float: "left"}}>
                            <Card
                                title="商品总量"
                                extra={<Icon style={{color: 'rgba(0,0,0,.45)'}} type="question-circle"/>}
                                style={{width: 250, marginTop: 40, marginLeft: 30}}
                                headStyle={{color: 'rgba(0,0,0,.45)'}}
                            >
                                <Statistic
                                    value={1128163}
                                    suffix="个"
                                    style={{fontWeight: 'bolder'}}
                                />
                                <Statistic
                                    value={15}
                                    valueStyle={{fontSize: 15}}
                                    prefix={'周同比'}
                                    suffix={<div>%<Icon style={{color: 'red', marginLeft: 10}} type="arrow-down"/>
                                    </div>}
                                />
                                <Statistic
                                    value={10}
                                    valueStyle={{fontSize: 15}}
                                    prefix={'日同比'}
                                    suffix={<div>%<Icon style={{color: '#3f8600', marginLeft: 10}} type="arrow-up"/>
                                    </div>}
                                />
                            </Card>
                        </div>
                        <div style={{float: "right"}}>
                            <Line/>
                        </div>
                    </div>

                    <div>
                        <Card
                            title="访问量"
                            extra={<RangePicker
                                defaultValue={[moment('2020/01/01', dateFormat), moment('2020/12/31', dateFormat)]}
                                format={dateFormat}
                            />}
                        >
                            <div style={{float: "left"}}>
                                <Card
                                    title='访问趋势'
                                    style={{height: 450}}
                                    bodyStyle={{width:550, marginLeft: 30}}
                                >
                                    <Bar/>
                                </Card>
                            </div>

                            <div style={{float: "right"}}>
                                <Card
                                    title='任务'
                                    style={{width: 500, height: 450}}
                                >
                                    <Timeline>
                                        <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                                        <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                                        <Timeline.Item color="red">
                                            <p>联调接口</p>
                                            <p>功能验收</p>
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <p>登录功能设计</p>
                                            <p>权限验证</p>
                                            <p>页面排版</p>
                                        </Timeline.Item>
                                    </Timeline>
                                </Card>
                            </div>
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default Home;