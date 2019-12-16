let timeLeft = 30;
let counterElement;
let newsCardsDiv = document.getElementById("news-cards");
let mainDiv = document.getElementById("main-div");
let loaderDiv = document.getElementById("loader");
let newsCardsErrorsDiv = document.getElementById("news-cards-errors");
let queryParam;
let pageNumber = 1;
let searchBar;
let isSearchEnd = false;
let isLoading = true;
let timerId = setInterval(refreshPage, 1000);

// Initialises the timer with 30 s and keep running the counter from 30s to 0s
function refreshPage() {
    counterElement = document.getElementById('counter');
    counterElement.innerHTML = timeLeft;
    if (timeLeft === 0) {
        newsCardsDiv.innerHTML="";
        this.getNews(queryParam, 1);
        pageNumber=1;
        isSearchEnd=false;
        timeLeft = 30;
    } else {
        counterElement.innerHTML = timeLeft;
        timeLeft--;
    }
}

window.onload = function () {
    if (window.location.href.includes("query=") === true) {
        queryParam = window.location.href.split("query=")[1];
    } else {
        queryParam = "";
    }
    this.document.getElementById('query').value = queryParam;
    this.getNews(queryParam, pageNumber);
}

// It hits the api and get the list of news based on query parameter passed
function getNews(searchText, pageNumber) {
    isLoading=true;
    loaderDiv.style.display= "block";
    let xmlhttp = new XMLHttpRequest();
    const api_url = "https://newsapi.org/v2/everything?q=";
    const apiKey = "ba0ccdce341c4e77a1127c92efae8908";
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            isLoading=false;
            if (this.status === 200) {
                let jsonResp = JSON.parse(this.responseText);
                if (jsonResp.totalResults === 0) {
                    newsCardsErrorsDiv.innerHTML = "No related news found";
                } else if (jsonResp.totalResults > 0) {
                    newsCardsErrorsDiv.innerHTML = "";
                    loaderDiv.style.display= "none";
                    newsCardsDiv.style.display = "block";
                    displayNews(JSON.parse(this.responseText));
                    if(jsonResp.totalResults < 10){
                        isSearchEnd =true;
                    }
                }
            } else if (this.status === 426 || this.status === 429) {
                isSearchEnd = true;
                loaderDiv.style.display= "none";
                // newsCardsErrorsDiv.innerHTML = "Max reached";
            } else if (this.status > 426) {
                loaderDiv.style.display= "none";
                newsCardsErrorsDiv.innerHTML = "Something broke";
            }
        }
    };

    xmlhttp.open('GET', api_url + searchText + "&apiKey=" + apiKey + "&pageSize=10&page=" + pageNumber);
    xmlhttp.send();
}

// It gets the response as parameter and display the news in UI

function displayNews(news) {
    news.articles.map(data => {
        let newsCardDiv = document.createElement('div');
        let newsDiv = document.createElement('div');
        let containerDiv = document.createElement('div');
        let imgDiv = document.createElement('div');
        let subContainerDiv = document.createElement('div');
        let titleDiv = document.createElement('div');
        let contentDiv = document.createElement('div');
        let newsImg = document.createElement("img");

        newsDiv.className = "newsDiv";
        newsDiv.id = "news-list";
        newsCardDiv.className = "column";
        newsImg.setAttribute("height", "60");
        newsImg.setAttribute("width", "60");
        containerDiv.className = "news-container";
        containerDiv.id = "newsId";
        imgDiv.className = "img-container";
        subContainerDiv.className = "sub-container";
        titleDiv.className = "title-div";
        contentDiv.className = "content-div";

        
        data.urlToImage ? (newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(imgDiv).appendChild(newsImg).setAttribute("src", data.urlToImage))
         :(newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(imgDiv).appendChild(newsImg).setAttribute("src", "src/resources/images/news-default.png"));
        data.title ? (newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(titleDiv).innerHTML = "" + data.title)
        :(newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(titleDiv).innerHTML = "Default title");
        data.content ? (newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(contentDiv).innerHTML = "" + data.content) 
        :(newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(contentDiv).innerHTML = "No news details to show");
        newsCardsDiv.appendChild(newsCardDiv);

        // To show the news actual source
        containerDiv.onclick = function(){
            window.location.href = data.url;
        }

    });
}

// Detect when news list is scrolled
window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= newsCardsDiv.offsetHeight + 220 && !isSearchEnd && !isLoading ) {
        pageNumber++;
        console.log("bottom");
        getNews(queryParam, pageNumber);
    }
};
