import { Project } from "@/_types";
import React from "react";
import { Card } from "../ui/card";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Grid, GridItem } from "../ui/grid";
import { Status } from "@/_enums/status.enum";
import { Pressable } from "../ui/pressable";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { Button, ButtonText } from "../ui/button";
import capitalizeWord from "@/_helpers/capitalizeWord";

type OverdueProjectCardProps = {
  project: Project[];
};

const OverdueProjectCard: React.FC<OverdueProjectCardProps> = (props) => {
  return (
    <>
      <Card style={{ backgroundColor: "#171717" }}>
        <Box style={{ gap: 20 }}>
          <Box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 800 }}>Overdue Projects</Text>
          </Box>
          {props.project.filter((project) => project.status === Status.OVERDUE).length > 0 ? (
            <Grid _extra={{ className: "grid-cols-3 gap-4" }}>
              {props.project.reduce((acc: React.ReactNode[], project) => {
                if (project.status === Status.OVERDUE) {
                  acc.push(
                    <GridItem
                      key={project.id}
                      _extra={{ className: "col-span-1" }}
                      style={{ height: "100%" }}
                    >
                      <Pressable
                        // onPress={() => {
                        //   router.push(`/(screens)/employee/${t.uid}`);
                        // }}
                        style={{ height: "100%" }}
                      >
                        <Card
                          style={{
                            backgroundColor: "#000000",
                            borderColor: "#B91C1C",
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderLeftWidth: 8,
                            borderTopWidth: 1,
                            height: "100%",
                          }}
                        >
                          <HStack
                            style={{
                              height: "100%",
                            }}
                          >
                            <VStack
                              style={{
                                justifyContent: "space-between",
                                gap: 10,
                                height: "100%",
                              }}
                            >
                              <Text
                                style={{ color: "white", fontSize: 16, fontWeight: 600 }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {project.title}
                              </Text>
                              <Button
                                style={{
                                  backgroundColor: "#FEF1F1",
                                  height: 29,
                                  width: 78,
                                }}
                              >
                                <ButtonText
                                  style={{
                                    color: "#991B1B",
                                    fontSize: 14,
                                    fontWeight: 400,
                                  }}
                                >
                                  {capitalizeWord(project.status)}
                                </ButtonText>
                              </Button>
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
              No overdue projects
            </Text>
          )}
        </Box>
      </Card>
    </>
  );
};
export default OverdueProjectCard;
