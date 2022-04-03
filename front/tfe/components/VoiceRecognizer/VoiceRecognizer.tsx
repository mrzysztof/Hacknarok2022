import axios from 'axios';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as FileSystem from "expo-file-system"

export const VoiceRecognizer = (props: any) => {
    const recording = useRef(new Audio.Recording())
    const AudioPlayer = useRef(new Audio.Sound());
    const [uri, setUri] = useState("")
    const [text, setText] = useState("Nothing")

    useEffect(() => {
        async function getPermission() {
            await Audio.requestPermissionsAsync()
        }
        getPermission()
    }, [])

    const startRecord = async () => {
        console.log("Starting recording");

        try {
            await recording.current.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY);
            await recording.current.startAsync();
            // You are now recording!
            // console.log(recording.current);

        } catch (error) {
            console.log("Could not record", error);

        }
    }

    const endRecord = async () => {
        console.log("Ending recording");
        try {
            console.log(recording.current.getURI());
            await recording.current.stopAndUnloadAsync()
            const res = recording.current.getURI()
            if (res !== null) {
                setUri(res)
            }
            recording.current = new Audio.Recording();
        } catch (error) {
            console.log("Could not stop recording", error);

        }
    }

    const replay = async () => {
        try {
            // Load the Recorded URI
            if (!AudioPlayer.current._loaded) {
                await AudioPlayer.current.loadAsync({ uri }, {}, true);
            }
            // Get Player Status
            const playerStatus = await AudioPlayer.current.getStatusAsync();

            // Play if song is loaded successfully
            if (playerStatus.isLoaded) {
                if (playerStatus.isPlaying === false) {
                    await AudioPlayer.current.replayAsync();
                }
            }
        } catch (error) {
            console.log("Oh no", error);

        }
    }
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const send = async () => {
        const BAD_API_TOKEN = "ab323b2f42964cd0a1bb379dedba696b";
        const assembly = axios.create({
            baseURL: "https://api.assemblyai.com/v2",
            headers: {
                authorization: BAD_API_TOKEN,
                "content-type": "application/json",
            },
        });

        FileSystem.uploadAsync("https://api.assemblyai.com/v2/upload", uri, {
            headers: {
                authorization: BAD_API_TOKEN,
                "content-type": "application/json",
                "transfer-encoding": "chunked",
            },
            httpMethod: "POST",
            mimeType: "audio/m4a"
        }).then(res => {
            console.log("Asking for transcription");

            const { upload_url } = JSON.parse(res.body)
            assembly
                .post("/transcript", {
                    audio_url: upload_url
                })
                .then(async (trans_res) => {
                    const trans_id = trans_res.data.id
                    // console.log(trans_res.data);

                    console.log("Transcription id is ", trans_id);
                    if (!trans_id) {
                        console.log("Transcription failed");

                    }
                    let completed = false
                    let final_res: any = null
                    let tries = 0;
                    const max_tries = 20;
                    while (!completed && tries < max_tries) {
                        console.log(`Check status ${tries}`);
                        const status_res = await assembly.get(`/transcript/${trans_id}`)
                        completed = status_res.data.status === "completed"
                        final_res = status_res.data
                        await delay(500)
                        tries += 1
                    }
                    console.log("Final result is ", final_res);
                    setText(final_res.text)
                })
        }).catch(e => console.log("Oh no ", e))
    }

    return (
        <View>
            <Button title="Start" onPress={startRecord}></Button>
            <Button title="Ends" onPress={endRecord}></Button>
            <Button title="Replay" onPress={replay}></Button>
            <Button title="Send" onPress={send}></Button>
            <Text>{text}</Text>
        </View>
    )
} 