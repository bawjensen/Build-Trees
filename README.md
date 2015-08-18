# Item Build Trees

This is my submission for the Riot API Challenge 2.0, starting 8/10/2015 and ending 8/31/2015. You can see the live version at [challenge.bawjensen.com](http://challenge.bawjensen.com).

## Stack

This project was almost MEAN, just missing the Angular.js portion of the tech stack. This was built using Node.js for the data gathering/processing as well as web server code. MongoDB was used to temporarily store data before processing. Express was used where needed. Finally, Google's MDL was used for the front-end design work.

The final product makes heavy use of d3.js to display a variation on a [Sankey Diagram](https://en.wikipedia.org/wiki/Sankey_diagram), depicting the various item builds that summoners used on various champions in specified games of League of Legends, data supplied as part of the challenge parameters. The data was then scaled to display better in this format. 
