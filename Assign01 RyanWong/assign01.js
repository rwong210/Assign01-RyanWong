document.addEventListener("DOMContentLoaded", function () {

    const galleryAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';
    const paintingAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=';
    const imageURL = 'https://www.randyconnolly.com/funwebdev/3rd/images/travel/square150/';


    // listen for the load and display gallery list
    window.addEventListener('load', (e) => {
        fetch(galleryAPI)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                populateList(data);
                // hideLoading();
                getClicked(data);
            })
            .catch(error => console.error(error));
        // showLoading();
    });

    // populate the Gallery List nav with items from the gallery API
    function populateList(galleries) {
        const list = document.querySelector("#galleryList ul");
        list.innerHTML = "";
        let sorted = galleries.sort(compare);
        for (let s of sorted) {
            let li = document.createElement("li");
            li.innerText = `${s.GalleryName}`;
            list.appendChild(li);
        }
    }

    //  When user clicks, fetch data and populate Gallery Info, Map and Paintings sections with
    //  the data for the clicked gallery

    function getClicked(galleries) {
        let id;
        const selected = document.querySelector("#galleryList > ul");
        selected.addEventListener('click', (e) => {
            let lookup = e.target.innerText;
            let found = galleries.find(g => g.GalleryName === lookup);

            galleryInfo(found);















            for (let g of galleries) {
                id = g.GalleryID;
            }
            let queryString = `${paintingAPI}${id}`;
            fetch(queryString)
                .then(response => response.json())
                .then(data => {
                    // populate Gallery Info
                    // populate Map 
                    // populate Paintings
                })
                .catch(error => console.error(error));
            // showLoading();
        })
    }

    // populate the Gallery Info Aside
    function galleryInfo(gallery) {
        let galleryInfo = document.querySelector("#galleryInfo");

        let name = document.createElement("h2");
        name.innerHTML = `${gallery.GalleryName}`;
        galleryInfo.appendChild(name);

        let native = document.createElement("h3");
        native.innerHTML = `${gallery.GalleryNativeName}`;
        galleryInfo.appendChild(native);

        let city = document.createElement("p");
        city.innerHTML =`${gallery.GalleryCity}`;
        galleryInfo.appendChild(city);

        let galleryAddress = document.createElement("#galleryAddress");
        let address = document.createTextNode(`${gallery.GalleryAddress}`);
        galleryAddress.appendChild(address);

        let galleryCountry = document.querySelector("#galleryCountry");
        let country = document.createTextNode(`${gallery.GalleryCountry}`);
        galleryCountry.appendChild(country);

        let = document.createElement("a");
        a.setAttribute("href", `${gallery.GalleryWebSite}`);
        a.textContent = `${gallery.GalleryWebSite}`;
        document.querySelector("#galleryInfo").appendChild(a);

        let a = document.createElement("a");
        a.setAttribute("href", `${gallery.GalleryWebSite}`);
        a.textContent = `${gallery.GalleryWebSite}`;
        document.querySelector("#galleryInfo").appendChild(a);

        //let website = document.createTextNode(`${gallery.GalleryWebSite}`);
        // galleryWebsite.appendChild(website);
    }




    // when the user clicks, populate the Paintings Article
    function paintingInfo(images) {
        const results = document.querySelector("#paintings");
        paintings.innerHTML = "";
        for (image of images) {
            let img = document.createElement("img");
            img.setAttribute("src", `${imageURL}${image.filename}`);
            img.setAttribute("alt", `${image.title}`);
            results.appendChild(img);
        }
    }

    // function for comparing gallery names for sorting
    function compare(a, b) {
        if (a.GalleryName < b.GalleryName) {
            return -1;
        }
        if (a.GalleryName > b.GalleryName) {
            return 1;
        }
        return 0;
    }

    // function to check for matching gallery name
    function search(a, b) {
        return a === b
    }

});