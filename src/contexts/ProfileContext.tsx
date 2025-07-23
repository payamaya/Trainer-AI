// // src/contexts/ProfileContext.tsx
// import { createContext, useContext, useState, useEffect } from 'react'
// import type { UserProfile } from '../types/user/user-profile'

// // Define your default profile shape
// const DEFAULT_PROFILE: UserProfile = {
//   name: '',
//   age: '',
//   gender: 'male',
//   height: '',
//   weight: '',
//   fitnessLevel: 'beginner',
//   goals: [],
//   completed: false,
// }

// interface ProfileContextType {
//   profile: UserProfile
//   setProfile: (profile: UserProfile) => void
// }

// const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [profile, setProfile] = useState<UserProfile>(() => {
//     // Load from localStorage if available
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('userProfile')
//       return saved ? JSON.parse(saved) : DEFAULT_PROFILE
//     }
//     return DEFAULT_PROFILE
//   })

//   useEffect(() => {
//     // Save to localStorage whenever profile changes
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('userProfile', JSON.stringify(profile))
//     }
//   }, [profile])

//   return (
//     <ProfileContext.Provider value={{ profile, setProfile }}>
//       {children}
//     </ProfileContext.Provider>
//   )
// }

// export const useProfile = () => {
//   const context = useContext(ProfileContext)
//   if (!context) {
//     throw new Error('useProfile must be used within a ProfileProvider')
//   }
//   return context
// }
