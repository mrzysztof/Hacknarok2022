import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform, Button, Alert } from "react-native";
import { Camera } from "expo-camera"
import * as MediaLibrary from 'expo-media-library';


export const MyCamera: React.FC = (props) => {
    //  camera permissions
    const [hasPermissions, setHasPermissions] = useState(false);
    const [camera, setCamera] = useState<any>(null);

    // Screen Ratio and image padding
    const [imagePadding, setImagePadding] = useState(0);
    const [ratio, setRatio] = useState('4:3');  // default is 4:3
    const { height, width } = Dimensions.get('window');
    const screenRatio = height / width;

    const [isRatioSet, setIsRatioSet] = useState(false);

    // on screen  load, ask for permission to use the camera
    useEffect(() => {
        async function getMediaPermissions() {
            const camStatus = (await Camera.requestCameraPermissionsAsync()).status;
            const mediaStatus = await MediaLibrary.requestPermissionsAsync();
            
            setHasPermissions(camStatus == 'granted' && mediaStatus.granted);
        }
        getMediaPermissions();
    }, []);

    // set the camera ratio and padding.
    // this code assumes a portrait mode screen
    const prepareRatio = async () => {
        let desiredRatio = '4:3';  // Start with the system default
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios: any = await camera.getSupportedRatiosAsync();


            // Calculate the width/height of each of the supported camera ratios
            // These width/height are measured in landscape mode
            // find the ratio that is closest to the screen ratio without going over
            let distances: any = {};
            let realRatios: any = {};
            let minDistance = null;
            for (const ratio of ratios) {
                const parts = ratio.split(':');
                const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
                realRatios[ratio] = realRatio;
                // ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio;
                distances[ratio] = distance;

                if (minDistance == null) {
                    minDistance = ratio;
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio;
                    }
                }
            }
            // set the best match
            desiredRatio = minDistance;
            //  calculate the difference between the camera width and the screen height
            const remainder = Math.floor(
                (height - realRatios[desiredRatio] * width) / 2
            );
            // set the preview padding and preview ratio
            setImagePadding(remainder);
            setRatio(desiredRatio);

            // Set a flag so we don't do this 
            // calculation each time the screen refreshes
            setIsRatioSet(true);
        }
    };

    // the camera must be loaded in order to access the supported ratios
    const setCameraReady = async () => {
        if (!isRatioSet) {
            await prepareRatio();
        }
    };
    // return <Text>Hello</Text>
    if (hasPermissions === null) {
        return (
            <View style={styles.information} >
                <Text>Waiting for camera permissions </Text>
            </View>
        );
    } else if (hasPermissions === false) {
        return (
            <View style={styles.information} >
                <Text>No access to camera </Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container} >
                {/* 
        We created a Camera height by adding margins to the top and bottom, 
        but we could set the width/height instead 
        since we know the screen dimensions
        */}
                < Camera
                    style={[styles.cameraPreview, { marginTop: imagePadding, marginBottom: imagePadding }]}
                    onCameraReady={setCameraReady}
                    ratio={ratio}
                    ref={(ref) => {
                        setCamera(ref);
                    }
                    }>
                </Camera>
                <Button title="Zrób zdjęcie" onPress={() => takePhoto(camera)} />
            </View>
        );
    }
}

const takePhoto = (camera: Camera) => {
    camera.takePictureAsync().then(res => {
        MediaLibrary.saveToLibraryAsync(res.uri)
            .then(res => { console.log("Saved photo succesfully " + res) })
            .catch(e => { console.log("Could not save img " + e) })
    })
}

const styles = StyleSheet.create({
    information: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center'
    },
    cameraPreview: {
        flex: 1,
    }
});
