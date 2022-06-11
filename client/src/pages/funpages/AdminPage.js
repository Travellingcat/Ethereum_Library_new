import React, { Component } from "react";
import {Table, Button, Space, Row, Col} from 'antd';
import "antd/dist/antd.css";
import UpdatePasswordDialog from '../dialogs/UpdatePasswordDialog';

var moment = require('moment');

class AdminPage extends Component {

    state = {
        pigking: 0,
        borrowed_books: 0,
        my_data: [],
        showUpdatePasswordDialog: false,
    }

    columns = [
      {
        title: '书籍编号',
        dataIndex: 'book_id',
      },
        {
        title: '书名',
        dataIndex: 'book_name',
      },
      {
        title: '作者',
        dataIndex: 'book_author',
      },
      {
        title: '借阅人',
        dataIndex: 'borrowed_by',
      },
      {
        title: '借阅时间',
        dataIndex: 'borrowed_time',
      },
      {
        title: '已借时间',
        dataIndex: 'passed_time',
      },
  ];

  componentDidMount() {
    this.getPigKing();
    this.getBook();
  }

  getBook = ()=> {
    let tmp = [];
      this.props.contract.methods.getBooks().call().then(re=>{
          for(var i=0; i<re.length; i++){
              this.props.ipfs.cat(re[i][1]).then(res=>{
                console.log(JSON.parse(res.toString()))
                if(JSON.parse(res.toString()).borrowed === '否'){
                  var ret = JSON.parse(res.toString());
                  const date1 = moment().format("YYYY-MM-DD HH:mm:ss");
                  const date2 = JSON.parse(res.toString()).borrowed_time;
                  const date3 = moment(date1).diff(date2,'minute');
                  const passed_h = Math.floor(date3/60);
                  const passed_m = date3%60;
                  ret.passed_time = passed_h+'小时'+passed_m+'分';
                  tmp.push(ret);
                }
              })
          }
          setTimeout(()=>{this.setState({
            my_data: tmp,
            borrowed_books: tmp.length,
          })}, 100)
      })
  }

  getPigKing = ()=>{
    this.props.pig_contract.methods.balanceOf(this.props.accounts[0]).call().then(re=>{
        this.setState({
          pigking: re
        })
    }).catch(err=>{
        console.log(err)
    });
}

  onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }


  onUpdatePass = ()=>{
    this.setState({
        showUpdatePasswordDialog: true,
    })
}

    render() {
        return (
            <div>
                <Space direction="vertical"  size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={4}>
                            <Space>
                                账户余额: {this.state.pigking} BookKing
                            </Space>
                        </Col>
                        <Col span={2} offset={18}>
                            <Button onClick={this.onUpdatePass}>密码修改</Button>
                        </Col>
                    </Row>
                
                    <Space direction="vertical" style={{ display: 'flex' }}>
                        <div>
                            当前未还: {this.state.borrowed_books} 本
                        </div>
                        <div>
                            当前借阅:
                        </div>
                        <Table
                        columns={this.columns}
                        dataSource={this.state.my_data}
                        onChange={this.onChange}
                        rowKey={item=>item.id}
                        pagination={{pageSize: 10}}
                        scroll={{ y: 340}} />
                    </Space>
                </Space>

                <UpdatePasswordDialog
                visible={this.state.showUpdatePasswordDialog}
                contract={this.props.contract}
                accounts={this.props.accounts}
                ipfs={this.props.ipfs}
                afterClose={()=>{
                    this.setState({
                        showUpdatePasswordDialog: false,
                    })
                }}/>

            </div>
        );
    }
}

export default AdminPage;