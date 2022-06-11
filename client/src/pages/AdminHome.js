import React, { Component } from "react";
import {Layout, Menu} from 'antd';
import "antd/dist/antd.css";
import { UserOutlined, ReadOutlined, TransactionOutlined, TeamOutlined } from '@ant-design/icons';
import AdminPage from "./funpages/AdminPage";
import AdminUser from "./funpages/AdminUser";
import AdminMoney from "./funpages/AdminMoney";
import AdminBook from "./funpages/AdminBook";


const {Content, Sider } = Layout;

class AdminHome extends Component {
    state = {
        menu_choice: 1,         //功能选择
    }

    componentDidMount() {
        
    }

    render() {
        let Message
        if(this.state.menu_choice === 1){
            Message = (
                <AdminPage 
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
                <AdminMoney
                useraddress={this.props.useraddress}
                contract={this.props.contract}
                accounts={this.props.accounts}
                ipfs={this.props.ipfs}/>
            )
        }
        else if(this.state.menu_choice === 3){
            Message = (
                <AdminUser
                useraddress={this.props.useraddress}
                contract={this.props.contract}
                accounts={this.props.accounts}
                ipfs={this.props.ipfs}/>
            )
        }
        else if(this.state.menu_choice === 4){
            Message = (
                <AdminBook
                useraddress={this.props.useraddress}
                contract={this.props.contract}
                accounts={this.props.accounts}
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
                            <Menu.Item key="2" icon={<TransactionOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 2,
                                })
                            }}>
                                借阅/收款记录
                            </Menu.Item>
                            <Menu.Item key="3" icon={<TeamOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 3,
                                })
                            }}>
                                用户管理
                            </Menu.Item>
                            <Menu.Item key="4" icon={<ReadOutlined />} onClick={()=>{
                                // 修改当前功能
                                this.setState({
                                    menu_choice: 4,
                                })
                            }}>
                                书籍管理
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <div style={{ marginLeft: '40px', marginTop: '15px'}}>当前登录：管理员 / {this.props.useraddress}</div>
                        <div style={{ background: '#fff', padding: 24, minHeight: 580, marginLeft:'40px', marginTop: '15px', marginRight:'40px'}}>
                            {Message}
                        </div>
                    </Content>
                  </Layout>
            </div>
        );
    }
}

export default AdminHome;