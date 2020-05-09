import React, {Component} from 'react';
import { Result, Button } from 'antd';
/*
前台404页面
 */
export default class NotFound extends Component {
    render() {
        console.log(this.props);
        return (
            <div>
                <Result
                    status="404"
                    title="404"
                    subTitle="访问出了一些问题，当前访问的页面不存在。"
                    extra={
                        <Button
                            type='primary'
                            onClick={() => this.props.history.replace('/home')}
                        >
                        回到首页
                    </Button>}
                />,
            </div>
        );
    }
}