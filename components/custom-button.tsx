import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type CustomButtonProps = TouchableOpacityProps & {
  title: string;
  containerStyles?: string;
  textStyles?: string;
};

export function CustomButton({
  title,
  containerStyles,
  textStyles,
  disabled,
  ...props
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        disabled ? "opacity-50" : ""
      }`}
      activeOpacity={0.7}
      accessibilityLabel="custom-button"
      {...props}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>

      {disabled && (
        <ActivityIndicator
          animating={disabled}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
}
