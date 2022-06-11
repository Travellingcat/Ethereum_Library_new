import React, { Component } from "react";
import {Table, Space} from 'antd';
import "antd/dist/antd.css";


class AdminMoney extends Component {

    state = {
        my_data: [],
    }

    columns = [
      {
        title: '用户地址',
        dataIndex: 'useraddress',
      },
      {
        title: '书名',
        dataIndex: 'book_name',
      },
      {
          title: '借/还',
          dataIndex: 'borrowedOrReturn',
      },
      {
          title: '操作时间',
          dataIndex: 'time',
          defaultSortOrder: 'descend',
          sorter: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      },
      {
          title: '支付金额/PigKing',
          dataIndex: 'pay',
      },
  ];

  componentDidMount() {
     this.getRecord()
  }

  getRecord = ()=> {
      let tmp = [];
      this.props.contract.methods.getRecords().call().then(re=>{
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


    render() {
        return (
            <div>
                <Space direction="vertical"  size="middle" style={{ display: 'flex' }}>
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

export default AdminMoney;