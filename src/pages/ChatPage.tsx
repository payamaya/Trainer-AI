// import { GoogleLogin } from '@react-oauth/google'
// import AIChat from '../components/AIChat'
// import { useAuth } from '../contexts/useAuth'

// export default function ChatPage() {
//   const { user, login, logout } = useAuth()

//   return (
//     <main className='chat-page'>
//       {!user ? (
//         <GoogleLogin
//           onSuccess={login}
//           onError={() => console.log('Login Failed')}
//           theme='filled_blue' // or "outline", "filled_black"
//           size='large' // or "medium", "small"
//           shape='rectangular' // or "circle", "square", "pill"
//           width='300' // custom width in pixels
//           text='signin_with' // or "signup_with", "continue_with"
//           logo_alignment='left' // or "center"
//           locale='en_US' // language/locale
//         />
//       ) : (
//         <div className='app-content'>
//           <AIChat googleUser={user} />
//           <button onClick={logout} className='logout-button'>
//             Sign Out
//           </button>
//         </div>
//       )}
//     </main>
//   )
// }
