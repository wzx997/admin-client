import React, {Component} from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import "./product.less";
import ProductHome from "./home";
import ProductAddUpdate from "./addupdate";
import ProductDetail from "./detail";

//商品组件
class Product extends Component{
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/product' component={ProductHome} exact/>
                    <Route path='/product/addupdate' component={ProductAddUpdate}/>
                    <Route path='/product/detail' component={ProductDetail}/>
                    <Redirect to='/product'/>
                </Switch>
            </div>
        );
    }
}

export default Product;