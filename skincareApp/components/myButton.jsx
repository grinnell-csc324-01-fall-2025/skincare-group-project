import { StyleSheet, Button, View } from "react-native";

const myButton = ({title, onPress}) => {
    return(
        <View style={styles.button}>
            <Button 
                title={title}
                onPress={onPress}
            >
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 30,
        gap:50
    }
})