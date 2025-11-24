import { Project } from "@/_types";
import React from "react";
import { Card } from "../ui/card";
import { Text } from "../ui/text";
import { Box } from "../ui/box";

type ClosedProjectCardProps = {
  project: Project[];
};

const ClosedProjectCard: React.FC<ClosedProjectCardProps> = (props) => {
  return (
    <>
      <Card style={{ backgroundColor: "#171717" }}>
        <Box style={{ gap: 20 }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: 800 }}>Closed Projects</Text>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 500,
              textAlign: "center",
              paddingBottom: 20,
            }}
          >
            No closed projects
          </Text>
        </Box>
      </Card>
    </>
  );
};

export default ClosedProjectCard;
