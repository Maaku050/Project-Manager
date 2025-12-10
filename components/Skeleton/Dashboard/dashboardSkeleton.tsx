import React, { useState } from 'react'
import { Box } from '@/components/ui/box'
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native'
import { Text } from '@/components/ui/text'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { View } from '@/components/Themed'
import { useProject } from '@/context/projectContext'
import { HStack } from '@/components/ui/hstack'
import { Divider } from '@/components/ui/divider'
import { VStack } from '@/components/ui/vstack'
import { LayoutDashboard } from 'lucide-react-native'
import ProjectBar from '@/components/ProjectBar'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

const PROJECT_PER_PAGE = 10


export default function DashboardSkeleton() {

      const { project, loading } = useProject()
      const [allProjecctPage, setAllProjectPage] = useState(1)
    
      const dimensions = useWindowDimensions()
      const isLargeScreen = dimensions.width >= 1280 // computer UI condition
      const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768 // tablet UI condition
    
      const allProject = project.filter((stat) => stat.status !== "Archived" && stat.status !== "Pending");
    
        const sortedProject = allProject.sort((a, b) => {
           const aOverdue =
                        a.deadline &&
                        a.deadline.toDate() < new Date() &&
                        a.status != 'Closed'
                      const bOverdue =
                        b.deadline &&
                        b.deadline.toDate() < new Date() &&
                        b.status != 'Closed'
    
                      if (aOverdue && !bOverdue) return -1
                      if (!aOverdue && bOverdue) return 1
    
                      const aTime = a.deadline
                        ? a.deadline.toDate().getTime()
                        : Infinity
                      const bTime = b.deadline
                        ? b.deadline.toDate().getTime()
                        : Infinity
    
                      const aClosed = a.status === "Closed";
                      const bClosed = b.status === "Closed";
    
                      if (aClosed && !bClosed) return +1
                      if (!aClosed && bClosed) return +2
                      return aTime - bTime
        });
    
        
    
         // ---------------pagination-------------------------
      const totalPages = Math.ceil(sortedProject.length / PROJECT_PER_PAGE)
      const startIndex = (allProjecctPage - 1) * PROJECT_PER_PAGE
      const endIndex = startIndex + PROJECT_PER_PAGE
      const sliceProject = sortedProject.slice(startIndex, endIndex)

      const styles = StyleSheet.create({
          ProjectContainer: {
            backgroundColor: 'transperent',
          },
          HstackContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 200,
            height: 150,
            backgroundColor: '#1f1f1f',
            margin: 4,
            borderRadius: 12,
          },
          statusText: {
            color: 'white',
            fontFamily: 'roboto, arial',
            fontWeight: 'medium',
            fontSize: isLargeScreen || isMediumScreen ? 24 : 14,
          },
          HstackContainerLarge: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1f1f1f',
            height: isLargeScreen || isMediumScreen ? 200 : 77,
            width: isLargeScreen || isMediumScreen ? '100%' : '100%',
            borderRadius: 12,
            paddingLeft: isLargeScreen || isMediumScreen ? 64 : 12,
            paddingRight: isLargeScreen || isMediumScreen ? 64 : 12,
            paddingTop: isLargeScreen || isMediumScreen ? 48 : 12,
            paddingBottom: isLargeScreen || isMediumScreen ? 48 : 12,
            gap: isLargeScreen || isMediumScreen ? 8 : 0,
          },
          statusTextLarge: {
            fontFamily: 'roboto, arial',
            fontSize: isLargeScreen || isMediumScreen ? 32 : 20,
            fontWeight: 'bold',
            color: 'white',
          },
          VstackContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            width: 160,
            height: 100,
            backgroundColor: 'white',
            margin: 10,
          },
          containerBG: {
            backgroundColor: '#171717',
          },
          projectHead: {
            flex: 1,
            color: 'white',
            textAlign: 'center',
            borderWidth: 0,
          },
        })


 return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: '#000000',
        padding: 24,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {isLargeScreen || isMediumScreen ? undefined : (
        
        <HStack
          style={{
            width: '100%',
            height: 50,
            alignContent: 'center',
            gap: 12,
          }}
        >
        <Skeleton style={{width: 75}}>
            
        </Skeleton>
          <SkeletonText>
          
          </SkeletonText>
        </HStack>
      )}

      <VStack
        style={{
          paddingTop: isLargeScreen || isMediumScreen ? undefined : 32,
          paddingBottom: isLargeScreen || isMediumScreen ? undefined : 32,
          gap: isLargeScreen || isMediumScreen ? 20 : 16,
          borderWidth: 0,
          height: isLargeScreen || isMediumScreen ? 250 : 'auto',
        }}
      >
        <Box>
            <SkeletonText style={{
                    height: 20,
                    width: 200,
                }}>
            </SkeletonText>
        </Box>
        <HStack
          style={{
            justifyContent: 'space-between',
            borderWidth: 0,
            borderColor: 'red',
            gap: isLargeScreen || isMediumScreen ? 20 : 8,
          }}
        >
        <Skeleton style={{
              ...styles.HstackContainerLarge,
              ...styles.containerBG,
            }}>
        </Skeleton>

        <Skeleton style={{
              ...styles.HstackContainerLarge,
              ...styles.containerBG,
            }}>
        </Skeleton>

        <Skeleton style={{
              ...styles.HstackContainerLarge,
              ...styles.containerBG,
            }}>
        </Skeleton>

        <Skeleton style={{
              ...styles.HstackContainerLarge,
              ...styles.containerBG,
            }}>
        </Skeleton>

        </HStack>
      </VStack>

      <VStack
        style={{
          marginTop: isLargeScreen || isMediumScreen ? 20 : 16,
          gap: 20,
          borderWidth: 0,
          flex: 1,
        }}
      >
        <Box>
        <SkeletonText style={{
            height: 20,
            width:200,
        }}>
         </SkeletonText>
        </Box>
        <Skeleton>
            <ScrollView
            style={{
                borderWidth: 0,
                borderColor: 'red',
                flex: 1,
                borderRadius: 12,
            }}
            horizontal={isLargeScreen || isMediumScreen ? false : true}
            showsHorizontalScrollIndicator={false}
            >
            <Box
                style={{
                padding: 12,
                borderWidth: 0,
                borderRadius: 12,
                ...styles.containerBG,
                flex: isLargeScreen || isMediumScreen ? 1 : undefined,
                width: isLargeScreen || isMediumScreen ? 'auto' : 1280,
                }}
            >
                <>
                <HStack
                    style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 20,
                    borderWidth: 0,
                    gap: 12,
                    }}
                >
                    <Text style={{ flex: 2, color: 'white', borderWidth: 0 }}>
                    Project Name
                    </Text>
                    <Text
                    style={{
                        ...styles.projectHead,
                    }}
                    >
                    Task Progress
                    </Text>
                    <Text
                    style={{
                        ...styles.projectHead,
                    }}
                    >
                    Status
                    </Text>
                    <Text
                    style={{
                        ...styles.projectHead,
                    }}
                    >
                    Employees
                    </Text>
                    <Text
                    style={{
                        ...styles.projectHead,
                    }}
                    >
                    Started on
                    </Text>
                    <Text
                    style={{
                        ...styles.projectHead,
                    }}
                    >
                    Deadline
                    </Text>
                </HStack>
                <Divider
                    orientation="horizontal"
                    style={{ marginTop: 20, marginBottom: 10, borderWidth: 1 }}
                    className="border-primary-500"
                />
                </>

                {/* --------------------------------------------------PROJECT BAR------------------------------------------------ */}
                <View
                style={{
                    ...styles.ProjectContainer,
                    borderWidth: 0,
                    flexGrow: 1,
                }}
                >
                {!project || project.length === 0 ? (
                    <Box
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        minHeight: '100%',
                    }}
                    >
                    <Text
                        style={{
                        ...styles.statusText,
                        fontSize: isLargeScreen || isMediumScreen ? 24 : 14,
                        }}
                    >
                        No Project Yet
                    </Text>
                    <Text>There is no Project for now</Text>
                    </Box>
                ) : (
                    <>
                    {sliceProject.map((ID) =>  <ProjectBar projectID={ID.id} /> )}
                    
                    </>
                )}
                </View>
                
            </Box>
            </ScrollView>
        </Skeleton>
      </VStack>
    </ScrollView>
  )


}