// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
pragma experimental ABIEncoderV2;

contract EtherLibrary {
    string admin_detail;      // admin
    struct lib {
        uint id;
        string detail;
    }
    lib[] public Users;
    lib[] public Books;
    lib[] public Records;

    constructor() public {
        admin_detail = 'QmNinxTsTBm6ZzN8CN2mcNjSPuiZ47nESQrnrppSK2sSNB';
        Users.push(lib({id: 0, detail: 'QmdupeFtNY9CZcUJ2U6gG81FJiU9dg28QwFzdXzMcsCw5i'}));
        Books.push(lib({id: 0, detail: 'QmZ5yT6K7mr9jZticsxWaXWtfuz6mD8ihnjPKGQku9zU6L'}));
    }

    function getAdmin() public view returns(string memory) {
        return admin_detail;
    }

    function updateAdmin(string memory update_data) public returns(bool){
        admin_detail = update_data;
        return true;
    }

    function getUsers() public view returns(lib[] memory) {
        return Users;
    }
    
    function addUser(string memory add_data) public returns(bool) {
        uint len = Users.length;
        uint tmp_id;
        if(len == 0){
            tmp_id = 0;
        }
        else{
            tmp_id = Users[len-1].id + 1;
        }
        Users.push(lib({id: tmp_id, detail: add_data}));
        return true;
    }

    function updateUser(uint update_id, string memory update_data) public returns(bool) {
        uint len = Users.length;
        for(uint i=0; i<len; i++){
            if(Users[i].id == update_id){
                Users[i].detail = update_data;
                return true;
            }
        }
        return false;
    }

    function delUser(uint del_id) public returns(bool) {
        if(del_id >= Users.length) return false;
        for(uint i = del_id; i < Users.length-1; i++){
            Users[i].detail = Users[i+1].detail;
        }
        delete Users[Users.length-1];
        Users.pop();
        return true;
    }

    function getBooks() public view returns(lib[] memory) {
        return Books;
    }

    function addBook(string memory add_data) public returns(bool) {
        uint len = Books.length;
        uint tmp_id = 0;
        if(len == 0){
            tmp_id = 0;
        }
        else{
            tmp_id = Books[len-1].id + 1;
        }
        Books.push(lib({id: tmp_id, detail: add_data}));
        return true;
    }

    function updateBook(uint update_id, string memory update_data) public returns(bool) {
        uint len = Books.length;
        for(uint i=0; i<len; i++){
            if(Books[i].id == update_id){
                Books[i].detail = update_data;
                return true;
            }
        }
        return false;
    }

    function delBook(uint del_id) public returns(bool) {
        if(del_id >= Books.length) return false;
        for(uint i = del_id; i < Books.length-1; i++){
            Books[i].detail = Books[i+1].detail;
        }
        delete Books[Books.length-1];
        Books.pop();
        return true;
    }

    function getRecords() public view returns(lib[] memory) {
        return Records;
    }

    function addRecord(string memory add_data) public returns(bool) {
        uint len = Records.length;
        uint tmp_id;
         if(len == 0){
            tmp_id = 0;
        }
        else{
            tmp_id =Records[len-1].id + 1;
        }
        Records.push(lib({id: tmp_id, detail: add_data}));
        return true;
    }

}