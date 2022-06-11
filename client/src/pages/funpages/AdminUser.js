import React, { Component } from "react";
import {Table, Button, Space, Row, Col} from 'antd';
import "antd/dist/antd.css";
import DelUserDialog from '../dialogs/DelUserDialog';


class AdminUser extends Component {

    state = {
        my_data: [],
        showDelUser: false,
    }

    columns = [
    {
      title: '用户编号',
      dataIndex: 'user_id',
    },
      {
      title: '用户地址',
      dataIndex: 'user_address',
    },
    {
      title: '用户密码',
      dataIndex: 'user_password',
    },
  ];

  componentDidMount() {
     this.getUser()
  }

  getUser = ()=> {
    let tmp = [];
      this.props.contract.methods.getUsers().call().then(re=>{
          for(var i=0; i<re.length; i++){
              this.props.ipfs.cat(re[i][1]).then(res=>{
                console.log(JSON.parse(res.toString()))
                tmp.push(JSON.parse(res.toString()));
              })
          }
          setTimeout(()=>{this.setState({
            my_data: tmp,
          })}, 100)
      })
  }

  onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }


  onDelUser = ()=>{
    this.setState({
      showDelUser: true,
    })
  }
  

    render() {
        return (
            <div>
                <Space direction="vertical"  size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={6}>
                            <Space>
                                <Button type="primary" onClick={this.onDelUser}>删除用户</Button>
                            </Space>
                        </Col>
                    </Row>
                
                    <Space direction="vertical" style={{ display: 'flex' }}>
                        <Table
                        columns={this.columns}
                        dataSource={this.state.my_data}
                        onChange={this.onChange}
                        rowKey={item=>item.id}
                        pagination={{pageSize: 10}}
                        scroll={{ y: 340}} />
                    </Space>
                </Space>

                <DelUserDialog
                visible={this.state.showDelUser}
                contract={this.props.contract}
                accounts={this.props.accounts}
                ipfs={this.props.ipfs}
                getUser={this.getUser}
                afterClose={()=>{
                    this.setState({
                      showDelUser: false,
                    })
                }}/>

            </div>
        );
    }
}

export default AdminUser;