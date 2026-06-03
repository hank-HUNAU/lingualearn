import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LearningProvider } from './context/LearningContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import LearnHub from './pages/LearnHub'
import ShadowReading from './pages/ShadowReading'
import Vocabulary from './pages/Vocabulary'
import Grammar from './pages/Grammar'
import Speaking from './pages/Speaking'
import Listening from './pages/Listening'
import Progress from './pages/Progress'
import Achievements from './pages/Achievements'
import Community from './pages/Community'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LearningProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shadow-reading" element={<ShadowReading />} />
              <Route path="/shadow-reading/:materialId" element={<ShadowReading />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/learn" element={<LearnHub />} />
              <Route path="/learn/vocabulary" element={<Vocabulary />} />
              <Route path="/learn/grammar" element={<Grammar />} />
              <Route path="/learn/speaking" element={<Speaking />} />
              <Route path="/learn/listening" element={<Listening />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </LearningProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
