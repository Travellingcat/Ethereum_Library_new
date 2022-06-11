import React, { Component } from "react";
import {Table, Button, message, Space, Row, Col, Input} from 'antd';
import "antd/dist/antd.css";

var moment = require('moment');

class UserBook extends Component {

    state = {
        my_data: [],
        my_pure_data: [],
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
        title: '是否可借',
        dataIndex: 'borrowed',
      },
      {
        title: '操作',
        render: (_, record)=>(
            <span>
                <a onClick={()=>this.onBorrow(record)}>借书</a>
            </span>
        ),
        width: "100px",
      },
  ];

  componentDidMount() {
     this.getBook()
  }

  getBook = ()=> {
      let tmp = [];
      this.props.contract.methods.getBooks().call().then(re=>{
          for(var i=0; i<re.length; i++){
              const re_id = re[i][0];
              this.props.ipfs.cat(re[i][1]).then(res=>{
                console.log(re_id, JSON.parse(res.toString()))
                if(JSON.parse(res.toString()).borrowed === '是'){
                  var tmp_data = {
                    book_id: JSON.parse(res.toString()).book_id,
                    book_name: JSON.parse(res.toString()).book_name,
                    book_author: JSON.parse(res.toString()).book_author,
                    borrowed: JSON.parse(res.toString()).borrowed,
                  }
                  tmp.push(tmp_data); 
                }
              })
          }
          setTimeout(()=>{this.setState({
            my_data: tmp,
            my_pure_data: tmp,
          })}, 100)
      })
  }

  onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

  onBorrow = (item)=>{
    console.log(item)    // { book_id: "10011", book_name: "三国演义", book_author: "罗贯中", borrowed: "是" }
    const now_time = moment().format("YYYY-MM-DD HH:mm:ss");
    this.props.contract.methods.getBooks().call().then(re=>{
      console.log(re)
      for(var i=0; i<re.length; i++){
        // console.log('i:',i);
        const re_id = re[i][0];         // 注意这个const，被坑惨了！
        console.log('---',i,re_id)
        this.props.ipfs.cat(re[i][1]).then(res=>{
          // console.log(i,re_id)
          if(JSON.parse(res.toString()).book_id === item.book_id){
            console.log(re_id)
            const data = {
              "book_id": JSON.parse(res.toString()).book_id,
              "book_name": JSON.parse(res.toString()).book_name,
              "book_author": JSON.parse(res.toString()).book_author,
              "borrowed": "否",
              "borrowed_by": this.props.accounts[0],
              "borrowed_time": now_time,
              "passed_time": "",
            };
            console.log(data)
            const data_buff = Buffer.from(JSON.stringify(data));
            this.props.ipfs.add(data_buff).then(ress=>{
              // console.log(re_id)  //3
              this.props.contract.methods.updateBook(re_id, ress[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(r1=>{
                const data2 = {
                  "useraddress": this.props.accounts[0],
                  "book_name": JSON.parse(res.toString()).book_name,
                  "borrowedOrReturn": "借",
                  "time": now_time,
                  "pay": "",
                };
                console.log(data2)
                const data2_buff = Buffer.from(JSON.stringify(data2));
                this.props.ipfs.add(data2_buff).then(ressss=>{
                  this.props.contract.methods.addRecord(ressss[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(r2=>{
                    message.info('借阅成功!');
                    this.getBook();
                  }).catch(err=>{
                    console.log(err)
                    message.error('操作失败!')
                  })
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

  queryByName = (event)=>{
    if(event && event.target && event.target.value){
      let value = event.target.value;
      let tmp = [];
      for(var i=0; i<this.state.my_pure_data.length; i++){
          if(this.state.my_pure_data[i].book_name.match(value)){
            tmp.push(this.state.my_pure_data[i])
          }
      }
      this.setState({
          my_data: tmp
      })
    }
  }

  queryByAuthor = (event)=>{
    if(event && event.target && event.target.value){
      let value = event.target.value;
      let tmp = [];
      for(var i=0; i<this.state.my_pure_data.length; i++){
          if(this.state.my_pure_data[i].book_author.match(value)){
            tmp.push(this.state.my_pure_data[i])
          }
      }
      this.setState({
          my_data: tmp
      })
    }
  }

  ResetBook = ()=>{
      this.setState({
          my_data: this.state.my_pure_data
      })
  }
  

    render() {
        return (
            <div>
                <Space direction="vertical"  size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={6}>
                            <Space>
                                书名查询: <Input onChange ={event => this.queryByName(event)}/>
                                <Button type="primary" onClick={this.ResetBook}>重置</Button>
                            </Space>
                        </Col>
                        <Col span={6} offset={2}>
                            <Space>
                                作者查询: <Input onChange ={event => this.queryByAuthor(event)}/>
                                <Button type="primary" onClick={this.ResetBook}>重置</Button>
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

            </div>
        );
    }
}

export default UserBook;