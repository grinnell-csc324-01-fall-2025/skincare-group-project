import { StyleSheet, TouchableOpacity,Text, View } from "react-native";
import React from "react";

export default function MyButton ({text, onPress, disabled, backgroundColor = "#219ebcff"}) {
    return(
        <TouchableOpacity style={[styles.button, {backgroundColor : backgroundColor}]} onPress={onPress} disabled={disabled}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 70,
        borderRadius: 20,
        marginVertical: 15,
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
})