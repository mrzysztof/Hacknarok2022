import React, { useContext, useEffect, useState } from "react";
import parsePhoneNumber from "libphonenumber-js";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { Button, DashboardTile } from "../../components";
import { userContext } from "../../context";
import {
  DashboardActionConfiguration,
  DashboardActionTypes,
  User,
} from "../../declarations/types";
import { callNumber } from "../../utils/callNumber";
import { DashboardActionTypeToString } from "../../utils/DashboardActionTypeToString";
import { isUser } from "../../utils/isUser";
import { fetchNameDay } from "../../core/services/calendarService";
import { fetchWeatherForecastForNDays } from "../../core/services/weatherService";
import { dateToReadable } from "../../utils/dateToReadable";

const SLIDER_WIDTH = Dimensions.get("window").width;

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentConfigurationIndex, setCurrentConfigurationIndex] =
    useState<number>(0);
  const [currentOptionIndex, setCurrentOptionIndex] = useState<number>(0);
  const [showActionButton, setShowActionButton] = useState<boolean>(false);
  const [actionButtonLabel, setActionButtonLabel] = useState<string>("");
  const [nameDay, setNameDay] = useState<string[]>([]);
  const [weather, setWeather] = useState<any[]>([]);

  const { user } = useContext(userContext);

  useEffect(() => {
    const getNameDay = async () => {
      setNameDay((await fetchNameDay()).split(", "));
    };
    const fetchWeather = async () => {
      const { forecast } = await fetchWeatherForecastForNDays(3);
      setWeather(forecast);
    };

    getNameDay();
    fetchWeather();
  }, []);

  useEffect(() => {
    if (isUser(user)) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      const config = configuration[currentConfigurationIndex];
      if (config.type === DashboardActionTypes.CALL) {
        setShowActionButton(true);
        setActionButtonLabel("Make a call");
      } else {
        setShowActionButton(false);
        setActionButtonLabel("Go");
      }
    }
  }, [currentConfigurationIndex, user]);

  if (isLoading)
    return (
      <View>
        <ActivityIndicator />
      </View>
    );

  const configuration = (user as User).configuration;

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: DashboardActionConfiguration;
    index: number;
  }) => {
    const typeToColor = (type: DashboardActionTypes) => {
      switch (type) {
        case DashboardActionTypes.CALENDAR:
          return "#F7D08A";
          break;
        case DashboardActionTypes.CALL:
          return "#F79F79";
          break;
        case DashboardActionTypes.WEATHER:
          return "#E3F09B";
          break;
        default:
          return "#82C09A";
          break;
      }
    };

    return (
      <DashboardTile bgColor={typeToColor(item.type)}>
        <Text style={styles.configTileText}>
          {DashboardActionTypeToString(item.type)}
        </Text>
      </DashboardTile>
    );
  };

  // console.log(parsePhoneNumber(item.number))

  /*
  Get data for each type of button
   */
  const getChoicesBasingOnConfigIndex = (i: number): any[] => {
    const config = configuration[i];
    switch (config.type) {
      case DashboardActionTypes.CALENDAR:
        // @TODO: get incoming days
        return [
          {
            content: (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 24, opacity: 0.7, marginBottom: 5 }}>
                  Today is
                </Text>
                <Text
                  style={{ fontSize: 30, opacity: 0.9, fontWeight: "bold" }}
                >
                  {dayjs().format("dddd")}
                </Text>
                <Text
                  style={{
                    fontSize: 58,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {dayjs().format("Do")}
                </Text>
                <Text
                  style={{ fontSize: 44, textAlign: "center", opacity: 0.9 }}
                >
                  {dayjs().format("MMMM")}
                </Text>
              </View>
            ),
          },
          {
            content: (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 26, opacity: 0.8, marginBottom: 10 }}>
                  The Name Day of
                </Text>
                <Text style={{ fontSize: 32, textAlign: "center" }}>
                  {nameDay.slice(0, 5).join(", ")}
                </Text>
              </View>
            ),
          },
        ];
        break;
      case DashboardActionTypes.CALL:
        return config.callContacts!;
        break;
      case DashboardActionTypes.WEATHER:
        return weather.map((day) => {
          return {
            content: (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 22, opacity: 0.7 }}>
                  {dateToReadable(day.date)}
                </Text>
                <Image
                  style={{ width: 64, height: 64, marginBottom: 0 }}
                  source={{ uri: day.icon_url.replace("//", "https://") }}
                />
                <Text
                  style={{
                    fontSize: 30,
                    opacity: 1,
                    marginBottom: 20,
                    fontWeight: "bold",
                  }}
                >
                  {day.condition}
                </Text>
                <View
                  style={{
                    width: "95%",
                    paddingHorizontal: 13,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 3 }}>
                      <Text style={{ opacity: 0.9, fontSize: 20 }}>
                        Sunrise
                      </Text>
                      <Text
                        style={{
                          marginLeft: 4,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        {day.sunrise}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ opacity: 0.9, fontSize: 20 }}>Sunset</Text>
                      <Text
                        style={{
                          marginLeft: 4,
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {day.sunset}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Text style={{ opacity: 0.9, fontSize: 20 }}>
                    Chance of rain
                  </Text>
                  <Text
                    style={{
                      marginLeft: 4,
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {day.chance_of_rain}%
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Text style={{ opacity: 0.9, fontSize: 20 }}>
                    Average temperature
                  </Text>
                  <Text
                    style={{
                      marginLeft: 4,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {day.avg_temp_c}°C
                  </Text>
                </View>
              </View>
            ),
          };
        });
        break;
      default:
        return [];
        break;
    }
  };

  const renderChoiceCarouselItem = (
    {
      item,
      index,
    }: {
      item: any;
      index: number;
    },
    configIndex: number
  ) => {
    const config = configuration[configIndex];
    switch (config.type) {
      case DashboardActionTypes.CALENDAR:
        return <DashboardTile bgColor="#AFBD7C">{item.content}</DashboardTile>;
        break;
      case DashboardActionTypes.CALL:
        return (
          <DashboardTile bgColor="#ffcab5">
            <Text style={styles.phoneCallTileText}>{item.name}</Text>
            <Text
              style={{
                opacity: 0.7,
                textAlign: "center",
                marginBottom: 100,
                fontSize: 26,
              }}
            >
              {parsePhoneNumber(item.number)
                ? parsePhoneNumber(item.number)!.formatNational()
                : item.number}
            </Text>
          </DashboardTile>
        );
        break;
      case DashboardActionTypes.WEATHER:
        return <DashboardTile bgColor="#82C09A">{item.content}</DashboardTile>;
        break;
      default:
        return <DashboardTile bgColor="#82C09A"></DashboardTile>;
        break;
    }
  };

  const handleActionPress = (confIndex: number, choiceIndex: number) => {
    const config = configuration[confIndex];

    switch (config.type) {
      case DashboardActionTypes.CALL:
        const contacts = config.callContacts;
        if (contacts) {
          const contact = contacts[choiceIndex];
          callNumber(contact.number);
        }
        break;
      default:
        return <DashboardTile bgColor="#82C09A"></DashboardTile>;
        break;
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      <View style={styles.carouselWrapper}>
        <View style={styles.optionsCarousel}>
          <Carousel
            data={configuration}
            itemWidth={SLIDER_WIDTH}
            sliderWidth={SLIDER_WIDTH}
            renderItem={renderCarouselItem}
            onSnapToItem={setCurrentConfigurationIndex}
            loop
          />
        </View>
        <View style={styles.optionsChoicesCarouselWrapper}>
          <View style={styles.optionsChoicesCarousel}>
            <Carousel
              data={getChoicesBasingOnConfigIndex(currentConfigurationIndex)}
              itemWidth={SLIDER_WIDTH}
              sliderWidth={SLIDER_WIDTH}
              renderItem={(item) =>
                renderChoiceCarouselItem(item, currentConfigurationIndex)
              }
              onSnapToItem={setCurrentOptionIndex}
              loop
            />
          </View>
          <View
            style={[
              styles.actionButton,
              !showActionButton ? { display: "none" } : { display: "flex" },
            ]}
          >
            <Button
              onClick={() =>
                handleActionPress(currentConfigurationIndex, currentOptionIndex)
              }
              label={actionButtonLabel}
              bgColor="#B37295"
              fontSize={28}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    height: "100%",
    width: "100%",
  },
  carouselWrapper: {
    height: "100%",
    width: "100%",
  },
  optionsCarousel: {
    height: "50%",
    width: "100%",
  },
  optionsChoicesCarouselWrapper: {
    height: "50%",
    width: "100%",
  },
  optionsChoicesCarousel: {
    height: "100%",
    width: "100%",
  },
  actionButton: {
    position: "absolute",
    bottom: "13%",
    left: "0%",
    right: "0%",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  configTileText: {
    fontSize: 42,
    fontWeight: "bold",
  },
  phoneCallTileText: {
    fontSize: 46,
    fontWeight: "600",
    marginBottom: 8,
  },
});
