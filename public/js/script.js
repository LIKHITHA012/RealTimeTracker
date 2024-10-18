const socket = io();//this is the client side socket ->connection request goes to the server->when function call occurs connection request goes to socket.io

// checking whethere browser supports geolocation or not
if(navigator.geolocation) {//navigator is an object that represents the browser that is already present in the browser and geolocation is a property of navigator object 
    navigator.geolocation.watchPosition( (position)=>{//watchPosition is a method of geolocation object that is used to get the current position of the device
     const { latitude, longitude} = position.coords;//position object has a property called coords which has latitude and longitude properties
     socket.emit("send-location",{ latitude, longitude });//sendLocation is an event that is emitted to the location of user to the server
    },
    (error)=>{
        console.error(error);// if error occurs then it is printed on the console
    },
    {
        enableHighAccuracy: true,//this is to get the most accurate location possible
        timeout: 5000,// to recheck the location after 5 seconds
        maximumAge: 0, //to get the most accurate location possible not cached location means already stored location take only the current location
    }
 );
} 
//leaflet is a library that is used to show maps on the web page
const map=L.map("map").setView([0, 0], 16);//map is the id of the div where we want to show the map and setView is a method that is used to set the view of the map and it takes two arguments first is the latitude and second is the longitude and third is the zoom level

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"open street map"
}).addTo(map);//to show which tile showed be displayed on the map nd x,y,z are dynamic values of the map

const markers={};

socket.on("receive-location", (data)=>{
    const { id, latitude, longitude } = data;//to get the location of the user
    map.setView([latitude, longitude]);//to set the view of the map to the location of the user 16 is zoom level
    if(markers[id]){//if the user is already present on the map then it will update the location of the user
        markers[id].setLatLng([latitude, longitude]);
    }
    else{//if the user is not present on the map then it will add the user on the map
        markers[id]=L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id)=>{//if the user is disconnected then it will remove the user from the map
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});



