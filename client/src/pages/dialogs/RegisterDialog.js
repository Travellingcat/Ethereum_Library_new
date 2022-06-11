import React, { Component } from "react";
import {Modal, Form, Input, message} from "antd";


class RegisterDialog extends Component {
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

    inArray = (search,array)=>{
        for(var i in array){
            if(array[i]===search){
                return true;
            }
        }
        return false;
    }

    handleOk = () => {
        this.setState({
            visible: false,
         });
        this.formRef.current.validateFields().then(values => {
            console.log(values)
            this.props.contract.methods.getUsers().call().then(re=>{
              let tmp = [];
              for(var i=0; i<re.length; i++){
                this.props.ipfs.cat(re[i][1]).then(r1=>{
                  tmp.push(JSON.parse(r1.toString()).user_address);
                })
              }
          
              setTimeout(()=>{
                if(this.inArray(values.useraddress, tmp)){
                  message.info('该账户已注册!')
                }
                else{
                  const tmp_hash = re[re.length-1][1];
                  this.props.ipfs.cat(tmp_hash).then(res=>{
                    const tmp_id = parseInt(JSON.parse(res.toString()).user_id)+1;
                    // console.log(tmp_id);
                    const data = {
                      "user_id": tmp_id.toString(),
                      "user_address": values.useraddress,
                      "user_password": values.password,
                    };
                    const data_buff = Buffer.from(JSON.stringify(data));
                    this.props.ipfs.add(data_buff).then(ress=>{
                      this.props.contract.methods.addUser(ress[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(resss=>{
                        message.info('注册成功!');
                      }).catch(err=>{
                        console.log(err)
                        message.error('操作失败!')
                      })
                    })
                  })
                }
              }, 100);
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
                    title="账户注册"
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout}
                          name="stu-messages"
                          ref={this.formRef}
                          onFinish={this.onFinish}
                          validateMessages={this.validateMessages}>
                      <Form.Item name='useraddress' label="账户地址" rules={[{required: true, message: '请输入账户地址!'}]}>
                        <Input/>
                      </Form.Item>
                      <Form.Item name='password' label="密码" rules={[{required: true, message: '请输入密码!'}]}>
                        <Input/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default RegisterDialog;