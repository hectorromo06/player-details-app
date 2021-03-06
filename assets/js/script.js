var apiKey = '92c502e459c9c620a303073cdca1176311116a12';
var apiURL = 'https://www.giantbomb.com/api/search/?api_key=';
var playerEl = document.querySelector('#player');
var teamEl = document.querySelector('#team');
var heightEl = document.querySelector('#height');
var weightEl = document.querySelector('#weight');
var birthdayEl = document.querySelector('#birthdate');
var birthCityEl = document.querySelector('#birth-city');
var leagueEl = document.querySelector('#league');
var positionEl = document.querySelector('#position');
var battingEl = document.querySelector('#batting');
var throwingEl = document.querySelector('#throwing')
var youtubeEl = document.querySelector('#youtube-vids');
var historyEl = document.querySelector('#history');
var resultsEl = document.querySelector('#results');
var noResultsEl = document.querySelector('#no-results');


var recentSearches = [];

$('#submit-btn').click(function (event) {
    event.preventDefault();

    var playerName = event.target.parentElement[0].value;

    // checks if localStorage exists
    var temp = localStorage.getItem('recentSearches');
    var exists = false;

    // if localStorage does exist, make sure player is not duplicated
    if (temp != null) {
        recentSearches = JSON.parse(temp);
        for (var i = 0; i < recentSearches.length; i++) {
            if (recentSearches[i].player == playerName) {
                exists = true;
                break;
            } else {
                exists = false;
            }
        }
    }

    // if player doesn't exist in array, adds it, creates localStorage
    if (exists == false) {
        var occurence = {
            player: playerName
        }
        recentSearches.push(occurence);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } else {}



    apiCall(playerName);


});

function apiCall(playerName) {
    playerName = encodeURIComponent(playerName.trim());

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://mlb-data.p.rapidapi.com/json/named.search_player_all.bam?name_part='" + playerName + "'&sport_code='mlb'&active_sw='Y'",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "mlb-data.p.rapidapi.com",
            "X-RapidAPI-Key": "92d5a261cbmsh2670c43e09e3d07p15f894jsn89c9d2e082a5"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        const results = response.search_player_all.queryResults;

        if (results.totalSize != 0) {
            noResultsEl.style.visibility = 'hidden';
            resultsEl.style.visibility = 'visible';


            var player = results.row.name_display_first_last;
            var teamName = results.row.team_full;
            var height = results.row.height_feet + "' " + results.row.height_inches;
            var weight = results.row.weight;
            var birthday = results.row.birth_date.slice(0, 10);
            var birthCity = results.row.birth_city;
            var league = results.row.league;
            var position = results.row.position;
            var batting = results.row.bats;
            var throwing = results.row.throws;

            playerEl.textContent = player;
            teamEl.textContent = teamName;
            heightEl.textContent = height;
            weightEl.textContent = weight;
            birthdayEl.textContent = birthday;
            birthCityEl.textContent = birthCity;
            leagueEl.textContent = league;
            positionEl.textContent = position;
            battingEl.textContent = batting;
            throwingEl.textContent = throwing;

            teamName = encodeURIComponent(teamName.trim());
            picture(playerName);
            youtubeSearch(teamName);
        } else {
            removeAllChildNodes(youtubeEl);
            noResultsEl.style.visibility = 'visible';
            resultsEl.style.visibility = 'hidden';
        }

    });
}

function picture(playerName) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://bing-image-search1.p.rapidapi.com/images/search?q=" + playerName + 'current photo',
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "bing-image-search1.p.rapidapi.com",
            "X-RapidAPI-Key": "92d5a261cbmsh2670c43e09e3d07p15f894jsn89c9d2e082a5"
        }
    };

    $.ajax(settings).done(function (response) {
        var playerImageEl = document.querySelector('#player-image');
        playerImageEl.setAttribute('src', response.value[0].contentUrl);
        playerImageEl.setAttribute('alt', playerName);

        console.log(response);
    });
}

function youtubeSearch(teamName) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://youtube-search6.p.rapidapi.com/search/?query=" + teamName + "'s&number=20&country=us&lang=en",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "youtube-search6.p.rapidapi.com",
            "X-RapidAPI-Key": "92d5a261cbmsh2670c43e09e3d07p15f894jsn89c9d2e082a5"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        removeAllChildNodes(youtubeEl);

        // console.log(youtubeEl.firstElementChild);

        // if (youtubeEl.firstElementChild != null) {
        //     youtubeEl.remove(youtubeEl.firstElementChild);
        // }

        for (var i = 0; i < response.videos.length; i++) {

            var divParentEl = document.createElement('div');
            divParentEl.classList.add('uk-card', 'uk-card-default', 'uk-grid-collapse', 'uk-child-width-1-2@s', 'uk-margin');
            divParentEl.setAttribute('uk-grid', '');

            var divThumbnailEl = document.createElement('div');
            divThumbnailEl.classList.add('uk-card-media-left', 'uk-cover-container');

            var imgEl = document.createElement('img');
            var src = response.videos[i].thumbnails[0].url;
            imgEl.setAttribute('src', src);
            imgEl.setAttribute('alt', '');

            divThumbnailEl.appendChild(imgEl);

            divParentEl.appendChild(divThumbnailEl);

            var cardBodyEl = document.createElement('div');
            cardBodyEl.classList.add('uk-card-body', 'uk-align-right');

            var h3El = document.createElement('h3');
            h3El.classList.add('uk-card-title');
            var title = response.videos[i].title;
            h3El.textContent = title;

            var descEl = document.createElement('p');
            var desc = response.videos[i].description;
            descEl.textContent = desc;

            var lengEl = document.createElement('p');
            var leng = response.videos[i].video_length;
            lengEl.textContent = leng;

            cardBodyEl.appendChild(h3El);
            cardBodyEl.appendChild(descEl);
            cardBodyEl.appendChild(lengEl);

            divParentEl.appendChild(cardBodyEl);

            var footerEl = document.createElement('div');
            footerEl.classList.add('uk-card-footer');

            var linkEl = document.createElement('a');
            linkEl.classList.add('uk-button', 'uk-button-text');
            var url = 'https://www.youtube.com/watch?v=' + response.videos[i].video_id;
            linkEl.setAttribute('href', url);
            linkEl.setAttribute('target', '_blank');
            linkEl.textContent = 'Watch Video';

            footerEl.appendChild(linkEl);

            divParentEl.appendChild(footerEl);

            youtubeEl.appendChild(divParentEl);

        }
    });

}

function history() {
    var temp = localStorage.getItem('recentSearches');
    // if localStorage does exist print buttons
    if (temp != null) {
        recentSearches = JSON.parse(temp);
        for (var i = 0; i < recentSearches.length; i++) {
            var liEl = document.createElement("li");
            liEl.textContent = recentSearches[i].player;
            historyEl.appendChild(liEl);

        }

    }


}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

$('#clear-btn').click(function (event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
})


history();