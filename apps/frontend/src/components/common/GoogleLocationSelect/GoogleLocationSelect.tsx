import { useCallback } from "react";
import classes from "../CustomReactSelect/CustomReactSelect.module.scss";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { SingleValue } from "react-select";
import { Option } from "react-google-places-autocomplete/build/types";
import SvgIcon from "../SvgIcon/SvgIcon";

type CustomReactSelectProps = {
  id?: string;
  value?: any;
  instanceId?: string;
  classNames?: string;
  isClearable?: boolean;
  placeholder?: string;
  language?: string;
  onChange: (selected: SingleValue<Option> | null) => void;
};

const GoogleLocationSelect = ({
  id,
  value,
  instanceId,
  classNames = "",
  isClearable = true,
  language = "en",
  placeholder = "location...",
  onChange,
}: CustomReactSelectProps) => {
  const handleSelection = useCallback((items: SingleValue<Option> | null) => {
    onChange && onChange(items);
  }, []);

  return (
    <label className={classes.customReactSelectLabel}>
      <span className={classes.icon}>
        {<SvgIcon id="icon-location" color="#5964e0" />}
      </span>
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_LOCATION_API_KEY}
        minLengthAutocomplete={3}
        apiOptions={{
          language,
        }}
        selectProps={{
          value,
          id,
          instanceId,
          placeholder,
          isClearable,
          className: `${classes.customReactSelect} ${classNames}`,
          noOptionsMessage: () => "Please type min 3 chars...",
          onChange: handleSelection,
        }}
      />
    </label>
  );
};

export default GoogleLocationSelect;
