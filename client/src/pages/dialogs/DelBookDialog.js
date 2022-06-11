import React, { Component } from "react";
import {Modal, Form, Input, message} from "antd";


class DelBookDialog extends Component {
    state ={
        visible: false,
    }
    formRef = React.createRef();

    componentWillReceiveProps(newProps) {
        //可以传递父组件值进来
        if(this.state.visible !== newProps.visible){
            this.setState({
                visible: newProps.visible       //子组件和父组件一致
            });
        }
    }

    handleOk = () => {
        this.setState({
            visible: false,
         });
        this.formRef.current.validateFields().then(values => {
            // console.log(values)
            this.props.contract.methods.getBooks().call().then(re=>{
              for(var i=0; i<re.length; i++){
                const re_id = re[i][0];
                this.props.ipfs.cat(re[i][1]).then(res=>{
                  if(JSON.parse(res.toString()).book_id === values.book_id){
                    if(JSON.parse(res.toString()).borrowed === '否'){
                      message.error('操作失败!')
                    }
                    else {
                      this.props.contract.methods.delBook(parseInt(re_id)).send({from: this.props.accounts[0], gas: 4700000}).then(ress=>{
                        message.info('删除成功!')
                        this.props.getBook()
                      }).catch(err=>{
                        console.log(err)
                        message.error('操作失败!')
                      })
                    }
                    
                  }
                })
              }
            })
        }).catch(err => {
            message.info('操作失败！')
        });
        this.props.afterClose();
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        })
        this.props.afterClose();
    };

    layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
      },
      number: {
        range: '${label} must be between ${min} and ${max}',
      },
    };

    onFinish = (values) => {
        console.log(values);
      };

    render() {
        return(
            <div>
                <Modal
                    title="删除书籍"
                    okText="确认"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout}
                          name="stu-messages"
                          ref={this.formRef}
                          onFinish={this.onFinish}
                          validateMessages={this.validateMessages}>
                      <Form.Item name='book_id' label="书籍编号" rules={[{required: true, message: '请输入书籍编号!'}]}>
                        <Input placeholder='删除前请确认相关信息已清理！'/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default DelBookDialog;