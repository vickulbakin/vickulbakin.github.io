"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var searchInput = document.getElementById('rxSearchInput');
var resultBlock = document.getElementById('rxSearchResult');
var inputChange$ = rxjs_1.fromEvent(searchInput, 'keyup');
inputChange$.pipe(operators_1.debounceTime(1000), operators_1.pluck('target', 'value'), operators_1.filter(function (value) { return value != ''; }), operators_1.switchMap(function (str) {
    return fetch("https://api.github.com/search/repositories?q=" + str).then(function (res) { return res.json(); });
}))
    .subscribe(function (result) {
    resultBlock.innerHTML = '';
    for (var i = 0; i < result.items.length; i++) {
        resultBlock.appendChild(addRep(result.items[i]));
    }
}, function () {
    resultBlock.innerHTML = '';
    var div = document.createElement('div');
    div.classList.add('rx-result-error');
    div.textContent = 'Некорректное значение';
    resultBlock.appendChild(div);
});
function addRep(elem) {
    var div = document.createElement('div');
    div.classList.add('rx-result-item');
    div.innerHTML = "\n        <div class=\"rx-result-item__header\">\n            <h2>" + elem.full_name + "</h2>\n            <a class=\"rx-result-item__link\" href=\"" + elem.html_url + "\">" + elem.html_url + "</a>\n        </div>\n        <div class=\"rx-result-item__info\">\n            <p class=\"rx-result-item__desc\">" + elem.description + "</p>\n            <div class=\"rx-result-item__stars\">\n                <svg class=\"star-svg\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/2000/xlink\" width=\"21px\" height=\"20px\">\n                    <path d=\"M0,0.054V20h21V0.054H0z M15.422,18.129l-5.264-2.768l-5.265,2.768l1.006-5.863L1.64,8.114l5.887-0.855\n                    l2.632-5.334l2.633,5.334l5.885,0.855l-4.258,4.152L15.422,18.129z\"/>\n                </svg>\n                <span>" + elem.stargazers_count + "</span>\n            </div>\n        </div>\n    ";
    return div;
}
