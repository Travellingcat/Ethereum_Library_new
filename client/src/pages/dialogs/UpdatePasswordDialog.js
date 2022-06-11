import React, { Component } from "react";
import {Modal, Form, Input, message} from "antd";


class UpdatePasswordDialog extends Component {
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
            console.log(values)
            if(this.props.accounts[0] === '0x017116f751108DF250D9F7230886D6816Be32621'){
              // admin
              const data = {
                "admin_address": this.props.accounts[0],
                "admin_password": values.password,
              };
              const data_buff = Buffer.from(JSON.stringify(data));
              this.props.ipfs.add(data_buff).then(re=>{
                this.props.contract.methods.updateAdmin(re[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(res=>{
                  message.info('修改成功!');
                }).catch(err=>{
                  console.log(err)
                  message.error('操作失败!')
                })
              })
            }
            else {
              this.props.contract.methods.getUsers().call().then(re=>{
                for(var i=0; i<re.length; i++){
                  var re_id = re[i][0];
                  this.props.ipfs.cat(re[i][1]).then(res=>{
                    if(JSON.parse(res.toString()).user_address === this.props.accounts[0]){
                      const data = {
                        "user_id": JSON.parse(res.toString()).user_id,
                        "user_address": JSON.parse(res.toString()).user_address,
                        "user_password": values.password,
                      };
                      const data_buff = Buffer.from(JSON.stringify(data));
                      this.props.ipfs.add(data_buff).then(ress=>{
                        this.props.contract.methods.updateUser(re_id, ress[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(resss=>{
                          message.info('修改成功!');
                        }).catch(err=>{
                          console.log(err)
                          message.error('操作失败!')
                        })
                      })
                    }
                  })
                }
              })
            }
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
                    title="密码修改"
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
                      <Form.Item name='password' label="密码" rules={[{required: true, message: '请输入密码!'}]}>
                        <Input/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default UpdatePasswordDialog;