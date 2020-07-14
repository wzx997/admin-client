import React from "react";
import { Upload, Icon, Modal, message } from "antd"


import {reqDeleteImg} from "../../api";
import {BASE_IMG_URL} from "../../utils/constants";


// 用于图片上传的组件
class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    constructor (props) {
        super(props);

        let fileList = [];

        // 如果传入了imgs属性
        const {imgs} = this.props;
        if (imgs && imgs.length>0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己唯一的id
                name: img, // 图片文件名
                status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                url: BASE_IMG_URL + img
            }));
        }

        // 初始化状态
        this.state = {
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的url
            fileList // 所有已上传图片的数组
        };
    }

    // 获取所有已上传图片文件名的数组
    getImgs  = () => {
        return this.state.fileList.map(file => file.name);
    }

    // 预览模态框的取消
    handleCancel = () => {
        this.setState({ previewVisible: false })
    };

    // 打开预览模态框
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    // 监听上传中的文件变化
    handleChange = ({ file, fileList}) => {
        console.log(file);
        // 一旦上传成功, 将当前上传的file的信息修正(name, url)
        if(file.status==='done') {
            const result = file.response;  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            if(result.status === 0) {
                message.success('上传图片成功!');
                const {name, url} = result.data;
                file = fileList[fileList.length-1];//最后那个元素
                file.name = name;
                file.url = url;
            } else {
                message.error('上传图片失败');
            }
        } else if (file.status === 'removed') { // 删除图片
            reqDeleteImg(file.name).then(res => {
                if (res.status === 0) {
                    message.success('删除图片成功')
                } else {
                    message.error('删除图片失败')
                }
            }).catch(err => {
                console.log(err);
            });
        } else if (file.status === 'error'){
            message.error('上传图片失败')
        }

        // 在操作(上传/删除)过程中更新fileList状态
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload"
                    accept='image/*'
                    name='image'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;
