import React, {Component} from "react";
import {Card, Icon, List, Tooltip, message} from "antd";

import LinkButton from "../../components/link-button";
import {reqCategory} from '../../api';
import {BASE_IMG_URL} from "../../utils/constants";


const ListItem = List.Item;

class ProductDetail extends Component{
    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    componentDidMount () {

        // 得到当前商品的分类ID
        const {pCategoryId, categoryId} = this.props.location.state.product;
        if(pCategoryId === '0') { // 一级分类下的商品
            reqCategory(categoryId).then(res => {
                if (res.status === 0){
                    const cName1 = res.data.name;
                    this.setState({cName1});
                } else {
                    message.error('查询商品分类失败');
                }
            }).catch(err => {
                console.log(err);
            });

        } else { // 二级分类下的商品
            // 一次性发送多个请求, 只有都成功了, 才正常处理
            Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]).then(res => {
                if (res[0].status === 0 && res[1].status === 0){
                    const cName1 = res[0].data.name;
                    const cName2 = res[1].data.name;
                    this.setState({cName1, cName2});
                } else {
                    message.error('查询商品分类失败');
                }
            }).catch(err => {
                console.log(err);
            });
        }

    }
    render() {
        //取出值，父路由的this.props.history.push()方法的第二个参数指定
        const {name, desc, price, detail, imgs} = this.props.location.state.product;
        const {cName1, cName2} = this.state;

        const title = (
            <span>
                <LinkButton>
                    <Tooltip title='点击返回商品列表'>
                        <Icon
                            type='arrow-left'
                            style={{marginRight: 10, fontSize: 20}}
                            onClick={() => this.props.history.goBack()}
                        />
                    </Tooltip>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card title={title} className='product-detail'>
                <List>
                    <ListItem>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </ListItem>
                    <ListItem>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </ListItem>
                    <ListItem>
                        <span className="left">商品价格:</span>
                        <span>{price} 元</span>
                    </ListItem>
                    <ListItem>
                        <span className="left">所属分类:</span>
                        <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
                    </ListItem>
                    <ListItem>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        className="product-img"
                                        alt="img"
                                    />
                                ))
                            }
                        </span>
                    </ListItem>
                    <ListItem>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </ListItem>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;