import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'
import { Box } from '@/components/ui/box'
import { ScrollView, useWindowDimensions } from 'react-native'
import { View } from '@/components/Themed'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'


export default function HomeSkeleton() {
    const dimensions = useWindowDimensions()
    const isLargeScreen = dimensions.width >= 1280 // computer UI condition
    const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768 // tablet UI condition

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 24,
                backgroundColor: '#000000',
                flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
        >

            {/* -----------------------------------Top Group---------------------------------------- */}
            <HStack
                style={{
                    gap: 16,
                    borderWidth: 0,
                    borderColor: 'blue',
                    height: isLargeScreen || isMediumScreen ? 400 : 220,
                    flexDirection: isLargeScreen || isMediumScreen ? 'row' : 'column',
                }}
            >

                <Skeleton style={{
                    borderRadius: 12,
                    flex: 2,
                    maxHeight: 400,
                    backgroundColor: "#a7a7a7ff"
                }}>
                    <View>

                    </View>
                </Skeleton>

                <Skeleton style={{
                    flex: 1,
                    maxHeight: 400,
                }}
                    className="rounded-xl">
                    <VStack>
                    </VStack>
                </Skeleton>
            </HStack>


            {/* ---------------projet------------ */}

            <HStack style={{
                marginTop: 16,
                backgroundColor: 'transparent',
                borderRadius: 12,
                borderWidth: 0,
                borderColor: 'red',
                gap: 16,
                flex: 1,
            }}>
                <Skeleton style={{
                    borderRadius: 12,
                    borderWidth: 0,
                    borderColor: 'red',
                    padding: 28,
                    flex: 2,
                    flexDirection: "column"
                }}>
                    <Box>
                    </Box>
                </Skeleton>

                {isLargeScreen || isMediumScreen ? (
                    <Skeleton style={{
                        borderRadius: 12,
                        borderWidth: 0,
                        borderColor: 'red',
                        flex: 1,
                        padding: 16,
                        flexDirection: "column",
                    }}>
                        <View>
                        </View>
                    </Skeleton>
                ) : (undefined)}


            </HStack>

        </ScrollView>
    )
}






