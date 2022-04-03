import axios from "axios";

export const fetchNameDay = async (): Promise<any> => {
  const response = await axios("https://nameday.abalin.net/api/V1/today");
  // @todo: change hardcoded US
  return response.data["nameday"]["us"];
};
