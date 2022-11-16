const axios = require('axios');

const base_url = "https://api.citybik.es";

getNetworkHrefByCity = async (cityName) => {
    const networksUrl = new URL("/v2/networks", base_url); //https://api.citybik.es/v2/networks

    try {
        const result = await axios.get(networksUrl); //axios.get(//https://api.citybik.es/v2/networks)
        return filterUsNetworks(result.data.networks); // => all networks;  filters for city name passed in
    } catch (e){
        console.error(e);
    }

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
}

getNetworkStationsByHref = async (networkHref, numberOfBikes) => {
    if(!networkHref) return null;
    const url = new URL(networkHref, base_url);

    try {
        const result = await axios.get(url);
        return getAvailableBikes(result.data.stations, numberOfBikes)
    } catch (e) {
        console.error(e);
    }

    function getAvailableBikes(stations, numberOfBikes) {
        for(let i = 0; i < stations.length; i++){
            if(stations[i].free_bikes >= numberOfBikes){
                return stations[i].name;
            }
        }
        return null;
    }
}

module.exports = {getNetworkHrefByCity, getNetworkStationsByHref, base_url};