var userID, firstName, lastName, email, address,password ;

class User{
constructor(userID, firstName, lastName, email, address,password){

        this.userID=userID;
        this.firstName=firstName;
        this.lastName=lastName;
        this.email=email;
        this.address=address;
        this.password=password;
}

get getUserID(){
    return this.userID;
}

set setUserID(value){
    this.userID = value;
}

get getFirstName(){
    return this.firstName;
}

set setFirstName(value){
    this.firstName = value;
}

get getLastName(){
    return this.lastName;
}

set setLastName(value){
    this.lastName = value;
}

get getEmail(){
    return this.email;
}

set setEmail(value){
    this.email = value;
}

get getAddress(){
    return this.address;
}

set setAddress(value){
    this.address = value;
}
}


module.exports = {
    User : User
}
