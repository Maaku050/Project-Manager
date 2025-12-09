import express from 'express'
import admin from 'firebase-admin'
import { verifyToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

const toTitleCase = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
}

router.post('/create', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { email, password, firstName, lastName, nickname, role } = req.body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !nickname || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'email',
          'password',
          'firstName',
          'lastName',
          'nickname',
          'role',
        ],
      })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
      })
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${toTitleCase(firstName)} ${toTitleCase(lastName)}`,
    })

    // Create profile document in Firestore
    const profileRef = await admin
      .firestore()
      .collection('profile')
      .add({
        firstName: toTitleCase(firstName),
        lastName: toTitleCase(lastName),
        email,
        nickName: nickname,
        role,
        points: 0,
        uid: userRecord.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })

    res.status(201).json({
      success: true,
      uid: userRecord.uid,
      profileId: profileRef.id,
      message: 'Employee created successfully',
    })
  } catch (error: any) {
    console.error('Error creating employee:', error)

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already exists' })
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Invalid email address' })
    }
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ error: 'Password is too weak' })
    }

    res.status(500).json({
      error: 'Failed to create employee',
      details: error.message,
    })
  }
})

export default router
