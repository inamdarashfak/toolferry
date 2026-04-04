import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView } from '../lib/analytics'
import Layout from '../components/Layout/Layout'
import ContactUs from '../pages/ContactUs/ContactUs'
import Home from '../pages/Home/Home'
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy'
import Tool from '../pages/Tool/Tool'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  useEffect(() => {
    const path = `${pathname}${search}`
    initAnalytics()
    trackPageView(path)
  }, [pathname, search])

  return null
}

function AppRoutes() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/tool/:toolName" element={<Tool />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default AppRoutes
