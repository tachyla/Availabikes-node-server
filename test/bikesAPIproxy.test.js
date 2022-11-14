const {getNetworkHrefByCity} = require("../src/bikesAPIproxy.js");
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
});