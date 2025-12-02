import { Profile } from '@/_types'
import React, { useState } from 'react'
import { Card } from '../ui/card'
import { HStack } from '../ui/hstack'
import { Avatar, AvatarFallbackText } from '../ui/avatar'
import { VStack } from '../ui/vstack'
import { Text } from '../ui/text'
import { Divider } from '../ui/divider'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
import { Archive } from 'lucide-react-native'
import ArchiveEmployeeModal from '@/modals/archiveEmployeeModal'
import { Badge, BadgeText } from '../ui/badge'
import { Role } from '@/_enums/role.enum'
import { useSelectState } from 'react-stately'
import UnarchiveEmployeeModal from '@/modals/UnarchiveEmployeeModal'

type UserProfileCardProps = {
  profile: Profile | undefined
}

const UserProfileCard: React.FC<UserProfileCardProps> = (props) => {
  const [isHover, setIsHover] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false)
  return (
    <>
      <Card style={{ backgroundColor: 'transparent' }}>
        <HStack
          style={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <HStack style={{ alignItems: 'center' }}>
            <Avatar size="2xl" style={{ marginRight: 15 }}>
              <AvatarFallbackText>{`${props.profile?.firstName}${props.profile?.lastName}`}</AvatarFallbackText>
            </Avatar>
            <VStack style={{ gap: 4 }}>
              <HStack style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>
                  {props.profile?.firstName} {`"${props.profile?.nickName}"`}{' '}
                  {props.profile?.lastName}
                </Text>
                <Divider
                  orientation="vertical"
                  className="mx-2 h-[32px] bg-[#414141]"
                />
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 400 }}>
                  {props.profile?.role}
                </Text>
              </HStack>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 400 }}>
                {props.profile?.email}
              </Text>
              {props.profile?.status === Role.ARCHIVED ? (
                <Badge
                  size="lg"
                  variant="solid"
                  action="muted"
                  style={{ width: 82 }}
                >
                  <BadgeText>Archived</BadgeText>
                </Badge>
              ) : (
                ''
              )}
            </VStack>
          </HStack>

          {props.profile?.status === Role.ARCHIVED ? (
            <Button
              variant="outline"
              onHoverIn={() => setIsHover(true)}
              onHoverOut={() => setIsHover(false)}
              onPress={() => setShowUnarchiveModal(true)}
            >
              <ButtonText style={{ color: isHover ? 'black' : 'white' }}>
                <HStack space="sm" style={{ alignItems: 'center' }}>
                  <Archive size={20} />
                  Unarchive
                </HStack>
              </ButtonText>
            </Button>
          ) : (
            <Button
              variant="outline"
              onHoverIn={() => setIsHover(true)}
              onHoverOut={() => setIsHover(false)}
              onPress={() => setShowArchiveModal(true)}
            >
              <ButtonText style={{ color: isHover ? 'black' : 'white' }}>
                <HStack space="sm" style={{ alignItems: 'center' }}>
                  <Archive size={20} />
                  Archive
                </HStack>
              </ButtonText>
            </Button>
          )}
        </HStack>
      </Card>

      <ArchiveEmployeeModal
        visible={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
      />

      <UnarchiveEmployeeModal
        visible={showUnarchiveModal}
        onClose={() => setShowUnarchiveModal(false)}
      />
    </>
  )
}

export default UserProfileCard
