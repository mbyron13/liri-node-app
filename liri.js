var inquirer = require('inquirer');
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");



inquirer
    .prompt([
        {
            name: 'searchType',
            type: 'list',
            message: 'search type: ',
            choices: ['concert-this',
                'spotify-this-song',
                'movie-this',
                'do-what-it-says']
        },
        {
            name: 'searchStr',
            type: 'input',
            message: 'search string  '
        }
    ]).then(function (answers) {
        console.log('searching for ' + answers.searchStr);
        logSearchQuery(answers.searchType, answers.searchStr);
        doSearch(answers.searchType, answers.searchStr);
    });

function logSearchQuery(type, search) {
    var text = "type: " + type + " search: " + search + "\n";
    fs.appendFile("./log.txt", text, { encoding: "utf-8" }, function (err) {
        if (err) throw err;
        console.log("logged!");
    });
}

function doSearch(type, search) {
    if (type == 'concert-this') {
        searchConcert(search);
    }
    else if (type == "spotify-this-song") {
        searchSong(search);
    }
    else if (type == "movie-this") {
        searchMovie(search);
    }
    else if (type == "do-what-it-says") {
        doWhatItSays(search);
    } else {
        console.log("Invalid Choice");
    }
}

function searchConcert(search) {
    axios({
        method: "get",
        url: "https://rest.bandsintown.com/artists/" +
            search +
            "/events?app_id=codingbootcamp"
    }).then(function (res) {
        for (var i = 0; i < res.data.length; i++) {
            var time = moment(res.data[i].datetime).format("MM-DD-YYYY HH-mm");
            console.log("------------------------------------");
            console.log("\nVenue name: " + res.data[i].venue.name + "\n");
            console.log("Venue city: " + res.data[i].venue.city + "\n");
            if (res.data[i].venue.region) console.log("Venue state: " + res.data[i].venue.region + "\n");
            console.log("Venue country: " + res.data[i].venue.country + "\n")
            console.log("Date of event: " + time + "\n");
        }
    });
}

function searchSong(search) {
    function logit(data) {
        console.log("----------------------------------------");
        console.log("artist name: " + data.tracks.items[0].album.artists[0].name);
        console.log("----------------------------------------");
        console.log("Song title: " + data.tracks.items[0].name);
        console.log("----------------------------------------");
        console.log("Album preview url: " + data.tracks.items[0].preview_url);
        console.log("----------------------------------------");
        console.log("Album name: " + data.tracks.items[0].album.name);
        console.log("----------------------------------------");
    }
    if (search == "") {
        spotify.search({ type: 'track', query: "The Sign", query: "Ace of Base" }, function (err, data) {
            if (err) {
                return console.log("error occurred: " + err);
            }
            logit(data);
        });
    }
    else {

        spotify.search({ type: 'track', query: search }, function (err, data) {
            if (err) {
                return console.log("error occurred: " + err);
            }
            logit(data);
        });
    }
}

function searchMovie(search) {
    function logit(res) {
        console.log("----------------------------------------");
        console.log("Movie title: " + res.data.Title);
        console.log("----------------------------------------");
        console.log("Year of release: " + res.data.Year);
        console.log("----------------------------------------");
        console.log("IMDB Rating: " + res.data.Ratings[0].Value);
        console.log("----------------------------------------");
        console.log("Rotten Tomatoes Rating: " + res.data.Ratings[1].Value);
        console.log("----------------------------------------");
        console.log("Country produced in: " + res.data.Country);
        console.log("----------------------------------------");
        console.log("Language: " + res.data.Language);
        console.log("----------------------------------------");
        console.log("Plot: " + res.data.Plot);
        console.log("----------------------------------------");
        console.log("Actors: " + res.data.Actors);
        console.log("----------------------------------------");

    }
    if (search == "") {
        axios({
            method: "get",
            url: "http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey="+keys.omdb.key
        }).then(function (res) {
            //console.log(res);
            logit(res);
        });
    }
    else {
        axios({
            method: "get",
            url: "http://www.omdbapi.com/?t=" +
                search +
                "&y=&plot=short&apikey="+keys.omdb.key
        }).then(function (res) {
            //console.log(res);
            if (res.data.Response == "False") {
                console.log("movie title not found");
            }
            else {
                logit(res);
            }
        });
    }
}

function doWhatItSays(){
    fs.readFile('random.txt', "utf8", function(error,data){
       if (error) {
           return console.log(error);
       }
       var dataArr = data.split(",");
       console.log(dataArr);
       doSearch(dataArr[0],dataArr[1]);
    });
}