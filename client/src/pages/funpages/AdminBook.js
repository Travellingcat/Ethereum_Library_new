import React, { Component } from "react";
import {Table, Button, Space, Row, Col, Input} from 'antd';
import "antd/dist/antd.css";
import AddBookDialog from '../dialogs/AddBookDialog';
import DelBookDialog from '../dialogs/DelBookDialog';

var moment = require('moment');

class AdminBook extends Component {

    state = {
        my_data: [],
        my_pure_data: [],
        showAddBook: false,
        showDelBook: false,
        qbn: null,
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
            width: "100px",
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
     this.getBook()
  }

  getBook = ()=> {
    let tmp = [];
      this.props.contract.methods.getBooks().call().then(re=>{
          for(var i=0; i<re.length; i++){
              this.props.ipfs.cat(re[i][1]).then(res=>{
                console.log(JSON.parse(res.toString()))
                var ret = JSON.parse(res.toString());
                const date1 = moment().format("YYYY-MM-DD HH:mm:ss");
                const date2 = JSON.parse(res.toString()).borrowed_time;
                const date3 = moment(date1).diff(date2,'minute');
                const passed_h = Math.floor(date3/60);
                const passed_m = date3%60;
                if(passed_m){
                    ret.passed_time = passed_h+'小时'+passed_m+'分';
                }
                tmp.push(ret);
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

  ResetBook = ()=>{
      this.setState({
          my_data: this.state.my_pure_data
      })
  }

  onAddBook = ()=>{
    this.setState({
        showAddBook: true,
    })
  }

  onDelBook = ()=>{
    this.setState({
        showDelBook: true,
    })
  }
  
  queryByName = (event)=>{
    if(event && event.target && event.target.value){
      let value = event.target.value;
      this.setState({
        qbn: value
      })
      console.log(value)
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
      this.setState({
        qbn: value
      })
      console.log(value)
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
                        <Col span={2} offset={4}>
                            <Button type="primary" onClick={this.onAddBook}>添加书籍</Button>
                        </Col>
                        <Col span={2}>
                            <Button type="primary" onClick={this.onDelBook}>删除书籍</Button>
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

                <AddBookDialog
                visible={this.state.showAddBook}
                useraddress={this.props.useraddress}
                contract={this.props.contract}
                accounts={this.props.accounts}
                ipfs={this.props.ipfs}
                getBook={this.getBook}
                afterClose={()=>{
                    this.setState({
                        showAddBook: false,
                    });
                }}/>

                <DelBookDialog
                visible={this.state.showDelBook}
                contract={this.props.contract}
                accounts={this.props.accounts}
                ipfs={this.props.ipfs}
                getBook={this.getBook}
                afterClose={()=>{
                    this.setState({
                        showDelBook: false,
                    })
                }}/>

            </div>
        );
    }
}

export default AdminBook;