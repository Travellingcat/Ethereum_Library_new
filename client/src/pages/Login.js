import React, { Component } from "react";
import "antd/dist/antd.css";
import {Form, Input, Button, message} from 'antd';
import ethlogo from '../imgs/ethlogo.png';
import RegisterDialog from "./dialogs/RegisterDialog";

// const ipfsAPI = require('ipfs-api');
// const ipfs = ipfsAPI({
//     host: 'localhost',
//     port: '5001',
//     protocol: 'http'
//   });

class Login extends Component {

    state = {
        showRegisterDialog: false,
        noregister: true,
    }

    componentDidMount() {
        
    }


    // 登录表单提交后的处理函数
    onFinish = (values) => {
        if(values.useraddress === '0x017116f751108DF250D9F7230886D6816Be32621'){
            const u = {
                "admin_address": values.useraddress,
                "admin_password": values.password,
            };
            const u_buff = Buffer.from(JSON.stringify(u));
            this.props.ipfs.add(u_buff).then(res=>{
                this.props.contract.methods.getAdmin().call().then(re=>{
                    // console.log('res:',res[0].hash)
                    // console.log('re:',re)
                    if(res[0].hash === re){
                        this.props.switchLogin({useraddress: values.useraddress, categ: 'admin'});
                    }
                    else{
                        message.error('账户地址或密码有错!')
                    }
                }).catch(err=>[
                    console.log(err)
                ])
            }).catch(err=>[
                console.log(err)
            ])
        }
        else {
            this.props.contract.methods.getUsers().call().then(re=>{
                for(var i=0; i<re.length; i++){
                  const re_detail = re[i][1];
                  this.props.ipfs.cat(re[i][1]).then(res=>{
                    if(JSON.parse(res.toString()).user_address === values.useraddress){
                      const data = {
                        "user_id": JSON.parse(res.toString()).user_id,
                        "user_address": values.useraddress,
                        "user_password": values.password,
                      };
                      const data_buff = Buffer.from(JSON.stringify(data));
                      this.props.ipfs.add(data_buff).then(ress=>{
                        if(ress[0].hash === re_detail){
                            this.props.switchLogin({useraddress: values.useraddress, categ: 'user'});
                        }
                        else {
                            message.error('账户地址或密码有错!')
                        }
                      })
                    }
                  })
                }
            })
        }
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    onRegister = () => {
        this.setState({
            showRegisterDialog: true,
        })
    }

    render() {

        return (
            <div>
                <div><img style={{height:'250px', width:'250px', position:'absolute', marginTop:'6%', marginLeft:'25%'}} src={ethlogo} alt="" /></div>
                <div style={{height:'20px', width:'80px', position:'absolute', marginTop:'295px', marginLeft:'54%'}}>
                    <a style={{fontSize:'12px', fontStyle:'italic'}} onClick={this.onRegister}>未注册？</a>
                </div>

                <div style={{margin:"170px auto", height:'80%', width:'40%'}}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 12,
                            }}
                            initialValues={{
                                remember: true,
                                useraddress: this.state.account,
                            }}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item label="账户地址" name="useraddress"
                                       rules={[{required: true, message: '请输入账户地址!',},]}>
                                <Input id="input_add"/>
                            </Form.Item>

                            <Form.Item label="密码" name="password"
                                       rules={[{required: true, message: '请输入密码!',},]}>
                                <Input.Password/>
                            </Form.Item>

                            <Form.Item wrapperCol={{offset: 12, span: 16,}}>
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                </div>

                <RegisterDialog
                visible={this.state.showRegisterDialog}
                contract={this.props.contract}
                accounts={this.props.accounts}
                ipfs={this.props.ipfs}
                afterClose={()=>{
                    this.setState({
                        showRegisterDialog: false,
                    })
                }}/>
            </div>
        );
    }
}

export default Login;