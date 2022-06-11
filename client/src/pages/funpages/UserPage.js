import React, { Component } from "react";
import {Table, Button, message, Space, Row, Col, notification} from 'antd';
import "antd/dist/antd.css";
import RechargeDialog from '../dialogs/RechargeDialog';
import UpdatePasswordDialog from '../dialogs/UpdatePasswordDialog';


var moment = require('moment');

class UserPage extends Component {

    state = {
        pigking: 0,
        borrowed_books: 0,
        uptoTime_books: 0,
        my_data: [],
        showRechargeDialog: false,
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
      title: '借阅时间',
      dataIndex: 'borrowed_time',
    },
    {
      title: '已借时间',
      dataIndex: 'passed_time',
    },
    {
      title: '操作',
      render: (_, record)=>(
          <span>
              <a onClick={()=>this.onReturn(record)}>还书</a>
          </span>
      ),
      width: "100px",
    },
  ];

  componentDidMount() {
     this.getPigKing();
     this.getBook();
  }

  onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

  openNotification = placement => {
    notification.warning({
        message: '超时提示',
        description:
        '您的此次借阅记录已超时!需要进行支付!',
        placement,
    });
  };

  onReturn = (item)=>{
    console.log(item)    // { book_id: "10011", book_name: "三国演义", book_author: "罗贯中", borrowed: "是" }
    const p_hours = item.passed_time.split("小时");
    if(p_hours[0] >= 1){
        this.openNotification('top');
        const pay_m = p_hours[0];
        this.props.pig_contract.methods.transfer('0x017116f751108DF250D9F7230886D6816Be32621', pay_m).send({from: this.props.accounts[0], gas: 4700000}).then(re=>{
              this.getPigKing();
        }).catch(err=>{
              console.log(err)
              message.error('操作失败!')
        });
    }
    const now_time = moment().format("YYYY-MM-DD HH:mm:ss");
    this.props.contract.methods.getBooks().call().then(re=>{
      for(var i=0; i<re.length; i++){
        const re_id = re[i][0];             // 注意这个const，被坑惨了！
        this.props.ipfs.cat(re[i][1]).then(res=>{
          if(JSON.parse(res.toString()).book_id === item.book_id){
            const data = {
              "book_id": JSON.parse(res.toString()).book_id,
              "book_name": JSON.parse(res.toString()).book_name,
              "book_author": JSON.parse(res.toString()).book_author,
              "borrowed": "是",
              "borrowed_by": "",
              "borrowed_time": "",
              "passed_time": "",
            };
            const data_buff = Buffer.from(JSON.stringify(data));
            this.props.ipfs.add(data_buff).then(ress=>{
              this.props.contract.methods.updateBook(re_id, ress[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(r1=>{
                  const data2 = {
                    "useraddress": this.props.accounts[0],
                    "book_name": JSON.parse(res.toString()).book_name,
                    "borrowedOrReturn": "还",
                    "time": now_time,
                    "pay": p_hours[0],
                  };
                  const data2_buff = Buffer.from(JSON.stringify(data2));
                  this.props.ipfs.add(data2_buff).then(ressss=>{
                    this.props.contract.methods.addRecord(ressss[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(resss=>{
                        message.info('还书成功!');
                        this.getBook();
                    }).catch(err=>{
                        console.log(err)
                            message.error('操作失败!')
                    });
                  })
              }).catch(err=>{
                  console.log(err)
                  message.error('操作失败!')
              });
            })
            
          }
        })
      }
    })
  }

  onRecharge = ()=>{
      this.setState({
        showRechargeDialog: true,
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

  getBook = ()=> {
    let tmp = [];
    let uptotime = 0;
      this.props.contract.methods.getBooks().call().then(re=>{
          for(var i=0; i<re.length; i++){
              this.props.ipfs.cat(re[i][1]).then(res=>{
                // console.log(JSON.parse(res.toString()))
                if(JSON.parse(res.toString()).borrowed_by === this.props.accounts[0]){
                  var ret = JSON.parse(res.toString());
                  const date1 = moment().format("YYYY-MM-DD HH:mm:ss");
                  const date2 = JSON.parse(res.toString()).borrowed_time;
                  const date3 = moment(date1).diff(date2,'minute');
                  const passed_h = Math.floor(date3/60);
                  if(passed_h >= 1){
                      uptotime += 1;
                  }
                  const passed_m = date3%60;
                  ret.passed_time = passed_h+'小时'+passed_m+'分';
                  tmp.push(ret);
                }
              })
          }
          setTimeout(()=>{this.setState({
            my_data: tmp,
            borrowed_books: tmp.length,
            uptoTime_books:uptotime,
          })}, 100)
      })
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
                                <Button type="primary" onClick={this.onRecharge}>充值</Button>
                            </Space>
                        </Col>
                        <Col span={2} offset={18}>
                            <Button onClick={this.onUpdatePass}>密码修改</Button>
                        </Col>
                    </Row>
                
                    <Space direction="vertical" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={4}>
                                <div>
                                    当前未还: {this.state.borrowed_books} 本
                                </div>
                            </Col>
                            <Col span={4}>
                                <div>
                                    已超时: {this.state.uptoTime_books} 本 （免费借阅时间1小时，超时将按每小时 1 BookKing的金额进行收费！）
                                </div>
                            </Col>
                        </Row>
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

                <RechargeDialog
                visible={this.state.showRechargeDialog}
                web3={this.props.web3}
                accounts={this.props.accounts}
                pig_contract={this.props.pig_contract}
                getPigKing={this.getPigKing}
                afterClose={()=>{
                    this.setState({
                        showRechargeDialog: false,
                    })
                    // setTimeout(()=>{this.getPigKing();}, 100);
                }}/>

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

export default UserPage;