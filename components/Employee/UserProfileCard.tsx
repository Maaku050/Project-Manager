import { Profile } from "@/_types";
import React from "react";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Divider } from "../ui/divider";

type UserProfileCardProps = {
  profile: Profile | undefined;
};

const UserProfileCard: React.FC<UserProfileCardProps> = (props) => {
  return (
    <>
      <Card style={{ backgroundColor: "transparent" }}>
        <HStack style={{ alignItems: "center" }}>
          <Avatar size="2xl" style={{ marginRight: 15 }}>
            <AvatarFallbackText>{`${props.profile?.firstName}${props.profile?.lastName}`}</AvatarFallbackText>
          </Avatar>
          <VStack style={{ gap: 4 }}>
            <HStack style={{ alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 24, fontWeight: 800 }}>
                {props.profile?.firstName} {`"${props.profile?.nickName}"`}{" "}
                {props.profile?.lastName}
              </Text>
              <Divider orientation="vertical" className="mx-2 h-[32px] bg-[#414141]" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: 400 }}>
                {props.profile?.role}
              </Text>
            </HStack>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 400 }}>
              {props.profile?.email}
            </Text>
          </VStack>
        </HStack>
      </Card>
    </>
  );
};

export default UserProfileCard;
