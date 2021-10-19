//p1.redbear.gq
//redbear html/css/js weather frontend using AJAX (backend available in /endpoints)

lat = 0
long = 0

//Set Picture

var daytime_sunny = "https://images.unsplash.com/photo-1534629938736-b1b076531d3b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=100"
var daytime_rainy = "https://images.unsplash.com/photo-1527766833261-b09c3163a791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=100"
var nighttime = "https://images.unsplash.com/photo-1573088796308-fcf50577a43e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1529&q=100"
var nighttime_stormy = "https://images.unsplash.com/photo-1465799522714-8eb0e6fccf73?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1613&q=100"

setTimeout(function() {
    $(".intro").fadeOut("slow")
    $(".introcontent").fadeOut("slow")
}, 2000)

var hr = (new Date()).getHours()
if (hr > 18) {
    $("body").css("background-image", "url('" + nighttime + "')")
}

function SetContent() {

    //Weekday

    var today = new Date().getDay()
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    $("#c-day").text(days[today])

    //Date

    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()
    today = mm + '/' + dd + '/' + yyyy
    $("#c-date").text(today)

    //Location

    function req1() {
        return $.ajax({
            url: "https://geolocation-db.com/jsonp",
            jsonpCallback: "callback",
            dataType: "jsonp",
            success: function(location) {
                if (location.state == null) {
                    $("#c-city").text(location.country_name)
                    alert("Unable to determine weather forecast for your region.")
                } else {
                    $("#c-city").text(location.city + ", " + location.state)
                    $('#c-ip').html(location.IPv4)
                }
                lat = location.latitude
                long = location.longitude
            },
            error: function() {
                alert("Unable to determine weather forecast for your region.")
            }
        })
    }

    //Temperature

    $.when(req1()).done(function() {
        linkReq = "" //get this link from coords then request weather!
        $.ajax({
            url: "https://api.weather.gov/points/" + lat + "," + long,
            success: function(weather) {
                linkReq = weather.properties.forecast
                $.ajax({
                    url: linkReq,
                    success: function(weather) {
                        $("#c-temp").html(weather.properties.periods[0].temperature + "&#176F")
                        $("#1 .day").text(weather.properties.periods[1].name)
                        $("#1 .temp").html(weather.properties.periods[1].temperature + "&#176F")
                        $("#3 .day").text(weather.properties.periods[3].name)
                        $("#3 .temp").html(weather.properties.periods[3].temperature + "&#176F")
                        $("#5 .day").text(weather.properties.periods[5].name)
                        $("#5 .temp").html(weather.properties.periods[5].temperature + "&#176F")
                        $("#7 .day").text(weather.properties.periods[7].name)
                        $("#7 .temp").html(weather.properties.periods[7].temperature + "&#176F")
                        namefix()
                    },
                    error: function() {
                        alert("Unable to determine weather forecast for your region.")
                    }
                })
            }
        })
    })

    function namefix() {
        $(".card-t .day").each(function() {
            if ($(this).text() == "Monday") {
                $(this).text("Mon")
            } else if ($(this).text() == "Tuesday") {
                $(this).text("Tues")
            } else if ($(this).text() == "Wednesday") {
                $(this).text("Weds")
            } else if ($(this).text() == "Thursday") {
                $(this).text("Thurs")
            } else if ($(this).text() == "Friday") {
                $(this).text("Fri")
            } else if ($(this).text() == "Saturday") {
                $(this).text("Sat")
            } else if ($(this).text() == "Sunday") {
                $(this).text("Sun")
            }
        })
    }

}

SetContent()

//Button Refresh

$(".refresh").on("click", function() {
    $(".card-t .day").each(function() { $(this).text("--") })
    $(".card-t .temp").each(function() { $(this).text("--") })
    $("#c-day").text("--")
    $("#c-date").text("--")
    $("#c-city").text("--")
    $("#c-temp").text("--")
    setTimeout(function() {
        SetContent()
    }, 200)
})