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
            paintingsInfo(found);
            createMap(found);
            toggleList();
        })
    }

    // populate the Gallery Info Aside
    function galleryInfo(gallery) {
        let galleryInfo = document.querySelector("#galleryInfo");
        galleryInfo.innerHTML = "";

        let name = document.createElement("h2");
        name.innerHTML = `${gallery.GalleryName}`;
        galleryInfo.appendChild(name);

        let native = document.createElement("h3");
        native.innerHTML = `${gallery.GalleryNativeName}`;
        galleryInfo.appendChild(native);

        let city = document.createElement("p");
        city.innerHTML = `${gallery.GalleryCity}`;
        galleryInfo.appendChild(city);

        let address = document.createElement("p");
        address.innerHTML = `${gallery.GalleryAddress}`;
        galleryInfo.appendChild(address);

        let country = document.createElement("p");
        country.innerHTML = `${gallery.GalleryCountry}`;
        galleryInfo.appendChild(country);

        let a = document.createElement("a");
        a.setAttribute("href", `${gallery.GalleryWebSite}`);
        a.textContent = `${gallery.GalleryWebSite}`;
        document.querySelector("#galleryInfo").appendChild(a);
    }

    // populate the Paintings Article
    function paintingsInfo(found) {
        const paintingInfo = document.querySelector("#paintings");

        let id = found.GalleryID;
        console.log(found);

        let queryString = `${paintingAPI}${id}`;
        console.log(queryString);
        fetch(queryString)
            .then(response => response.json())
            .then(data => {
                displayPaintings(data);

            })
            .catch(error => console.error(error));


        //for (image of images) {
        //    let img = document.createElement("img");
        //   img.setAttribute("src", `${imageURL}${image.filename}`);
        //    img.setAttribute("alt", `${image.title}`);
        //   results.appendChild(img);
        // }

        function displayPaintings(paintings) {
            let emptyTable = document.querySelector("#tableContent");
            emptyTable.innerHTML = "";
            paintings.forEach(painting => {
                let fileLocation = "https://res.cloudinary.com/funwebdev/image/upload/SIZE/art/paintings/square/FILENAME";
                const table = document.querySelector("#tableContent");
                //let fileLoc = fileLocation.toString();
                fileLocation = fileLocation.replace(/SIZE/i, "w_100");
                fileLocation = fileLocation.replace("FILENAME", `${painting.ImageFileName}`);

                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                let img = document.createElement("img");
                img.setAttribute("src", `${fileLocation}`);
                img.setAttribute("alt", `${painting.Title}`)
                td1.appendChild(img);

                let td2 = document.createElement("td");
                if (painting.FirstName != null) {
                    td2.innerText = `${painting.FirstName} ${painting.LastName}`;
                } else {
                    td2.innerText = `${painting.LastName}`;
                }

                let td3 = document.createElement("td");
                td3.innerText = `${painting.Title}`;

                let td4 = document.createElement("td");
                td4.innerText = `${painting.YearOfWork}`;

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                table.appendChild(tr);
            })
        }
    }
    // create a map for the map section of the page with the clicked gallery location
    function createMap(gallery) {
        // create latitude and longitude object
        let latLng = {
            lat: gallery.Latitude,
            lng: gallery.Longitude
        };

        var map;
        initMap();
        createMarker(map, gallery.Latitude, gallery.Longitude, gallery.GalleryName);

        // function to create map 
        function initMap() {

            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: latLng,
            });
        }

        // function to create map marker for gallery location
        function createMarker(map, latitude, longitude, name) {
            let imageLatLong = {
                lat: latitude,
                lng: longitude
            };
            let marker = new google.maps.Marker({
                position: imageLatLong,
                title: name,
                map: map
            });
        }

    }


    function toggleList() {
        document.querySelector("#listButton").addEventListener('click', (e) => {
            const nav = document.querySelector("#galleryList");

            if (nav.style.display === "none") {
                nav.style.display = "block";
            } else {
                nav.style.display = "none";
            }
        });
    }
    // function for comparing for sorting
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