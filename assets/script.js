const APIkey = "9ec750d6e4b0dbc2bd30476d48802f5c";


$("#search-form").on("submit", function(event){
    event.preventDefault();
    console.log("form submitted");

    var city = $(this).serializeArray()[0]["value"];
    $("#search-form")[0].reset();
    
    var location = "";
    var coords = [];
    var coordurl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`
    fetch(coordurl).then((resp)=>{ return resp.json() }).then( (data)=>{    
        console.log(data); 
        location = data[0]["name"] + ", " + data[0]["state"] + ", " + data[0]["country"];
        coords = [data[0]["lat"],data[0]["lon"]]

        var currentWurl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${APIkey}`
        console.log(currentWurl);
        fetch(currentWurl).then( (resp)=> {return resp.json()} ).then( (curr_data)=>{
            console.log(curr_data);
            var todayDiv = $("#today");
            todayDiv.children().eq(0).text(location);
            todayDiv.children().eq(1).text("Current temperature: " + (Math.round(curr_data["main"]["temp"]-273.15)*100)/100 + "°C");
            todayDiv.children().eq(2).text("Wind speed: " + (Math.round(curr_data["wind"]["speed"])*10)/10 + " m/s");
            todayDiv.children().eq(3).text("Humidity: " + (Math.round(curr_data["main"]["humidity"])*10)/10 + " %"); 
        })
    })


});

async function convertName(city){
    var url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`
    let data = await fetch(url);
    return data.json();
    
}

var coords = convertName("London").then(  )
 console.log(coords);