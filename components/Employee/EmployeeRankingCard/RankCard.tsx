import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { useUser } from "@/context/profileContext";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { Award } from 'lucide-react-native';

type prop = {
    // ID: String | undefined;
    rankIndex: number;
    firstName: String;
    nickName: String;
    lastName: String;
    points: number;
};

export default function RankCard({
    // ID, 
    rankIndex,
    firstName,
    nickName, 
    lastName, 
    points}: prop){
    const { profiles } = useUser();

    // const userProfile = profiles?.filter((user) => user.id === ID);

     const styles = StyleSheet.create({
         UserName: {
            fontFamily: "roboto, arial",
            color: "#fff",
            fontSize: 14,
            fontWeight: "semibold",
            // textAlign: "center",
         },
         cardBg: {
            backgroundColor: 
                rankIndex === 1 ? "#404040" 
                : rankIndex === 2 ? "#262626"
                : "#171717",
            borderRadius: 12,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 10,
            paddingBottom: 10,
         },

          ShadowBox: {
                boxShadow: '0px 4px 4px  #00000052',
                overflow: 'visible',
            },

         spaceBetween: {
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 0,
         },
         bordercheck: {
            borderWidth: 0,
         }
    });

    if(rankIndex === 1){
        return (
           <Card style={{...styles.cardBg, ...styles.ShadowBox}}>
            <HStack style={{...styles.spaceBetween}}>
            <Box style={{...styles.bordercheck}}>
                <Text style={{
                     fontFamily: "roboto, arial",
                    color: "#000000ff",
                    fontSize: 14,
                    fontWeight: "bold",
                    position: "absolute",
                    top: 3,
                    left: 13,

                    }}>{rankIndex}</Text>
                <Award 
                size={36} 
                fill={"#EFBF04"} 
                color={"#EFBF04"} />
            </Box>

            <Box style={{...styles.bordercheck}}>
                <Text style={{...styles.UserName}}>{firstName} "{nickName}" {lastName}</Text>
            </Box>

            <HStack style={{...styles.bordercheck, gap: 4, alignItems: "center"}}>
                <Text style={{...styles.UserName, justifyContent: "center", alignItems: "center"}}>{points}</Text>
                <Star size={24.75} fill={"yellow"} color={"yellow"} /> 
            </HStack>
            </HStack>
        </Card>
        )
    } else if(rankIndex === 2){
        return (
            <Card style={{...styles.cardBg, ...styles.ShadowBox}}>
            <HStack style={{...styles.spaceBetween}}>
            <Box style={{...styles.bordercheck}}>
                <Text style={{
                     fontFamily: "roboto, arial",
                    color: "#000000ff",
                    fontSize: 14,
                    fontWeight: "bold",
                    position: "absolute",
                    top: 3,
                    left: 13,

                    }}>{rankIndex}</Text>
                <Award 
                size={36} 
                fill={"#C0C0C0"} 
                color={"#C0C0C0"} />
            </Box>

            <Box style={{...styles.bordercheck}}>
                <Text style={{...styles.UserName}}>{firstName} "{nickName}" {lastName}</Text>
            </Box>

            <HStack style={{...styles.bordercheck, gap: 4, alignItems: "center"}}>
                <Text style={{...styles.UserName, justifyContent: "center", alignItems: "center"}}>{points}</Text>
                <Star size={24.75} fill={"yellow"} color={"yellow"} /> 
            </HStack>
            </HStack>
        </Card>
        )
    } else if(rankIndex === 3){
        return (
             <Card style={{...styles.cardBg, ...styles.ShadowBox}}>
            <HStack style={{...styles.spaceBetween}}>
            <Box style={{...styles.bordercheck}}>
                <Text style={{
                     fontFamily: "roboto, arial",
                    color: "#000000ff",
                    fontSize: 14,
                    fontWeight: "bold",
                    position: "absolute",
                    top: 3,
                    left: 13,

                    }}>{rankIndex}</Text>
                <Award 
                size={36} 
                fill={"#CD7F32"} 
                color={"#CD7F32"} />
            </Box>

            <Box style={{...styles.bordercheck}}>
                <Text style={{...styles.UserName}}>{firstName} "{nickName}" {lastName}</Text>
            </Box>

            <HStack style={{...styles.bordercheck, gap: 4, alignItems: "center"}}>
                <Text style={{...styles.UserName, justifyContent: "center", alignItems: "center"}}>{points}</Text>
                <Star size={24.75} fill={"yellow"} color={"yellow"} /> 
            </HStack>
            </HStack>
        </Card>
        )
    } else

    return (
        <Card style={{...styles.cardBg, ...styles.ShadowBox}}>
            <HStack style={{...styles.spaceBetween,  height: 35}}>
            <Box style={{...styles.bordercheck}}>
                <Text style={{
                    ...styles.UserName, 
                    fontSize: 16,
                    marginLeft: 12,
                    }}>{rankIndex}</Text>
            </Box>

            <Box style={{...styles.bordercheck}}>
                <Text style={{...styles.UserName}}>{firstName} "{nickName}" {lastName}</Text>
            </Box>

            <HStack style={{...styles.bordercheck, gap: 4, alignItems: "center"}}>
                <Text style={{...styles.UserName, justifyContent: "center", alignItems: "center"}}>{points}</Text>
                <Star size={24.75} fill={"yellow"} color={"yellow"} /> 
            </HStack>
            </HStack>
        </Card>
    )
}