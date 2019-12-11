let timeLeft = 30; 
let counterElement;
let newsCardsDiv = document.getElementById("news-cards");
let queryParam;
let pageNumber=1;
let searchBar;

let timerId = setInterval(countdown, 1000);

// Initialises the timer with 30 s and keep running the counter from 30s to 0s

function countdown() {
    counterElement = document.getElementById('counter');
    counterElement.innerHTML = timeLeft;
    if (timeLeft === 0) {
        timeLeft = 30;
    } else {
        counterElement.innerHTML = timeLeft;
        timeLeft--;
    }
} 

window.onload = function(){
    if(window.location.href.includes("=") === true){
        queryParam = window.location.href.split("=")[1];
    }
    else{
        queryParam = "";
    }
    searchBar = this.document.getElementById('newsSearch');
    searchBar.value = queryParam;
    this.getNews(queryParam,pageNumber);
}

// It hits the api and get the list of news based on query parameter passed

function getNews(searchText, pageNumber) {
    let xmlhttp = new XMLHttpRequest();
    const api_url = "https://newsapi.org/v2/everything?q=";
    const apiKey = "e989f78cdb494492bca304f1f7579827";
    xmlhttp.onreadystatechange = function() {
        if (this.status == 200) {
            newsCardsDiv.innerHTML = "";
            displayNews(JSON.parse(this.responseText));
        }
        else{
            if(this.readyState == 4 && this.status>300)
            {
                newsCardsDiv.innerHTML = "No related news found";
            }
        }
    };

    xmlhttp.open('GET', api_url+searchText+"&apiKey="+apiKey+"&pageSize=10&page="+pageNumber);
    xmlhttp.send();
}

// It gets the response as parameter and display the news in UI

function displayNews(news){
    
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
        newsImg.setAttribute("height", "50");
        newsImg.setAttribute("width", "50");
        containerDiv.className = "news-container";
        imgDiv.className = "img-container";
        subContainerDiv.className = "sub-container";
        titleDiv.className = "title-div";
        
        newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(imgDiv).appendChild(newsImg).setAttribute("src",data.urlToImage);
        newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(titleDiv).innerHTML = ""+data.title;
        newsCardDiv.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(contentDiv).innerHTML = ""+data.content;
        newsCardsDiv.appendChild(newsCardDiv);
    });
}

// Detect when news list is scrolled
newsCardsDiv.addEventListener('scroll', function() {
        if (newsCardsDiv.scrollTop + newsCardsDiv.clientHeight >= newsCardsDiv.scrollHeight-10) {
           pageNumber++;
           getNews(queryParam,pageNumber);
        }
      });
