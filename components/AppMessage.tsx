import React from "react";
// import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useUser } from "@/context/profileContext";

import { useState } from "react";

type appMessageProp = {
    userId: string | undefined;
};



export default function AppMessage({ userId }: appMessageProp) {

    const { profile, profiles } = useUser();
    const myProfile = profiles.find((p) => p.uid === userId);
    const profileNickname = myProfile?.nickName;


    const messageText = {
        "m1": `hello ${profileNickname}! welcome to. . .`,
        "m2": `You ready ${profileNickname}! Lets Go!`,
        "m3": `Hoping you a good day ${profileNickname}.`,
        "m4": `Focus ka lang sakin ${profileNickname}!`,
        "m5": `Kaya muna ${profileNickname}, Fighting!`,
        "m6": `Ready kana ${profileNickname}? Ano palag na?`,
        "m7": `${profileNickname}? Never Kapuyon.`,
        "m8": `Let's go! Let's go ${profileNickname}!`,
        "m9": `Sarap mo ${profileNickname}!`,
        "m10": `Here we go again ${profileNickname}! let's work`,
        "m11": `let's finnish this ${profileNickname}!`,
        "m12": `${profileNickname}! Kape muna.`


    };

    const keys = Object.keys(messageText) as Array<keyof typeof messageText>;

    const messageKeys = Math.floor(Math.random() * keys.length);

    // const randomMessage = Object.keys(messageText).find(messageKeys);
    const randomMessage = messageText[keys[messageKeys]] ?? "";






    return (
        <>
            <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", fontFamily: "roboto," }} size="xl">{randomMessage}</Text>
        </>
    );
}




