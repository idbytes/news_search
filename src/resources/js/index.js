let timeLeft = 3; // todo
let counterElement;
let newsElement;

let timerId = setInterval(countdown, 1000);

function countdown() {
    counterElement = document.getElementById('counter');
    if (timeLeft === -1) {
        clearTimeout(timerId);
        getNews();
    } else {
        counterElement.innerHTML = timeLeft+"";
        timeLeft--;
    }
} //todo
function getNews(searchText = "", pageNumber = 0) {
    let xmlhttp = new XMLHttpRequest();
    const url = "https://newsapi.org/v2/everything?q=";
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

    xmlhttp.open('GET', url+searchText.value+"&apiKey="+apiKey+"&pageSize=10&page="+pageNumber);
    xmlhttp.send();
}
function displayNews(news){
    newsElement = document.getElementById("news");
    let newsDiv = document.createElement('div');
    let containerDiv;
    let newsImg;
    var newsTitleDiv = document.createElement('div');
    let newsDescDiv = document.createElement('div');
    news.articles.map(data => {
        newsImg = document.createElement("img");
        newsImg.setAttribute("height", "50");
        newsImg.setAttribute("width", "50");
        containerDiv = document.createElement('div'); // want to use this in 2nd append child
        // newsElement.appendChild(newsDiv).append("<div> <div><img src='"+data.urlToImage+" '></div> <div>"+data.title+"</div> <div>"+data.content+"</div> </div>");
        newsElement.appendChild(newsDiv).appendChild(document.createElement('div')).appendChild(newsImg).setAttribute("src",data.urlToImage);
        newsElement.appendChild(newsDiv).appendChild(document.createElement('div')).innerHTML = ""+data.title;
        newsElement.appendChild(newsDiv).appendChild(document.createElement('div')).innerHTML = ""+data.content;
    });
}