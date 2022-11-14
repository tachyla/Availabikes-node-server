const axios = require('axios');

const base_url = "https://api.citybik.es";

function getNetworkHrefByCity(cityName) {

    function filterUsNetworks(networks){
        for(let i = 0; i < networks.length; i++){
            let network_cityAndState = networks[i].location.city; 
            let networkCityName = getCityName(network_cityAndState);
            if(networkCityName === cityName && networks[i].location.country == 'US'){
                return networks[i].href;
            }
        } 
        return null;
    } 

    function getCityName(cityAndState) {
        let indexOfComma = cityAndState.indexOf(",") 
        let search_input_city = cityAndState.slice(0, indexOfComma);
        return search_input_city;
    }
    const url = new URL("/v2/networks", base_url);
    return axios.get(url)
    .then((res) => filterUsNetworks(res.data.networks))
    .catch((err) => console.error(err));
}

function getNetworkStationsByHref(networkHref, numberOfBikes){
    if(!networkHref) return null;

    const url = new URL(networkHref, base_url);

    return axios.get(url)
    .then((res) => getAvailableBikes(res.data.stations, numberOfBikes))
    .catch((err) => console.error(err));

    function getAvailableBikes(stations, numberOfBikes) {
        for(let i = 0; i < stations.length; i++){
            if(stations[i].free_bikes >= numberOfBikes){
                return stations[i].name;
            }
        }
        return null;
    }
}

module.exports = {getNetworkHrefByCity, getNetworkStationsByHref};