import { useEffect, useState } from "react";
import "./App.css";
import data from "./Data/data.json";
import M from "materialize-css/dist/js/materialize.min.js";
import pin from "./pin.png";
import ReactMapGL, { Marker } from "react-map-gl";

function App() {
  const [cities, setCities] = useState([]);
  const [enlem, setEnlem] = useState(null);
  const [boylam, setBoylam] = useState(null);
  const [near, setNear] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState("");
  const [centerLon, setCenterLon] = useState(32.859741);
  const [centerLat, setCenterLat] = useState(39.933365);
  const [viewport, setViewPort] = useState({
    width: "100%",
    height: "100vh",
    zoom: 9,
  });

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      var elems = document.querySelectorAll("select");
      M.FormSelect.init(elems, {});
    });
    const takeCities = () => {
      let cities = [];

      for (let index = 0; index < data.length; index++) {
        if (index <= 80) {
          cities.push(data[index]);
          setCities(cities);
        } else {
          return;
        }
      }
    };

    const takeCountries = () => {
      let countiries = [];
      for (let index = 0; index < data.length; index++) {
        if (data[index].city === selected) {
          if (data[index].centerLat !== countiries.centerLat) {
            countiries.push(data[index]);
            setCountries(countiries);
          } else {
            return;
          }
        }
      }
    };

    takeCities();
    takeCountries();
    let selection1 = document.querySelector("#select-city");
    selection1.addEventListener("change", () => {
      let s = selection1.options[selection1.selectedIndex].value;
      setSelected(s);
    });
    let selection2 = document.querySelector("#select-county");
    selection2.addEventListener("change", () => {
      let y = selection2.options[selection2.selectedIndex].value;
      let newy = JSON.parse(y);
      setCenterLat(newy.centerLat);
      setCenterLon(newy.centerLon);
    });
    setViewPort({ ...viewport, latitude: centerLat, longitude: centerLon });
    console.log(centerLat);
    console.log(cities);
    console.log(countries);
  }, [selected, centerLat, centerLon]);

  function closestLocation(targetLocation, locationData) {
    function vectorDistance(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
      var dx = location1.centerLat - location2.centerLat,
        dy = location1.centerLon - location2.centerLon;

      return vectorDistance(dx, dy);
    }

    return locationData.reduce(function (prev, curr) {
      var prevDistance = locationDistance(targetLocation, prev),
        currDistance = locationDistance(targetLocation, curr);
      return prevDistance < currDistance ? prev : curr;
    });
  }

  const calculateNearest = () => {
    if (enlem && boylam) {
      let dataArray = data;
      let nearestCities = [];
      for (let index = 0; index < 3; index++) {
        const nearestCiy = closestLocation(
          { centerLat: enlem, centerLon: boylam },
          dataArray
        );
        nearestCities.push(nearestCiy);

        dataArray = dataArray.filter(
          (s) =>
            s.centerLat !== nearestCiy.centerLat &&
            s.centerLon !== nearestCiy.centerLon
        );
      }
      setNear(nearestCities);
    } else {
      return;
    }
  };
  return (
    <div className="App">
      <div className="row">
        <div className="select-screen">
          <select id="select-city" className="browser-default">
            <option value="" disabled selected>
              Şehirler
            </option>
            {cities.map((d) => (
              <option value={d.city}>{d.city}</option>
            ))}
          </select>
          <select id="select-county" className="browser-default">
            <option value="" disabled selected>
              İlçeler
            </option>
            {countries.map((s) => (
              <option value={JSON.stringify(s)}>{s.county}</option>
            ))}
          </select>
        </div>

        <div className="cont">
          <input
            onChange={(e) => setEnlem(e.target.value)}
            id="input_val"
            type="search"
            placeholder="Enlem"
            required
          />
          <input
            onBlur={() => {
              if (enlem && boylam) {
                calculateNearest();
              }
            }}
            onChange={(e) => setBoylam(e.target.value)}
            id="input_val"
            type="search"
            placeholder="Boylam"
            required
          />
          <button class="waves-effect waves-light btn" onClick={calculateNearest}>Ara</button>
        </div>
      </div>
      <div className="near">
        {near.map((d) => (
          <p>{d.county}</p>
        ))}
      </div>
      <ReactMapGL
        className="map"
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoiZXJ0dWdydWxzYXJpaGFuIiwiYSI6ImNrbzV6Mm92czA2b20zMG54N3RwNmh2ZTgifQ.k387rlJ8eRxPY_w3AStIkA"
        onViewportChange={(viewport) => {
          setViewPort({
            ...viewport,
          });
        }}
      >
        <Marker
          latitude={centerLat}
          longitude={centerLon}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <img className="pin" src={pin} alt="" />
        </Marker>
      </ReactMapGL>
    </div>
  );
}

export default App;
