import {fromEvent} from "rxjs";
import {debounceTime, filter, pluck, switchMap} from "rxjs/operators";

const searchInput = document.getElementById('rxSearchInput') as HTMLInputElement;
const resultBlock = document.getElementById('rxSearchResult') as HTMLDivElement;

const inputChange$ = fromEvent(searchInput, 'keyup');

inputChange$.pipe(
    debounceTime(1000),
    pluck('target', 'value'),
    filter(value => value != ''),
    switchMap((str) => {
        return fetch(`https://api.github.com/search/repositories?q=${str}`).then((res) => res.json());
    })
)
    .subscribe((result) => {
        resultBlock.innerHTML = '';
        for (let i = 0; i < result.items.length; i++) {
            resultBlock.appendChild(addRep(result.items[i]));
        }
    }, () => {
        resultBlock.innerHTML = '';
        let div = document.createElement('div') as HTMLDivElement;
        div.classList.add('rx-result-error');
        div.textContent = 'Некорректное значение';
        resultBlock.appendChild(div);
    });

type RepDescription = {
    full_name: string,
    description: string
    html_url: string
    stargazers_count: number
};

function addRep (elem: RepDescription) {
    let div = document.createElement('div') as HTMLDivElement;
    div.classList.add('rx-result-item');

    div.innerHTML = `
        <div class="rx-result-item__header">
            <h2>${elem.full_name}</h2>
            <a class="rx-result-item__link" href="${elem.html_url}">${elem.html_url}</a>
        </div>
        <div class="rx-result-item__info">
            <p class="rx-result-item__desc">${elem.description}</p>
            <div class="rx-result-item__stars">
                <svg class="star-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" width="21px" height="20px">
                    <path d="M0,0.054V20h21V0.054H0z M15.422,18.129l-5.264-2.768l-5.265,2.768l1.006-5.863L1.64,8.114l5.887-0.855
                    l2.632-5.334l2.633,5.334l5.885,0.855l-4.258,4.152L15.422,18.129z"/>
                </svg>
                <span>${elem.stargazers_count}</span>
            </div>
        </div>
    `;

    return div;
}