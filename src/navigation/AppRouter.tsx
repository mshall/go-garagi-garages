import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { LoginPage } from '../features/auth/LoginPage';
import { BookingInboxPage } from '../features/bookings/BookingInboxPage';
import { RejectBookingPage } from '../features/bookings/RejectBookingPage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { EarningsPage } from '../features/earnings/EarningsPage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { PendingApprovalPage } from '../features/onboarding/PendingApprovalPage';
import { EditProfilePage } from '../features/profile/EditProfilePage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { PromotionsPage } from '../features/promotions/PromotionsPage';
import { QuotesPage } from '../features/quotes/QuotesPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { ReviewsPage } from '../features/reviews/ReviewsPage';
import { ServicesPage } from '../features/services/ServicesPage';
import { useGarageStore } from '../store/useGarageStore';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useGarageStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/pending-approval"
        element={
          <RequireAuth>
            <PendingApprovalPage />
          </RequireAuth>
        }
      />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="bookings" element={<BookingInboxPage />} />
        <Route path="bookings/:id/reject" element={<RejectBookingPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit" element={<EditProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
