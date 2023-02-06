const {base_url, getNetworkHrefByCity, getNetworkStationsByHref} = require("../src/bikesAPIproxy.js");
const axios = require("axios");

jest.mock("axios");

describe("citibikes API", () => {
    it("gets network for a city", async () => {
        //ARRANGE
        const data = {"networks": [
           {
               "href": "/v2/networks/fake",
               "location": {
                   "city": "Columbus",
                   "country": "fakeCountry",
               },
           },
           {
               "href": "/v2/networks/fakePath",
               "location": {
                   "city": "Miami, FL",
                   "country": "US",
               },
           },
           {
               "href": "/v2/networks/cogo",
               "location": {
                   "city": "Columbus, OH",
                   "country": "US",
               }
           }
        ]};
       axios.get.mockResolvedValueOnce({"data": data});

       //ACTION
       const result = await getNetworkHrefByCity("Columbus");

       // ASSERTION
       expect(result).toBe("/v2/networks/cogo");
    });

    it('returns null if a city is not provided', async () => {
                     // ARRANGE
                     const data = {
                        "networks": [
                            {
                                "href": "/v2/networks/fake",
                                "location": {
                                    "city": "Columbus",
                                    "country": "fakeCountry",
                                },
                            },
                            {
                                "href": "/v2/networks/fakePath",
                                "location": {
                                    "city": "Miami, FL",
                                    "country": "US",
                                },
                            },
                            {
                                "href": "/v2/networks/cogo",
                                "location": {
                                    "city": "Columbus, OH",
                                    "country": "US",
                                }
                            }
                        ]
                    };
                    axios.get.mockResolvedValueOnce({"data": data});

                    //ACTION
                    const result = await getNetworkHrefByCity(null);

                    //ASSERTION
                    expect(result).toBe(null);
    });

    it('returns null if a city does not exist', async () => {
                        // ARRANGE
                        const data = {
                            "networks": [
                            {
                                "href": "/v2/networks/fake",
                                "location": {
                                    "city": "Columbus",
                                    "country": "fakeCountry",
                                },
                            },
                            {
                                "href": "/v2/networks/fakePath",
                                "location": {
                                    "city": "Miami, FL",
                                    "country": "US",
                                },
                            },
                            {
                                "href": "/v2/networks/cogo",
                                "location": {
                                    "city": "Columbus, OH",
                                    "country": "US",
                                }
                            }
                        ]};
                        axios.get.mockResolvedValueOnce({"data": data});

                        //ACTION
                        const result = await getNetworkHrefByCity("Fakecity");

                        // ASSERT
                        expect(result).toBe(null);
    });
});

describe("get network stations by href", () => {
    let data;

    beforeEach(() => {
        data = {
            "stations": [
                {
                    "empty_slots": 9,
                    "free_bikes": 2,
                    "name": "City Hall",
                },
                {
                    "empty_slots": 2,
                    "free_bikes": 13,
                    "name": "High St & Warren"
                }
            ]
        };
    });

    afterEach(() => {
        jest.resetAllMocks()
    });

    it('returns null when no href is provided', async () => {
        axios.get.mockResolvedValueOnce({"data": data});

       const result = await getNetworkStationsByHref(null);
        expect(result).toBe(null);
    });

    it('returns null when number of bikes is not provided', async () => {
         // ARRANGE
         axios.get.mockResolvedValueOnce({"data": data});
         let numberOfBikes = 5;
 
         const result = await getNetworkStationsByHref("/v2/networks/cincy-red-bike");

         expect(result).toBe(null);
    });

    it("returns first station name that has at least N number of bikes", async () => {

        axios.get.mockResolvedValueOnce({"data": data});
        let numberOfBikes = 3;

        // ACTION
        const result = await getNetworkStationsByHref("/v2/networks/cogo", numberOfBikes);

        // ASSERTION
        expect(result).toStrictEqual(["High St & Warren"]);
    });
});

describe("displaying station results", () => {
    beforeEach(() => {
        mockStationsData = {
            "stations": [

                {
                    "empty_slots": 2,
                    "free_bikes": 3,
                    "name": "StationName 0"
                },
                {
                    "empty_slots": 2,
                    "free_bikes": 13,
                    "name": "StationName 1"
                },
                {
                    "empty_slots": 2,
                    "free_bikes": 3,
                    "name": "StationName 2"
                },
                {
                    "empty_slots": 2,
                    "free_bikes": 17,
                    "name": "StationName 3"
                },                {
                    "empty_slots": 72,
                    "free_bikes": 1,
                    "name": "StationName U"
                },
                {
                    "empty_slots": 1,
                    "free_bikes": 1,
                    "name": "StationName V"
                },                {
                    "empty_slots": 2,
                    "free_bikes": 11,
                    "name": "StationName W"
                },
                {
                    "empty_slots": 2,
                    "free_bikes": 47,
                    "name": "StationName X"
                },
                {
                    "empty_slots": 2,
                    "free_bikes": 4,
                    "name": "StationName Y"
                },
                {
                    "empty_slots": 2,
                    "free_bikes": 10,
                    "name": "StationName Z"
                }
            ]
        };
    })

    it("returns list of 5> stations that have at least N number of bikes", async () => {

        axios.get.mockResolvedValueOnce({"data": mockStationsData});

        let numberOfBikes = 7;

        // Action
        const result = await getNetworkStationsByHref("/v2/networks/cincy-red-bike", numberOfBikes);
        
        const stationNames = [
            "StationName 1",
            "StationName 3",
            "StationName W", 
            "StationName X",
            "StationName Z"
        ];

        // ASSERTION
        expect(result).toStrictEqual(stationNames);

    });

    it("returns list of 10> stations that have at least N number of bikes", async () => {
        axios.get.mockResolvedValueOnce({"data": mockStationsData});

        let numberOfBikes = 1;

        const result = await getNetworkStationsByHref("/v2/networks/cincy-red-bike", numberOfBikes);

        const stationNames = [
            "StationName 1",
            "StationName 2",
            "StationName 3",
            "StationName U",
            "StationName V",
            "StationName W", 
            "StationName X",
            "StationName Z"
        ];
    })
});