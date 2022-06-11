import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import EthLibraryContract from "./contracts/EtherLibrary.json";
import getWeb3 from "./getWeb3";
import 'antd/dist/antd.css';
import {Layout} from "antd";
import "./App.css";
import logo from './imgs/eth.png';
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";


const { Header} = Layout;

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({
    host: 'localhost',
    port: '5001',
    protocol: 'http'
  });


class App extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    pig_contract: null,
    ipfs: null,
    loginIn: {
      useraddress: '',       //当前登录账户地址
      category: '',       //登录类别（普通用户、admin）
    } 
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log('web3 accounts:', accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EthLibraryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EthLibraryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const pigContract = new web3.eth.Contract([
        {
          "constant": false,
          "inputs": [
            {
              "name": "_spender",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "name": "success",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "burn",
          "outputs": [
            {
              "name": "success",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_from",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "burnFrom",
          "outputs": [
            {
              "name": "success",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_to",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "from",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Burn",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_from",
              "type": "address"
            },
            {
              "name": "_to",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "name": "success",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "name": "initialSupply",
              "type": "uint256"
            },
            {
              "name": "tokenName",
              "type": "string"
            },
            {
              "name": "tokenSymbol",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "address"
            },
            {
              "name": "",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "name": "",
              "type": "uint8"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ], '0x2BE34Dc3CE617E588007204F2d8d59Bf7aC2C2a5');
      this.setState({
        pig_contract: pigContract,
      })

      this.setState({
        ipfs: ipfs,
      })

      this.addfun();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(50).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  //修改当前登录信息（loginIn）
  
  switchLogin = (value)=>{
    this.setState({
        loginIn: {useraddress: value.useraddress, category: value.categ},
    })
  }

  data = {
    "user_id": "1001",
    "user_address": "0x934Fbc8d14Ef7315987636A46ad36B0aa74D342A",
    "user_password": "123",
  };
  data_buff = Buffer.from(JSON.stringify(this.data));
  addfun = ()=>{
      this.state.ipfs.add(this.data_buff).then(re=>{
          // this.setState({
          //     ha: re[0].hash
          // })
          console.log(re[0].hash)
      }).catch(err=>{
          console.log(err)
      })
  }
  

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    let Message
    if(this.state.loginIn.category === 'user'){
      Message = (
          <UserHome 
          useraddress={this.state.loginIn.useraddress}
          web3={this.state.web3}
          accounts={this.state.accounts}
          contract={this.state.contract}
          pig_contract={this.state.pig_contract}
          ipfs={this.state.ipfs}/>
      )
    }
    else if(this.state.loginIn.category === 'admin'){
      Message = (
          <AdminHome 
          useraddress={this.state.loginIn.useraddress}
          web3={this.state.web3}
          accounts={this.state.accounts}
          contract={this.state.contract}
          pig_contract={this.state.pig_contract}
          ipfs={this.state.ipfs}/>
      )
    }
    else {
      Message = (
          <Login 
          switchLogin={this.switchLogin}
          contract={this.state.contract}
          accounts={this.state.accounts}
          ipfs={this.state.ipfs}/>
      )
    }
    return (
      // <div className="App">
      //   <h1>Good to Go!</h1>
      //   <p>Your Truffle Box is installed and ready.</p>
      //   <h2>Smart Contract Example</h2>
      //   <p>
      //     If your contracts compiled and migrated successfully, below will show
      //     a stored value of 5 (by default).
      //   </p>
      //   <p>
      //     Try changing the value stored on <strong>line 42</strong> of App.js.
      //   </p>
      //   <div>The stored value is: {this.state.storageValue}</div>
      // </div>
      <div>
        <Layout style={{minHeight: 720}}>
            <Header>
                <div style={{lineHeight:'64px', fontSize:"20px", color:"white", textAlign:"center"}}>
                    <div><img style={{height:'40px', width:'40px'}} src={logo} alt="logo" /> 以太坊图书管理系统</div>
                </div>
            </Header>
            
            {Message}

        </Layout>
      </div>
    );
  }
}

export default App;
