import React, {Component} from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import "./product.less";
import ProductHome from "./home";
import ProductAddUpdate from "./addUpdate";
import ProductDetail from "./detail";

//商品组件
class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product'/>
            </Switch>
        );
    }
}

export default Product;
