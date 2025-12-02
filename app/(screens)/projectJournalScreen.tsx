import Pagination from '@/components/customPagination'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
  AccordionContentText,
} from '@/components/ui/accordion'
import { Box } from '@/components/ui/box'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
import { CloseIcon, Icon } from '@/components/ui/icon'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal'
import { useUser } from '@/context/profileContext'
import { useProject } from '@/context/projectContext'
import JournalAddModal from '@/modals/journalAddModal'
import JournalDeleteModal from '@/modals/journalDeleteModal'
import JournalEditModal from '@/modals/journalEditModal'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Plus,
  SquarePen,
  Trash,
} from 'lucide-react-native'
import React, { useState } from 'react'
import { ScrollView, Text, useWindowDimensions } from 'react-native'

interface Props {
  isExpanded: boolean
}

const PROJECTS_PER_PAGE = 10

export default function JournalScreen() {
  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 1280
  const isMediumScreen = dimensions.width <= 1280 && dimensions.width > 768
  const router = useRouter()
  const params = useLocalSearchParams()
  const { profiles } = useUser()
  const { project, journal } = useProject()
  const [showAddJournalModal, setShowAddJournalModal] = useState(false)
  const [editButtonHover, setEditButtonHover] = useState('')
  const [isHover, setIsHover] = useState(false)
  const [showEditConfirmationModal, setShowEditConfirmationModal] =
    useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedJournal, setSelectedJournal] = useState('')
  const [journalPage, setjournalPage] = useState(
    parseInt(params.journal as string) || 1
  )
  const currentProject = project.find(
    (t) => t.id === (params.project as string)
  )
  const allCurrentJournals = journal
    .filter((t) => t.projectID === currentProject?.id)
    .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime())
  const totalPages = Math.ceil(allCurrentJournals.length / PROJECTS_PER_PAGE)
  const startIndex = (journalPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const currentJournals = allCurrentJournals.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setjournalPage(page)
    router.setParams({ page: page.toString() })
  }

  if (!currentProject) return
  return (
    <ScrollView
      style={{
        backgroundColor: '#000000',
        paddingVertical: 20,
        paddingHorizontal: 100,
        minHeight: '100%',
        borderColor: 'red',
        borderWidth: 0,
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Box style={{ borderWidth: 0, marginBottom: 30 }}>
        <HStack
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {currentProject?.title}
          </Text>
        </HStack>
      </Box>
      <Box style={{ paddingRight: 10, paddingLeft: 10, paddingBottom: 15 }}>
        <Text style={{ color: 'white', lineHeight: 25 }}>
          {currentProject?.description}
        </Text>
      </Box>
      <Divider orientation="horizontal" style={{ backgroundColor: 'gray' }} />
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            marginVertical: 20,
          }}
        >
          Journal
        </Text>
        <Button
          style={{ backgroundColor: 'white', borderRadius: 8 }}
          onPress={() => setShowAddJournalModal(true)}
        >
          <ButtonIcon as={Plus} color={'black'} />
          <ButtonText style={{ color: 'black' }}>Add Journal</ButtonText>
        </Button>
      </HStack>

      <Box>
        <Accordion
          size="md"
          variant="filled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
          style={{ backgroundColor: 'transparent' }}
        >
          {currentJournals.map((journal) => (
            <AccordionItem
              value={journal.id}
              style={{
                backgroundColor: '#272625',
                borderRadius: 8,
                marginBottom: 5,
              }}
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: Props) => {
                    return (
                      <>
                        <AccordionTitleText style={{ color: 'white' }}>
                          <HStack
                            style={{
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Text>{journal.title}</Text>

                            <HStack style={{ alignItems: 'center' }} space="md">
                              <HStack
                                style={{ alignItems: 'center' }}
                                space="sm"
                              >
                                <Text style={{ fontWeight: 'normal' }}>
                                  Created By:
                                </Text>
                                <Text>
                                  {
                                    profiles?.find(
                                      (profile) =>
                                        profile.uid === journal.createdBy
                                    )?.firstName
                                  }{' '}
                                  {
                                    profiles?.find(
                                      (profile) =>
                                        profile.uid === journal.createdBy
                                    )?.lastName
                                  }
                                </Text>
                              </HStack>

                              <Divider
                                orientation="vertical"
                                style={{
                                  backgroundColor: 'gray',
                                  height: 30,
                                }}
                              />

                              <HStack
                                style={{ alignItems: 'center' }}
                                space="sm"
                              >
                                <Text style={{ fontWeight: 'normal' }}>
                                  Created at:{' '}
                                </Text>
                                <Text>
                                  {journal.date.toDate().toLocaleDateString()}
                                </Text>
                              </HStack>
                            </HStack>
                          </HStack>
                        </AccordionTitleText>
                        {isExpanded ? (
                          <AccordionIcon
                            as={ChevronUpIcon}
                            className="ml-3"
                            color="white"
                          />
                        ) : (
                          <AccordionIcon
                            as={ChevronDownIcon}
                            className="ml-3"
                            color="white"
                          />
                        )}
                      </>
                    )
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <AccordionContentText style={{ color: 'white' }}>
                  {journal.description}
                </AccordionContentText>
                <HStack
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                  space="md"
                >
                  <Button
                    style={{ borderRadius: 8 }}
                    variant="outline"
                    onHoverIn={() => setEditButtonHover(journal.id)}
                    onHoverOut={() => setEditButtonHover('')}
                  >
                    <ButtonIcon
                      as={SquarePen}
                      color={editButtonHover === journal.id ? 'black' : 'white'}
                    />
                    <ButtonText
                      style={{
                        color:
                          editButtonHover === journal.id ? 'black' : 'white',
                      }}
                      onPress={() => {
                        setSelectedJournal(journal.id)
                        setShowEditConfirmationModal(true)
                      }}
                    >
                      Edit Journal
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={() => {
                      setSelectedJournal(journal.id)
                      setShowDeleteModal(true)
                    }}
                    style={{ borderRadius: 8 }}
                    action="primary"
                  >
                    <ButtonIcon as={Trash} />
                    <ButtonText>Delete Journal</ButtonText>
                  </Button>
                </HStack>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>

      <Box>
        <Pagination
          currentPage={journalPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      <Modal
        isOpen={showEditConfirmationModal}
        onClose={() => setShowEditConfirmationModal(false)}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent
          style={{
            borderColor: 'red',
            borderWidth: 0,
            backgroundColor: '#000000',
          }}
        >
          <ModalHeader>
            <Heading size="xl" style={{ color: 'white' }}>
              Edit Journal
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} color="white" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text style={{ color: 'white', fontSize: 18 }}>
              Are you sure you want to edit this journal?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              className="mr-3"
              onPress={() => setShowEditConfirmationModal(false)}
              onHoverIn={() => setIsHover(true)}
              onHoverOut={() => setIsHover(false)}
              style={{
                backgroundColor: isHover ? 'gray' : '',
                borderRadius: 8,
              }}
            >
              <ButtonText style={{ color: 'white' }}>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowEditModal(true)
                setShowEditConfirmationModal(false)
              }}
              style={{ borderRadius: 8 }}
            >
              <ButtonText>Edit journal</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <JournalAddModal
        visible={showAddJournalModal}
        onClose={() => setShowAddJournalModal(false)}
      />

      <JournalEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        journalID={selectedJournal}
      />

      <JournalDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        journalID={selectedJournal}
      />
    </ScrollView>
  )
}
