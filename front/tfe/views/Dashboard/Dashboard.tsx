import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Dimensions,
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

const SLIDER_WIDTH = Dimensions.get("window").width;

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentConfigurationIndex, setCurrentConfigurationIndex] =
    useState<number>(0);
  const [currentOptionIndex, setCurrentOptionIndex] = useState<number>(0);
  const [showActionButton, setShowActionButton] = useState<boolean>(false);
  const [actionButtonLabel, setActionButtonLabel] = useState<string>("");

  const { user } = useContext(userContext);

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

  /*
  Get data for each type of button
   */
  const getChoicesBasingOnConfigIndex = (i: number): any[] => {
    const config = configuration[i];
    switch (config.type) {
      case DashboardActionTypes.CALENDAR:
        // @TODO: get incoming days
        return [{}];
        break;
      case DashboardActionTypes.CALL:
        return config.callContacts!;
        break;
      case DashboardActionTypes.WEATHER:
        // @TODO: get fetched data
        return [];
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
    configIndex: number,
  ) => {
    const config = configuration[configIndex];
    switch (config.type) {
      case DashboardActionTypes.CALENDAR:
        return (
          <DashboardTile bgColor="#AFBD7C">
            <Text>{item.content}</Text>
          </DashboardTile>
        );
        break;
      case DashboardActionTypes.CALL:
        return (
          <DashboardTile bgColor="#ffcab5">
            <Text style={styles.phoneCallTileText}>{item.name}</Text>
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
                renderChoiceCarouselItem(
                  item,
                  currentConfigurationIndex,
                )
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
    fontSize: 32,
    fontWeight: "500",
    marginBottom: 100
  },
});
