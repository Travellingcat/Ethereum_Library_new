import React, { Component } from "react";
import {Modal, Form, Input, message} from "antd";


class AddBookDialog extends Component {
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

    handleOk = () => {
        this.formRef.current.validateFields().then(values => {
          console.log(values);
          this.props.contract.methods.getBooks().call().then(re=>{
            console.log('re:',re)   // 0: Array [ "0", "QmdRX6ouj2ZExgehW4bMaNehGA2Nk3QZ9dyDnmbUiFAaBN" ]
            const tmp_hash = re[re.length-1][1];
            this.props.ipfs.cat(tmp_hash).then(res=>{
              const tmp_id = parseInt(JSON.parse(res.toString()).book_id)+1;
              // console.log(tmp_id);
              const data = {
                "book_id": tmp_id.toString(),
                "book_name": values.book_name,
                "book_author": values.book_author,
                "borrowed": "是",
                "borrowed_by": "",
                "borrowed_time": "",
                "passed_time": "",
              };
              const data_buff = Buffer.from(JSON.stringify(data));
              this.props.ipfs.add(data_buff).then(ress=>{
                this.props.contract.methods.addBook(ress[0].hash).send({from: this.props.accounts[0], gas: 4700000}).then(resss=>{
                  message.info('添加成功!');
                  this.props.getBook()
                }).catch(err=>{
                  console.log(err)
                  message.error('操作失败!')
                })
              })
            })
          })
        }).catch(err => {
          message.info('操作失败！')
        });
        this.setState({
          visible: false,
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
                    title="添加书籍"
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Form {...this.layout} name="t-messages" ref={this.formRef} onFinish={this.onFinish} validateMessages={this.validateMessages}>
                      <Form.Item name='book_name' label="书名" rules={[{required: true, message: '请输入书名!'}]}>
                        <Input/>
                      </Form.Item>
                      <Form.Item name='book_author' label="作者" rules={[{required: true, message: '请输入作者!'}]}>
                        <Input/>
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default AddBookDialog;