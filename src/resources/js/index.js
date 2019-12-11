let timeLeft = 30; 
let counterElement;
let newsElement;
let queryParam;
let pageNumber;
let searchBar;
let pageSize;

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
    this.getNews(queryParam,1);
}

// It hits the api and get the list of news based on query parameter passed

function getNews(searchText = "", pageNumber = 0) {
    let xmlhttp = new XMLHttpRequest();
    const api_url = "https://newsapi.org/v2/everything?q=";
    const apiKey = "e989f78cdb494492bca304f1f7579827";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            newsElement = document.getElementById("news");
            newsElement.innerHTML = "";
            displayNews(JSON.parse(this.responseText));
        }
        else{
            newsElement = document.getElementById("news");
            newsElement.innerHTML = "No related news found";
        }
    };

    xmlhttp.open('GET', api_url+searchText+"&apiKey="+apiKey+"&pageSize=10&page="+pageNumber);
    xmlhttp.send();
}

// It gets the response as parameter and display the news in UI

function displayNews(news){
    newsElement = document.getElementById("news");
    let newsDiv = document.createElement('div');
    newsDiv.className = "newsDiv";
    newsDiv.id = "news-list";
    let containerDiv;
    let imgDiv;
    let subContainerDiv;
    let titleDiv;
    let contentDiv;
    let newsImg;
    let listElem;
    
    pageNumber = 1;
    news.articles.map(data => {
        newsImg = document.createElement("img");
        newsImg.setAttribute("height", "50");
        newsImg.setAttribute("width", "50");
        containerDiv = document.createElement('div'); 
        containerDiv.className = "news-container";
        imgDiv = document.createElement('div');
        imgDiv.className = "img-container";
        subContainerDiv = document.createElement('div');
        subContainerDiv.className = "sub-container";
        titleDiv = document.createElement('div');
        titleDiv.className = "title-div";
        contentDiv = document.createElement('div');
        newsElement.appendChild(newsDiv).appendChild(containerDiv).appendChild(imgDiv).appendChild(newsImg).setAttribute("src",data.urlToImage);
        newsElement.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(titleDiv).innerHTML = ""+data.title;
        newsElement.appendChild(newsDiv).appendChild(containerDiv).appendChild(subContainerDiv).appendChild(contentDiv).innerHTML = ""+data.content;
    });

// Detect when news list is scrolled

    listElem = document.getElementById('news-list');
    listElem.addEventListener('scroll', function() {
        if (listElem.scrollTop + listElem.clientHeight >= listElem.scrollHeight) {
           pageNumber++;
           getNews(queryParam,pageNumber);
        }
      });
    
}
