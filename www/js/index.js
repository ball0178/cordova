const app = {
    URL: '',
    DATA: null,
    init: function () {

        app.getData();

        app.addListeners();

        history.replaceState({}, "List", "#list");
        document.title = 'Master Page';
    },
    addListeners: function () {

        let backBtn = document.querySelector('#details-page header a');
        backBtn.addEventListener('click', app.backHome);

        window.addEventListener('popstate', app.browserBack);
    },
    getData: function () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './js/data.json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                console.log(xhr.status, xhr.statusText);
                app.DATA = JSON.parse(xhr.responseText);
                console.log(app.DATA);

                app.showThings();
            }
        };
        xhr.send(null);
    },
    showThings: function () {

        let list = document.getElementById('itemlist');
        list.innerHTML = '';
        list.appendChild(app.buildCard(app.DATA.currency));
        let titles = document.querySelectorAll('#list-page .item-title');
        [].forEach.call(titles, (h2) => {
            h2.addEventListener('click', app.navDetails);
            
        });
    },
    
    buildCard: function (arr) {
        let df = new DocumentFragment();
        arr.forEach((curr) => {
            let card = document.createElement('div');
            card.className = 'item-card';
            let img = document.createElement('img');
            img.className = 'icon';
            img.src = curr.imgurl;
            img.alt = 'logo';
            let title = document.createElement('h2');
            title.className = 'item-title';
            title.setAttribute("data-key", curr.id);
            title.innerHTML = curr.name;
            let type = document.createElement('p');
            type.className = 'item-desc';
            type.textContent = curr.type;
            let desc = document.createElement('p');
            desc.className = 'item-desc';
            desc.textContent = curr.description;
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(type);
            card.appendChild(desc);
            df.appendChild(card);
        });
        return df;
    },
    navDetails: function (ev) {
        ev.preventDefault();
        window.scrollTo(0, 0);
        let h2 = ev.currentTarget;

        let id = h2.getAttribute('data-key');

        console.log(`#details/${id}`);
        history.pushState({
            "id": id
        }, "Details", `#details/${id}`);
        document.title = `Details for Item ${id}`;

        let obj = app.getItem(id);


        app.showDetails(obj);
    },
    getItem: function (id) {

        return app.DATA.currency[parseInt(id) - 1];
    },
    showDetails: function (obj) {

        document.getElementById('list-page').classList.remove('active');
        document.getElementById('details-page').classList.add('active');

        let span = document.querySelector('.details-title');
        span.textContent = obj.name;

        let df = new DocumentFragment();
        obj.developers.forEach((dev) => {
            let card = document.createElement('div');
            card.className = 'item-card';
            let img = document.createElement('img');
            img.className = 'icon';
            img.src = dev.imgurl;
            img.alt = 'logo';
            let title = document.createElement('h2');
            title.className = 'item-title';
            title.setAttribute("data-key", dev.id);
            title.innerHTML = dev.name;
            let desc = document.createElement('p');
            desc.className = 'item-desc';
            desc.innerHTML = 'House Member';
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(desc);
            df.appendChild(card);
            let devlist = document.getElementById('devlist');
            devlist.appendChild(df);
        });
    },
    backHome: function (ev) {
        if (ev) {
            ev.preventDefault();

            history.pushState({}, "List", `#list`);
            document.title = 'Master Page';
        }
        document.getElementById('list-page').classList.add('active');
        document.getElementById('details-page').classList.remove('active');
        let devlist = document.getElementById('devlist');
        devlist.innerHTML = '';
    },
    browserBack: function (ev) {
        console.log('user hit the browser back button');

        if (location.hash == '#list') {
            console.log('show the list page');

            app.backHome();

        } else {

            console.log('show the details');
            let id = location.hash.replace("#details/", "");

            let obj = app.getItem(id);

            app.showDetails(obj);
        }
    }
};



let loadEvent = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(loadEvent, app.init);
