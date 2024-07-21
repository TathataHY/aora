import { icons } from "@/constants";
import { forwardRef, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type FormFieldProps = TextInputProps & {
  title: string;
  otherStyles?: string;
};

export const FormField = forwardRef<TextInput, FormFieldProps>(
  ({ title, otherStyles, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View className={`space-y-2 ${otherStyles}`}>
        <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
          <TextInput
            ref={ref}
            className="flex-1 text-white font-psemibold text-base"
            placeholderTextColor="#7B7B8B"
            secureTextEntry={title === "Password" && !showPassword}
            {...props}
          />

          {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eye : icons.eyeHide}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);
