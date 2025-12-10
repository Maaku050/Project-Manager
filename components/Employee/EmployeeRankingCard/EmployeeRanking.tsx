import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useUser } from "@/context/profileContext";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text } from "react-native";
import RankCard from "./RankCard";

// import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";


export default function EmployeeRanking() {

    const { profiles } = useUser()

    const filteredProfile = profiles?.filter((withStar) => 
  withStar.points !== null && 
  withStar.points !== 0 && 
  withStar.points > 0 &&
  !isNaN(withStar.points)
);
    console.log(profiles?.length, "fitered profiles");
    const sortedProfile = filteredProfile?.sort((a, b) => b.points - a.points ).slice(0, 15);


    if (!sortedProfile){
        return (
             <VStack style={{backgroundColor: "transparent",  
             padding: 12,
             height: "100%",
             width: "100%",
             justifyContent: "center",
             alignItems: "center",
             }}>
                <Text style={{
                     fontFamily: "roboto, arial",
                    color: "#9e9e9eff",
                    fontSize: 14,
                    fontWeight: "semibold",
                }}>No Points Record Yet.</Text>
            </VStack>
        )
    }


return (

   <VStack style={{backgroundColor: "transparent", gap: 4, overflow: "visible"}}>
        {sortedProfile?.map((userID, index) => 
        <RankCard 
        key={userID.id} 
        rankIndex={index + 1}
        firstName={userID.firstName} 
        nickName={userID.nickName} 
        lastName={userID.lastName} 
        points={userID.points}
        />
        )}
   </VStack>

)
}

