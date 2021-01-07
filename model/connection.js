var connectionID,connectionName,category,details,dateTime,host,place,eventImage;

class Connection{
    constructor(connectionID,connectionName,category,details,dateTime,host,place,eventImage){
        this.connectionID = connectionID;
        this.connectionName = connectionName;
        this.category = category;
        this.details = details;
        this.dateTime = dateTime;
        this.host = host;
        this.place = place;
        this.eventImage = eventImage;
    }

get getConnectionId(){
    return this.connectionID;
}

set setConnectionId(value){
    this.connectionID = value;
}

get getConnectionName(){
    return connectionName;
}

set setConnectionName(value){
    this.connectionName = value;
}

get getCategory(){
    return category;
}

set setCategory(value){
    this.category = value;
}

get getDetails(){
    return details;
}

set setDetails(value){
    this.details = value;
}

get getHost(){
    return host;
}

set setHost(value){
    this.host = value;
}

get getPlace(){
    return place;
}

set setPlace(value){
    this.place = value;
}

get getDateTime(){
    return dateTime;
}

set setDateTime(value){
    this.dateTime = value;
}

get getEventImage(){
    return eventImage;
}

set setEventImage(value){
    this.eventImage = value;
}

}

 module.exports = {
     Connection: Connection
 }
