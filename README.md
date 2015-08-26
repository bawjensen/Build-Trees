# Item Build Trees

This is my submission for the Riot API Challenge 2.0, starting 8/10/2015 and ending 8/31/2015. This repository has two primary branches, and I prefer the `gh-pages` branch be considered as my entry in the competition. It is a website displaying, in a visual/interactive format, statistical data regarding a large change to AP items in patch 5.13, and you can see the live version at [buildtrees.bawjensen.com](http://buildtrees.bawjensen.com).

## How the Data Was Gathered
The data for this site is based off of the provided data set. The data aggregation and parsing was a two step process.

### Step One:
([data-compilation/compile-match-data.js](data-compilation/compile-match-data.js)): All 400,000 matches (2 patch versions x 2 queue types x 10 regions x 10,000 matches) were parsed and only the relevant data (participant timeline item purchases, win/loss status, championId) were kept and stored in a MongoDB database hosted locally.

Example command (runs the matches gathering step, in the 'After' mode to gather 5.14 data, with a cap of 10000 matches per region):

    node --harmony --use_strict data-compilation/compile-match-data.js a 10000

Note: There must be a mongodb server running on localhost, on the default 27017 port, with a database labelled `lol-data` in which to store the gathered data.

### Step Two:
([data-compilation/compile-detailed-data.js](data-compilation/compile-detailed-data.js)): All 400,000 match data entries were parsed and inserted into 125 [Trie](https://en.wikipedia.org/wiki/Trie)-esque [data structures](helpers/item-build-trie.js), one for each champion (excluding Tahm Kench, who didn't exist in patch 5.11), with all supplementary data (such as number of times built, number of wins/losses) inserted as cargo at each node. These data structures were then serialized as JSON in the format expected by the d3.js code later, and saved for use on the web-server at [web-server/data/](web-server/data/).

Example command (runs the matches processing step, in the 'Before' mode to gather 5.11 data, with a cap of 10000 matches total):

    node --harmony --use_strict data-compilation/compile-detailed-data.js b 10000

Note: There must be a mongodb server running on localhost, and on the default 27017 port, with a database in the correct format from step one and with data populated from running that script.

## How the Site Works
The main landing page is a pretty simple display of every champion. Clicking on a champion will bring you to their specific page, which displays side-by-side a visualization of every build that was used on that champion, with the left being "Before" the item changes and the right being "After".

The site itself is powered GitHub's Project Pages feature, given its scalability. The site is hosted statically from the root of the repo, with most files symlinked to their actual versions inside the web-server folder.

## How the Data Is Displayed
The data is displayed in the form of a tree with collapsible/expandable branches, with a little bit of a [Sankey Diagram](https://en.wikipedia.org/wiki/Sankey_diagram) thrown in to visually indicate the popularity of that build. This is done by scaling the branch accordingly, both the branch path and the item icon at the end of the branch. The branch paths are also color-coded based on the win-rate of that build, with red being the worst and green being the best, with the win-rate range being from 40% to 60%. Hovering over an item will conjure a tooltip telling you the name of the item, the number of times it was built (often scaled up proportionally to sister builds due to the nature of games being various length), and the win-rate of that build.

The data for this site is all funneled into [d3.js](http://d3js.org/), using code inspired by [this example collapsible d3 tree](http://bl.ocks.org/mbostock/4339083) and visual inspiration from [this use of that example](http://www.brightpointinc.com/interactive/budget/index.html?source=d3js). Extra features such as text were added as needed, and the code powering the whole visualization can be found in the file [web-server/js/champ.js](web-server/js/champ.js).

## Tech Stack

+ Node.js
+ MongoDB
+ Angular.js
+ D3.js
+ jQuery
+ Material Design Lite (MDL)

This project was built using the MEAN tech stack. MongoDB was used to temporarily store data before processing, with the final storage method being a simple JSON file system. Express wasn't really used, given that the site is hosted statically by GitHub. Angular.js was used for the front-end routing aspect of the framework. Node.js was used for the initial data gathering/processing. Lastly, Google's [MDL](http://www.getmdl.io/) was used for the front-end design work.

The final product makes heavy use of d3.js to display a variation on a [Sankey Diagram](https://en.wikipedia.org/wiki/Sankey_diagram), depicting the various item builds that summoners used on various champions in specified games of League of Legends, which was supplied as part of the challenge parameters.
