import React from "react";
import {View, Text, Pressable, StyleSheet} from "react-native";
import { Star } from 'lucide-react-native';
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@/components/ui/popover';
import { useUser } from "@/context/profileContext";
import { useProject } from "@/context/projectContext";
import TaskStars from "@/components/Stars/starPoints";


type prop = {
  taskID: string | undefined;
};

export default function popStar({taskID}: prop) {

    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = () => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
    };
    const { profile } = useUser();
    const { tasks } = useProject();

     const currentTask = tasks.find((t) => t.id === taskID);
      if (!currentTask) {
        return (
          <Text style={{ color: "gray", fontStyle: "italic" }}>Task not found</Text>
        );
      }

      const styles = StyleSheet.create({
              numberIndicator: {
                  position: "absolute",
                  top: 6,
                  right: 11.5,
              }
          });

        


return (

    <View style={{flexGrow: 1, backgroundColor: "transparent", justifyContent: "center", alignItems: "center"}}>

        <Popover 
            isOpen={isOpen}
            onClose={handleClose}
            onOpen={handleOpen}
            placement="right"
            size="md"
            trigger={(click) => {
                return (
                     <Pressable {...click}>
                        <Star color={"yellow"} fill={"yellow"} size={30}/>
                        <Text style={{...styles.numberIndicator}}>{currentTask.starPoints}</Text>
                    </Pressable>
                )
            }}
        >
            <PopoverBackdrop />
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                    <TaskStars starID={currentTask.id} />
                </PopoverBody>
            </PopoverContent>
        </Popover>
        
  
    </View>
        
);

}


