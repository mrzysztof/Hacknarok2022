import axios from "axios";

const API_SECRET = "OTA3MmQ5OWEtNGIyNC00ZGFjLWIzZmYtZWE0M2M4YjgzN2M5";

export const fetchWeatherForecastForNDays = async (n: number) => {
  if (n <= 0) throw new Error("n must be a positive number");
    try {
        const response = await axios("https://api.m3o.com/v1/weather/Forecast", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_SECRET}`,
    },
    data: {
      days: n,
      location: "London"
    },
  });

  console.log(response.data);

  return response.data;
    } catch (error) {
        console.log(String(error));
        
    }
  
};
