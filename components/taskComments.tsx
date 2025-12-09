import { useUser } from '@/context/profileContext'
import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { Text, useWindowDimensions, View } from 'react-native'
import { HStack } from './ui/hstack'
import { VStack } from './ui/vstack'
import { Avatar, AvatarFallbackText } from './ui/avatar'
import { timeAgo } from '@/helpers/timeAgoCalculator'
import {
  isCodeBlock,
  detectLanguage,
  formatCode,
  extractCode,
} from '@/helpers/codeBlockDetector'
import { tokenizeCode, getTokenStyle } from '@/helpers/syntaxHighlighting'

type TaskCommentsType = {
  uid: string
  text: string
  createdAt: Timestamp
}

export default function TaskComments({
  uid,
  text,
  createdAt,
}: TaskCommentsType) {
  const dimensions = useWindowDimensions()
  const isMobile = dimensions.width <= 1000
  const { profiles } = useUser()
  const currentUser = profiles.find((t) => t.uid === uid)
  if (!currentUser) return

  const isCode = isCodeBlock(text)
  const language = isCode ? detectLanguage(text) : ''
  const code = isCode ? extractCode(text) : ''
  const formattedCode = isCode ? formatCode(code, language) : ''
  const tokens = isCode ? tokenizeCode(formattedCode, language) : []

  return (
    <HStack space="sm">
      <Avatar size={isMobile ? 'sm' : 'md'}>
        <AvatarFallbackText style={{ color: 'white' }}>
          {currentUser.firstName}
        </AvatarFallbackText>
      </Avatar>
      <VStack style={{ flex: 1 }} space="sm">
        <HStack
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: isMobile ? 12 : 16,
            }}
          >
            {currentUser.firstName}
          </Text>
          <Text style={{ fontSize: isMobile ? 10 : 12, color: '#999' }}>
            {createdAt
              ? timeAgo(
                  createdAt.seconds
                    ? new Date(createdAt.seconds * 1000)
                    : new Date(createdAt.toDate())
                )
              : ''}
          </Text>
        </HStack>
        {isCode ? (
          <View
            style={{
              backgroundColor: '#1e1e1e',
              padding: 12,
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: '#569cd6',
            }}
          >
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              {tokens.map((token, i) => (
                <Text key={i} style={getTokenStyle(token.type)}>
                  {token.text}
                </Text>
              ))}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: isMobile ? 12 : 16,
            }}
          >
            {text}
          </Text>
        )}
      </VStack>
    </HStack>
  )
}
