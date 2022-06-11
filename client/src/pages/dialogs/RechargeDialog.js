import React, { Component } from "react";
import {Modal, Form, InputNumber, message} from "antd";


class RechargeDialog extends Component {
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
            console.log(values.recharge)
            this.props.pig_contract.methods.transferFrom('0x7942799425A0920Bf3c4B9D859B351CdC00Cc921', this.props.accounts[0], values.recharge).send({from: this.props.accounts[0], gas: 4700000}).then(re=>{
              message.info('充值成功!')
              this.props.getPigKing();
            }).catch(err=>{
              console.log(err)
              message.error('操作失败!')
            });
        }).catch(err => {
            console.log(err)
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
                    title="代币充值"
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
                      <Form.Item name='recharge' label="数量" rules={[{type: 'number', min: 1, max: 99, required: true, message: '请输入代币数量!'}]}>
                        <InputNumber/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default RechargeDialog;