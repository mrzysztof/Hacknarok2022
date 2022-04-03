import { fetchApi } from "../../http";
import TokensManager from "../../http/TokensManager";

export const userService = {
  login: async (username: string, pass: string) => {
    try {
      const formData = new FormData();
      formData.append("user_name", username);
      formData.append("password", pass);

      const res = await fetchApi("/login", {
        requestConfig: {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data; boundary=123123",
            Accept: "*/*",
          },
          withCredentials: false,
        },
      });
      console.log(res);
      // TokensManager.setAccessToken(res.token);

      return {
        // token: res.
      };
    } catch (error) {
      console.log("blad");
      console.log(String(error));
      console.log(error);
    }
  },
};
