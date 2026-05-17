let userLatitude = null;

let userLongitude = null;

// SOS Function
function activateSOS() {

    alert("Emergency SOS Activated!");

    // Alarm Sound
    const alarm = new Audio("alarm3.mp3");

    alarm.play();

    // Get User Location
    getLocation();
}



// Get Current Location
function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);

    } else {

        alert("Geolocation is not supported.");
    }
}



// Show Position
function showPosition(position) {

    const latitude = position.coords.latitude;

    const longitude = position.coords.longitude;


    document.getElementById("location").innerText =
        `Latitude: ${latitude}, Longitude: ${longitude}`;
         const mapFrame =
        document.getElementById("map");


    mapFrame.src =
        `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;




    // Google Map
    const map =
        document.getElementById("map");


    map.src =
        `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}



// Speech Recognition Setup
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;



if (!SpeechRecognition) {

    alert("Speech Recognition not supported");

} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    let isListening = false;



    // Start Voice Recognition
    function startVoiceRecognition() {

        if (isListening) {

            console.log("Already Listening");

            return;
        }

        recognition.start();

        isListening = true;

        console.log("Listening...");
    }



    // Voice Started
    recognition.onstart = function () {

        console.log("Voice recognition started");
    };



    // Voice Result
    recognition.onresult = function (event) {

        const command =
            event.results[0][0].transcript.toLowerCase();

        console.log("You said:", command);

        alert("You said: " + command);



        // SOS Commands
        if (
            command.includes("help") ||
            command.includes("sos")
        ) {

            activateSOS();
        }
    };



    // Voice End
    recognition.onend = function () {

        console.log("Voice recognition ended");

        isListening = false;
    };



    // Errors
    recognition.onerror = function (event) {

        console.log("Voice Error:", event.error);

        isListening = false;

        if (event.error !== "no-speech") {

            alert("Voice Error: " + event.error);
        }
    };



    // Global Access
    window.startVoiceRecognition =
        startVoiceRecognition;
}

// Find Nearby Places
async function findNearby(type) {

    if (!userLatitude || !userLongitude) {

        alert("Location not detected");

        return;
    }


    let query = "";


    // Hospital Query
    if (type === "hospital") {

        query = `
        [out:json];

        node
        ["amenity"="hospital"]
        (around:5000,${userLatitude},${userLongitude});

        out;
        `;
    }


    // Police Query
    if (type === "police") {

        query = `
        [out:json];

        node
        ["amenity"="police"]
        (around:5000,${userLatitude},${userLongitude});

        out;
        `;
    }


    const url =
        "https://overpass-api.de/api/interpreter";


    try {

        const response = await fetch(url, {

            method: "POST",

            body: query
        });


        const data = await response.json();

        displayNearbyResults(data.elements, type);

    } catch (error) {

        console.log(error);

        alert("Error fetching nearby places");
    }
}

// Display Results
function displayNearbyResults(places, type) {

    const results =
        document.getElementById("nearby-results");


    results.innerHTML =
        `<h3>Nearby ${type}</h3>`;


    if (places.length === 0) {

        results.innerHTML +=
            "<p>No places found</p>";

        return;
    }


    places.forEach(place => {

        const name =
            place.tags.name || "Unnamed";


        results.innerHTML += `

            <div class="place-card">

                <p>${name}</p>

                <p>Latitude: ${place.lat}</p>

                <p>Longitude: ${place.lon}</p>

            </div>;
        `
    });
}
function ensureLocation(callback) {

    navigator.geolocation.getCurrentPosition(
        function (position) {

            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;

            console.log("Location fetched:", userLatitude, userLongitude);

            callback();
        },

        function (error) {

            console.log(error);

            alert("Please allow location access");
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}