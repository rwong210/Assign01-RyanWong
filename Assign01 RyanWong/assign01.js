document.addEventListener("DOMContentLoaded", function () {

    const galleryAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';
    const paintingAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=';
    const imageURL = 'https://www.randyconnolly.com/funwebdev/3rd/images/travel/square150/';




    // listen for the load and display gallery list
    window.addEventListener('load', (e) => {
        fetch(galleryAPI)
            .then(response => response.json())
            .then(data => {
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
        galleries.sort(compare);
        for (let g of galleries) {
            let li = document.createElement("li");
            li.innerText = `${g.GalleryName}`;
            list.appendChild(li);
        }
    }

    //  When user clicks, fetch data and populate Gallery Info, Map and Paintings sections with
    //  the data for the clicked gallery

    function getClicked(galleries) {
        let id;
        const selected = document.querySelector("#galleryList > ul");
        selected.addEventListener('click', (e) => {
            for (let g of galleries) {
                id = g.GalleryID;
            }
            let queryString = `${paintingAPI}${id}`;
            fetch(queryString)
                .then(response => response.json())
                .then(data => {
                    
                })
                .catch(error => console.error(error));
            // showLoading();
        })
    }
    // when the user clicks, populate the Gallery Info div
    function populateGalleryInfo(images) {
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

});