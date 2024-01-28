const APIkey = "9ec750d6e4b0dbc2bd30476d48802f5c";
const fetchedLocations = [];

function sendData(city){
    $("#search-form")[0].reset();
    var location = "";
    var coords = [];
    var coordurl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`
    fetch(coordurl).then((resp)=>{ return resp.json() }).then( (data)=>{    
        console.log(data);
        if(data.length == 0){
            throw new Error("Place not found");
        } 

        

        var now = new Date().toLocaleDateString()
        location = data[0]["name"] + ", " + data[0]["state"] + ", " + data[0]["country"]+ " (" +now+")";
        coords = [data[0]["lat"],data[0]["lon"]]
        
        addLocationBtn(data[0]["name"]);
        fetchedLocations.push(data[0]["name"]);

        var currentWurl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${APIkey}`
        console.log(currentWurl);
        fetch(currentWurl).then( (resp)=> {return resp.json()} ).then( (curr_data)=>{
            console.log(curr_data);
            var todayDiv = $("#today");
            todayDiv.children().eq(0).text(location);
            todayDiv.children().eq(1).text("Current temperature: " + (Math.round(curr_data["main"]["temp"]-273.15)*100)/100 + "°C");
            todayDiv.children().eq(2).text("Wind speed: " + (Math.round(curr_data["wind"]["speed"])*10)/10 + " m/s");
            todayDiv.children().eq(3).text("Humidity: " + (Math.round(curr_data["main"]["humidity"])*10)/10 + " %"); 
        });

        var fiveDayUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${APIkey}&cnt=60` 
        console.log(fiveDayUrl);
        fetch(fiveDayUrl).then( (resp)=> {return resp.json()}).then( (data)=>{
            $("#forecast").empty();
            console.log(data);
            var cardTemplate = $("#card-template");
            for (let i = 0; i < 5; i++) {
                var currentDay = data.list[39-(8*i)];
                console.log(currentDay);
                var card = cardTemplate.clone();
                card.removeClass("d-none");
                card.find(".card-header").text(currentDay.dt_txt.split(" ")[0]);
                card.find(".card-body").attr("src",`https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@4x.png`)
                $("#forecast").append(card);
                card.find(".list-temp").text("Temp: " + (Math.round(currentDay["main"]["temp"]-273.15)*100)/100 + "°C");
                card.find(".list-wind").text(("Wind: " + (Math.round(currentDay["wind"]["speed"])*10)/10 + " m/s"));
                card.find(".list-humid").text("Humidity: " + (Math.round(currentDay["main"]["humidity"])*10)/10 + " %")
                
            }
            // cardTemplate.remove();
            $("#dashboard").css("display","block");
        })



    }).catch(error => { alert(error.message) })


}


$("#search-form").on("submit", function(event){
    event.preventDefault();
    var city = $(this).serializeArray()[0]["value"];
    
    sendData(city);


});

var savedBtns = $("#history");

function addLocationBtn(city){
    if(fetchedLocations.includes(city)) return;
    var btn = $("<button>");
    btn.on("click",()=>{
        sendData(city,true);
    });
    btn.text(city);
    btn.addClass("btn btn-secondary mt-1");
    savedBtns.append(btn);
}

savedBtns.on("click","button",function(event){
    console.log(event);
})


