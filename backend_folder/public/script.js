    // img elements
    var updateImg = document.getElementById("tripImage");
    var newImg = document.querySelector('.tripImgInput');
    var updateProfileImg = document.getElementById("profileImg");

    // nav elements
    var plusSvg = document.querySelector('.plus-path');
    var discoverSvg = document.querySelector('.discover-svg');
    var discoverSvgPaths = discoverSvg.querySelectorAll('path');
    var profileSvg = document.querySelector('.profile-svg');
    var profileSvgPaths = profileSvg.querySelectorAll('path, circle');
    var discoverSpan = document.querySelector('.discover-span');
    var createTripSpan = document.querySelector('.create-trip-span');
    var profileSpan = document.querySelector('.profile-span');

    // function for trip-info page
    function tripInfoLoad(){
         // trip-info back arrow
        var backArrow = document.querySelector('.back-arrow');
        
        // go-back arrow
        backArrow.addEventListener("click", () => {
            window.history.back();
        });

        // delete pop-up elements
        var popup = document.querySelector('.pop-up');
        var popupContent = document.querySelector('.pop-up-content');
        var closeBtn = document.querySelector('.close');
        var deleteBtn = document.querySelector('.delete-btn');

        // delete-trip popup open
        deleteBtn.addEventListener('click', () => {
            popup.style.display = 'block';
        });

        // delete-trip popup close
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        })

        window.onclick = (event) => {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
}
    }

    // function for update-trip page
   function updateTripLoad(){
       // change color of plus in nav
        plusSvg.style.fill = '#C1755A';
        
        if(updateImg.value == ''){
            document.getElementById("updateImgLabel").textContent = 'Upload Image: file selected';
        }
    }

    // function for create-trip page
    function createTripLoad(){
        // color for discover nav when active
        plusSvg.style.fill = '#C1755A';
        createTripSpan.style.color = '#C1755A';

        // change upload text when a photo is uploaded/not uploaded
        if(newImg.value == ''){
            document.getElementById("tripImgLabel").textContent = 'Upload Image: no file selected';
        }

        newImg.onchange = function() {
            if(newImg.value == ''){
                document.getElementById("tripImgLabel").textContent = 'Upload Image: no file selected';
            }else {
                document.getElementById("tripImgLabel").textContent = 'Upload Image: file selected';
            }
        }
    }

    // function for profile page
    function profilePageLoad(){
        
        // color on nav svg's
        for (var i = 0; i < profileSvgPaths.length; i++) {
            profileSvgPaths[i].style.fill = '#C1755A';
        }
        profileSpan.style.color = '#C1755A';

        // logout elements
        var slide = document.querySelector('.logout-slide');
        var moreBtn = document.querySelector('.more-svg');
        var morePath = document.querySelector('.more-path');
        var logout = document.querySelector('.logout');

        // logout slider
        moreBtn.addEventListener('click', () => {
            if (slide.style.height === "200px") {
                slide.style.height = "0px";
                morePath.style.fill = '#D9D0C1';
                logout.style.visibility = 'hidden';
                logout.style.transitionDelay = '-0.4s';
            } else {
                slide.style.height = "200px";
                morePath.style.fill = '#C1755A';
                logout.style.visibility = 'visible';
                logout.style.transitionDelay = '0.4s';
            }
        })
    }

    // function for edit profile page
    function editProf(){
        if(updateProfileImg.value == ''){
            document.getElementById("profileImgLabel").textContent = 'Upload Image: file selected';
        }

        for (var i = 0; i < profileSvgPaths.length; i++) {
            profileSvgPaths[i].style.fill = '#C1755A';
        }
        profileSpan.style.color = '#C1755A';
    }

    function disover(){
        for (var i = 0; i < discoverSvgPaths.length; i++) {
            discoverSvgPaths[i].style.fill = '#C1755A';
        }
        discoverSpan.style.color = '#C1755A';
        
    }

    // load functions on specific pages
    if(location == 'http://localhost:5000/createtrip'){
       createTripLoad();

    }else if(window.location.href.indexOf("tripinfo") != -1){
        tripInfoLoad();

    }else if(window.location.href.indexOf("update") != -1){
        updateTripLoad();
        
    }
    else if(window.location.href.indexOf("edit") != -1){
        editProf();
    }
    else if(window.location.href.indexOf("profile") != -1){
        profilePageLoad();
    }else if(window.location.href.indexOf("discover") != -1 ||
             window.location.href.indexOf("nature") != -1 ||
             window.location.href.indexOf("culture") != -1 ||
             window.location.href.indexOf("urban") != -1 ||
             window.location.href.indexOf("adventure") != -1 ||
             window.location.href.indexOf("asia") != -1 ||
             window.location.href.indexOf("southameria") != -1 ||
             window.location.href.indexOf("northamerica") != -1 ||
             window.location.href.indexOf("europe") != -1 ||
             window.location.href.indexOf("africa") != -1 ||
             window.location.href.indexOf("oceania") != -1 ||
             window.location.href.indexOf("continents") != -1 ){
        disover();
    }

