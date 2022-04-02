import {
    StyleSheet,
    TextInput,
} from "react-native";


export interface TextFieldProps {
    onChange: (val: string) => void,
    placeholder: string,
    secure?: boolean
}

export const TextField: React.FC<TextFieldProps> = (props) => {
    return (
        <TextInput
            secureTextEntry={Boolean(props.secure)}
            style={styles.textInput}
            placeholder={props.placeholder}
            placeholderTextColor="#003f5c"
            onChangeText={props.onChange}
        />
    )
}

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: "white",
        borderRadius: 10,
        color: "grey",
        height: '100%',
        padding: 5,
        maxHeight: 45,
        marginBottom: 10
    },
});