document.addEventListener("DOMContentLoaded", function () {

    const galleryAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';
    const paintingAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=';
    const imageURL = 'https://www.randyconnolly.com/funwebdev/3rd/images/travel/square150/';


    // listen for the load and display gallery list
    window.addEventListener('load', (e) => {
        const loader = document.querySelector("#loader");
        loader.style.display = "none";
        fetch(galleryAPI)
            .then(response => response.json())
            .then(data => {
                populateList(data);
                hideLoader();
                getClicked(data);
                toggleList();
            })
            .catch(error => console.error(error));
        showLoader();
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
                hideLoader();
                displayPaintings(data);
                paintView(data);

            })
            .catch(error => console.error(error));
            showLoader();
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
                td1.setAttribute("class", "clickable");
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
        const button = document.querySelector("#listButton");
        button.addEventListener('click', (e) => {
            const nav = document.querySelector("#galleryList");

            if (nav.style.display === "none") {
                nav.style.display = "block";

            } else {
                nav.style.display = "none";
            }
        });
    }

    function paintView(gallery) {
        let images = document.querySelectorAll(".clickable");
        for (i of images) {
            i.addEventListener('click', (e) => {

                let selectedImg = e.target;
                let lookup = e.target.alt;
                let found = gallery.find(g => g.Title === lookup);
                console.log(selectedImg);
                console.log(found);
                const main = document.querySelector("#main");
                main.style.display = "none";
                const paintView = document.querySelector("#paintView");
                paintView.setAttribute("class", "showLarge")
                const gBtn = document.querySelector("#listButton");
                gBtn.style.display = "none";

                let h1 = document.createElement("h1");
                h1.innerText = found.Title;

                let h2 = document.createElement("h2");
                if (found.FirstName != null) {
                    h2.innerText = `${found.FirstName} ${found.LastName}`;
                } else {
                    h2.innerText = `${found.LastName}`;
                }


                let fileLocation = "https://res.cloudinary.com/funwebdev/image/upload/SIZE/art/paintings/square/FILENAME";
                fileLocation = fileLocation.replace(/SIZE/i, "w_500");
                fileLocation = fileLocation.replace("FILENAME", `${found.ImageFileName}`);
                let img = document.createElement("img");
                img.setAttribute("src", fileLocation);

                let p1 = document.createElement("p");
                p1.innerText = `Year: ${found.YearOfWork}`;
                let p2 = document.createElement("p");
                p2.innerText = `Medium: ${found.Medium}`;
                let p3 = document.createElement("p");
                p3.innerText = `Width: ${found.width}`;
                let p4 = document.createElement("p");
                p4.innerText = `Height: ${found.Height}`;
                let p5 = document.createElement("p");
                p5.innerText = `Copyright: ${found.CopyrightText}`;
                let p6 = document.createElement("p");
                p6.innerText = `Gallery Name: ${found.GalleryName}`;
                let p7 = document.createElement("p");
                p7.innerText = `City: ${found.GalleryCity}`;
                let p8 = document.createElement("a");
                p8.setAttribute("href", found.MuseumLink);
                p8.innerText = found.MuseumLink;
                let p9 = document.createElement("p");
                p9.innerText = `Description:

                ${found.Description}`;
                let p10 = document.createElement("p");

                // create divs for grid layout
                let div1 = document.createElement("div");
                div1.id = "imageContainer";
                let div2 = document.createElement("div");
                div2.id = "headerContainer";
                let div3 = document.createElement("div");
                div3.id = "detailsContainer";
                let div4 = document.createElement("div");
                div4.id = "colorsContainer";
                let div5 = document.createElement("div");
                div5.id = "buttonContainer";

                // append painting info to paintView
                div1.appendChild(img);

                div2.appendChild(h1);
                div2.appendChild(h2);

                div3.appendChild(p1);
                div3.appendChild(p2);
                div3.appendChild(p3);
                div3.appendChild(p4);
                div3.appendChild(p5);
                div3.appendChild(p6);
                div3.appendChild(p7);
                div3.appendChild(p8);
                div3.appendChild(p9);

                // create color spans and append to div4
                const colors = [...found.JsonAnnotations.dominantColors];
                for (c of colors) {
                    let red = Number(c.color.red);
                    let green = Number(c.color.green);
                    let blue = Number(c.color.blue);
                    let cWeb = c.web;
                    let span = document.createElement("span");
                    span.innerText = " ";
                    span.style.backgroundColor = c.web;
                    div4.appendChild(span);
                }

                // create button element to close largePaint view
                let closeBtn = document.createElement("button");
                closeBtn.id = "closeBtn";
                closeBtn.innerText = "Close Button";
                div5.appendChild(closeBtn);

                closeBtn.addEventListener('click', (e) => {
                    paintView.classList.remove("showLarge");
                    paintView.innerHTML = " ";
                    main.style.display = "flex";
                    gBtn.style.display = "flex";

                })

                // append divs to paintView
                paintView.appendChild(div1);
                paintView.appendChild(div2);
                paintView.appendChild(div3);
                paintView.appendChild(div4);
                paintView.appendChild(div5);

                // event for large image click
                document.querySelector("#imageContainer img").addEventListener('click', (e) => {
                    div2.style.display = "none";
                    div3.style.display = "none";
                    div4.style.display = "none";
                    paintView.setAttribute("class", "centered");
                })
            })
        }
    }


    function showLoader() {
        const loader = document.querySelector("#loader");
        loader.style.display = "flex";
        const main = document.querySelector("#main");
        main.style.display = "none";
    }

    function hideLoader(){
        const loader = document.querySelector("#loader");
        loader.style.display ="none";
        const main = document.querySelector("#main");
        main.style.display = "flex";
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