import React from 'react'
import { useAuth } from '../../contexts/useAuth'
import './GithubLogin.css'
import { FaGithub } from 'react-icons/fa'
const GithubLogin: React.FC = () => {
  const { githubLogin } = useAuth()

  const handleGithubLogin = async () => {
    try {
      await githubLogin()
    } catch (error) {
      console.error('GitHub login failed:', error)
    }
  }

  return (
    <button onClick={handleGithubLogin} className='github-login-button'>
      <div className='gitIcon'>
        <FaGithub />
      </div>
      Sign in with GitHub
    </button>
  )
}

export default GithubLogin
