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
        borderRadius: 4,
        color: "grey",
        width: "100%",
        height: '100%',
        padding: 10,
        maxHeight: 55,
        fontSize: 18,
        marginBottom: 20,
    },
});