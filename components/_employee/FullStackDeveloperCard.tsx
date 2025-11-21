import { Profile } from "@/_types";
import React from "react";
import { Card } from "../ui/card";
import { Box } from "../ui/box";
import { Role } from "@/_enums/role.enum";
import { Grid, GridItem } from "../ui/grid";
import { HStack } from "../ui/hstack";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { useRouter } from "expo-router";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack/index.web";

type FullStackDeveloperCardProps = {
  profiles: Profile[];
};

const FullStackDeveloperCard: React.FC<FullStackDeveloperCardProps> = (props) => {
  const router = useRouter();
  return (
    <>
      <Card style={{ width: "100%", backgroundColor: "#171717" }}>
        <Box style={{ gap: 20 }}>
          <Box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 800 }}>
              Full Stack Developer/s
            </Text>
            <Text style={{ color: "white", fontSize: 16, fontWeight: 500 }}>
              {props.profiles.filter((t) => t.role === Role.FULL_STACK_DEVELOPER).length} employee/s
            </Text>
          </Box>
          {props.profiles.filter((t) => t.role === Role.FULL_STACK_DEVELOPER).length > 0 ? (
            <Grid _extra={{ className: "grid-cols-3 gap-4" }}>
              {props.profiles.reduce((acc: React.ReactNode[], t) => {
                if (t.role === Role.FULL_STACK_DEVELOPER) {
                  acc.push(
                    <GridItem key={t.id} _extra={{ className: "col-span-1" }}>
                      <Pressable
                        onPress={() => {
                          router.push(`/(screens)/employee/${t.uid}`);
                        }}
                      >
                        <Card
                          style={{
                            backgroundColor: "#000000",
                            borderColor: "#1D4ED8",
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderLeftWidth: 8,
                            borderTopWidth: 1,
                          }}
                        >
                          <HStack style={{ alignItems: "center" }}>
                            <Avatar size="md" style={{ marginRight: 15 }}>
                              <AvatarFallbackText>{`${t.firstName}${t.lastName}`}</AvatarFallbackText>
                            </Avatar>{" "}
                            <VStack>
                              <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
                                {t.firstName} {`"${t.nickName}"`} {t.lastName}
                              </Text>
                              <Text style={{ color: "white", fontSize: 14, opacity: 0.8 }}>
                                {t.email}
                              </Text>
                            </VStack>
                          </HStack>
                        </Card>
                      </Pressable>
                    </GridItem>
                  );
                }
                return acc;
              }, [])}
            </Grid>
          ) : (
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: 500,
                textAlign: "center",
                paddingBottom: 20,
              }}
            >
              No employees yet
            </Text>
          )}
        </Box>
      </Card>
    </>
  );
};

export default FullStackDeveloperCard;
