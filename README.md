# liri-node-app

This is just a basic node app to allow you to do searches for information from various apis. 

Use arrow keys to select your search, then click enter. Then type what you would like to search for, and hit enter again.

Inquirer was used as a menu to determine what you were looking for. After choosing what type of search, you will be asked to input what you would like to search for. 

The application returns the first option of a search for specific things such as songs, or a movie. Default options are enabled if no search string is entered, such as ace of base or mr.nobody for songs or movies, respectively.

I added in that if you search for a movie and no response is found, it will log that title was not found. Concert search also will show you the country if the venue isnt within the United States, so you can either see city/state, or city/country, as well as the time for the event.