import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { OverlayHost } from './components/Overlays'
import { CustomerLayout, PortalLayout } from './layouts'
import {
  AboutPage,
  CareerDetailPage,
  CareersPage,
  ContactPage,
  HomePage,
  LegalPage,
  NotFoundPage,
} from './pages/marketing/MarketingPages'
import {
  AccountPage,
  AddressesPage,
  CartPage,
  CheckoutPage,
  CollectionPage,
  DineoutDetailPage,
  DineoutPage,
  FavouritesPage,
  GroupOrderPage,
  HelpPage,
  MembershipPage,
  OffersPage,
  OrderConfirmationPage,
  OrderDetailsPage,
  OrderHelpPage,
  OrdersPage,
  OrderTrackingPage,
  RestaurantMenuPage,
  RestaurantsPage,
  SearchPage,
} from './pages/customer/CustomerPages'
import {
  DeliveryPartnerApplyPage,
  DeliveryPartnerLandingPage,
  PartnerAnalyticsPage,
  PartnerApplicationPage,
  PartnerApplicationStatusPage,
  PartnerAvailabilityPage,
  PartnerDashboardPage,
  PartnerLandingPage,
  PartnerLoginPage,
  PartnerMenuPage,
  PartnerOffersPage,
  PartnerOrdersPage,
  PartnerPayoutsPage,
  PartnerProfilePage,
  PartnerReviewsPage,
  PartnerSupportPage,
} from './pages/partner/PartnerPages'
import {
  AdminAuditLogsPage,
  AdminContentPage,
  AdminLoginPage,
  AdminOrdersPage,
  AdminOverviewPage,
  AdminPromotionsPage,
  AdminRefundsPage,
  AdminRestaurantDetailPage,
  AdminRestaurantsPage,
  AdminRolesPage,
  AdminServiceAreasPage,
  AdminSettingsPage,
  AdminSupportPage,
  AdminUsersPage,
} from './pages/admin/AdminPages'
import './App.css'
import './styles/shared.css'
import './pages/marketing/marketing.css'
import './pages/customer/customer.css'
import './pages/partner/partner.css'
import './pages/admin/admin.css'

function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const sectionId = decodeURIComponent(hash.slice(1))

      window.requestAnimationFrame(() => {
        const section = document.getElementById(sectionId)

        if (section) {
          section.scrollIntoView({ block: 'start' })
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }
      })

      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search, hash])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:slug" element={<CareerDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/refunds" element={<LegalPage type="refunds" />} />
          <Route path="/restaurant" element={<Navigate to="/restaurants" replace />} />

          <Route element={<CustomerLayout />}>
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/:restaurantId" element={<RestaurantMenuPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="/orders/:orderId/track" element={<OrderTrackingPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/addresses" element={<AddressesPage />} />
            <Route path="/account/favourites" element={<FavouritesPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/help/orders/:orderId" element={<OrderHelpPage />} />
            <Route path="/dineout" element={<DineoutPage />} />
            <Route path="/dineout/:restaurantId" element={<DineoutDetailPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/group-order" element={<GroupOrderPage />} />
          </Route>

          <Route path="/delivery-partner" element={<DeliveryPartnerLandingPage />} />
          <Route path="/delivery-partner/apply" element={<DeliveryPartnerApplyPage />} />

          <Route path="/partner" element={<PartnerLandingPage />} />
          <Route path="/partner/login" element={<PartnerLoginPage />} />
          <Route path="/partner/apply" element={<PartnerApplicationPage />} />
          <Route path="/partner/application-status" element={<PartnerApplicationStatusPage />} />
          <Route path="/partner" element={<PortalLayout type="partner" />}>
            <Route path="dashboard" element={<PartnerDashboardPage />} />
            <Route path="orders" element={<PartnerOrdersPage />} />
            <Route path="menu" element={<PartnerMenuPage />} />
            <Route path="availability" element={<PartnerAvailabilityPage />} />
            <Route path="offers" element={<PartnerOffersPage />} />
            <Route path="analytics" element={<PartnerAnalyticsPage />} />
            <Route path="payouts" element={<PartnerPayoutsPage />} />
            <Route path="reviews" element={<PartnerReviewsPage />} />
            <Route path="profile" element={<PartnerProfilePage />} />
            <Route path="support" element={<PartnerSupportPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<PortalLayout type="admin" />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="restaurants" element={<AdminRestaurantsPage />} />
            <Route path="restaurants/:restaurantId" element={<AdminRestaurantDetailPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="service-areas" element={<AdminServiceAreasPage />} />
            <Route path="refunds" element={<AdminRefundsPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <OverlayHost />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
