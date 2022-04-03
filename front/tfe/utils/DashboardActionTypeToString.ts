import { DashboardActionTypes } from "../declarations/types";

export const DashboardActionTypeToString = (
  type: DashboardActionTypes
): string => {
  switch (type) {
    case DashboardActionTypes.CALENDAR:
      return "Calendar";
      break;
    case DashboardActionTypes.CALL:
      return "Call";
      break;
    case DashboardActionTypes.WEATHER:
      return "Weather";
      break;

    default:
      console.warn(
        `DashboardActionTypeToString: couldn't find matching string for type ${type}`
      );
      return "Button";
      break;
  }
};
