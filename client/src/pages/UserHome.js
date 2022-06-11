import React, { Component } from "react";
import {Layout, Menu} from 'antd';
import "antd/dist/antd.css";
import { UserOutlined, ReadOutlined} from '@ant-design/icons';
import UserPage from "./funpages/UserPage";
import UserBook from "./funpages/UserBook";


const {Content, Sider } = Layout;

class UserHome extends Component {
    state = {
        menu_choice: 1,         //功能选择
    }

    componentDidMount() {
        
    }

    render() {
        let Message
        if(this.state.menu_choice === 1){
            Message = (
                <UserPage 
                useraddress={this.props.useraddress}
                web3={this.props.web3}
                accounts={this.props.accounts}
                contract={this.props.contract}
                pig_contract={this.props.pig_contract}
                ipfs={this.props.ipfs}/>
            )
        }
        else if(this.state.menu_choice === 2){
            Message = (
                <UserBook 
                useraddress={this.props.useraddress}
                web3={this.props.web3}
                accounts={this.props.accounts}
                contract={this.props.contract}
                pig_contract={this.props.pig_contract}
                ipfs={this.props.ipfs}/>
            )
        }
        return (
            <div>
                <Layout>
                    <Sider theme={"light"}>
                        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<UserOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 1,
                                })
                            }}>
                                个人主页
                            </Menu.Item>
                            <Menu.Item key="2" icon={<ReadOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 2,
                                })
                            }}>
                                书籍信息
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <div style={{ marginLeft: '40px', marginTop: '15px'}}>当前登录：普通用户 / {this.props.useraddress}</div>
                        <div style={{ background: '#fff', padding: 24, minHeight: 580, marginLeft:'40px', marginTop: '15px', marginRight:'40px'}}>
                            {Message}
                        </div>
                    </Content>
                  </Layout>
            </div>
        );
    }
}

export default UserHome;