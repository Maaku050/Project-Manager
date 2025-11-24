import { Profile } from "@/_types";
import React from "react";
import { Card } from "../ui/card";
import { Box } from "../ui/box";
import { Grid, GridItem } from "../ui/grid";
import { Role } from "@/_enums/role.enum";
import { HStack } from "../ui/hstack";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { useRouter } from "expo-router";
import { Text } from "../ui/text";
import { Pressable } from "../ui/pressable";
import { VStack } from "../ui/vstack";

type ProjectManagerCardProps = {
  profiles: Profile[] | undefined;
};

const ProjectManagerCard: React.FC<ProjectManagerCardProps> = (props) => {
  const router = useRouter();

  return (
    <>
      <Card style={{ width: "100%", backgroundColor: "#171717" }}>
        <Box style={{ gap: 20 }}>
          <Box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 800 }}>Project Manager/s</Text>
            <Text style={{ color: "white", fontSize: 16, fontWeight: 500 }}>
              {props.profiles?.filter((profile) => profile.role === Role.PROJECT_MANAGER)?.length ??
                0}{" "}
              employee/s
            </Text>
          </Box>
          {(props.profiles?.filter((profile) => profile.role === Role.PROJECT_MANAGER)?.length ??
            0) > 0 ? (
            <Grid _extra={{ className: "grid-cols-3 gap-4" }}>
              {props.profiles?.reduce((acc: React.ReactNode[], profile) => {
                if (profile.role === Role.PROJECT_MANAGER) {
                  acc.push(
                    <GridItem
                      key={profile.id}
                      _extra={{
                        className: "col-span-1",
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          router.push(`/(screens)/employee/${profile.uid}`);
                        }}
                        style={{ height: "100%" }}
                      >
                        <Card
                          style={{
                            backgroundColor: "#000000",
                            borderColor: "#1D4ED8",
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderLeftWidth: 8,
                            borderTopWidth: 1,
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "flex-start",
                          }}
                        >
                          <HStack style={{ alignItems: "center" }}>
                            <Avatar size="md" style={{ marginRight: 15 }}>
                              <AvatarFallbackText>{`${profile.firstName}${profile.lastName}`}</AvatarFallbackText>
                            </Avatar>{" "}
                            <VStack>
                              <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
                                {profile.firstName} {`"${profile.nickName}"`} {profile.lastName}
                              </Text>
                              <Text style={{ color: "white", fontSize: 14, opacity: 0.8 }}>
                                {profile.email}
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

export default ProjectManagerCard;
