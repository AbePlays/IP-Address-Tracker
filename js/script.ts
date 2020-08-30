let loc = document.getElementById("address") as HTMLInputElement;
let search = document.getElementById("search");
let IPADDRESS = document.getElementById("ip-address");
let LOCATION = document.getElementById("location");
let TIMEZONE = document.getElementById("timezone");
let ISP = document.getElementById("isp");

search.addEventListener("click", () => {
  let regex = new RegExp(
    "((^s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))s*$)|(^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*$))"
  );

  let res = regex.test(loc.value);

  if (res === false) {
    alert("Please enter a correct address");
  } else {
    findDetails(loc.value);
  }
});

let findDetails = (address: string): void => {
  let apiKey: string = "YOUR_API_KEY";
  let isp: string, timeZone: string, location: string;
  fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${address}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      isp = data.isp;
      timeZone = "UTC" + data.location.timezone;
      location =
        data.location.city +
        "," +
        data.location.region +
        "," +
        data.location.country;

      loadMap(data.location.lat, data.location.lng);

      IPADDRESS.innerText = address;
      LOCATION.innerText = location;
      TIMEZONE.innerText = timeZone;
      ISP.innerText = isp;
    })
    .catch((e) => console.log(e));
};

let loadMap = (lat: string, lon: string): void => {
  var mapOptions = {
    center: [lat, lon],
    zoom: 15,
    zoomControl: false,
  };

  var map = new L.map("map", mapOptions);
  var layer = new L.TileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  var iconOptions = {
    iconUrl: "../images/icon-location.svg",
    iconSize: [35, 45],
  };
  var customIcon = L.icon(iconOptions);

  var markerOptions = {
    title: "MyLocation",
    icon: customIcon,
  };
  var marker = L.marker([lat, lon], markerOptions);

  marker.addTo(map);
};
