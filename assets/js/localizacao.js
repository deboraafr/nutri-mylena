let map, infoWindow;

function initMap() {
  if (map) return;

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  }); 
  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const currentposition = new google.maps.Marker({
          position: pos,
          map: map,
          icon: {
            url: "person.svg",
          },
        });

        infoWindow.setPosition(pos);
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }

  fetch("https://deboraafr.github.io/api-map/localizacao.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const marker = new google.maps.Marker({
          position: { lat: item.latitude, lng: item.longitude },
          map: map,
          title: item.nome,
        });

        marker.addListener("click", () => {
          const content = `
            <div>
              <h3>${item.nome}</h3>
              <p>${item.descricao}</p>
              <p>Bairro: ${item.bairro}</p>
              <p>Logradouro: ${item.logradouro}</p>
              <p>Telefone: ${item.telefone || "N/A"}</p>
              <p>Site: ${item.site || "N/A"}</p>
            </div>
          `;

          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });
      });
    })
    .catch((error) => console.error("Error loading JSON file:", error));
}

window.initMap = initMap;

window.addEventListener('pageshow', function(event) {
  initMap();
});