import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Public/Home";
import About from "./pages/Public/About";
import Trainings from "./pages/Public/Trainings";
import Contact from "./pages/Public/Contact";
import SignIn from "./pages/AuthPages/SignIn";
import VerifyOTP from "./pages/AuthPages/VerifyOTP";
import ChangePassword from "./pages/AuthPages/ChangePassword";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import VerifyResetCode from "./pages/AuthPages/VerifyResetCode";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import Calendar from "./pages/Calendar";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/Users/UsersList";
import CreateUser from "./pages/Users/CreateUser";
import TrainingsList from "./pages/Trainings/TrainingsList";
import CreateTraining from "./pages/Trainings/CreateTraining";
import EditTraining from "./pages/Trainings/EditTraining";
import TrainingCategories from "./pages/Trainings/TrainingCategories";
import CreateTrainingCategory from "./pages/Trainings/CreateTrainingCategory";
import EditTrainingCategory from "./pages/Trainings/EditTrainingCategory";
import BlogPostsList from "./pages/Blog/BlogPostsList";
import CreateBlogPost from "./pages/Blog/CreateBlogPost";
import EditBlogPost from "./pages/Blog/EditBlogPost";
import CategoriesList from "./pages/Blog/CategoriesList";
import CategoryForm from "./pages/Blog/CategoryForm";
import TagsList from "./pages/Blog/TagsList";
import TagForm from "./pages/Blog/TagForm";
import EventsList from "./pages/Events/EventsList";
import CreateEvent from "./pages/Events/CreateEvent";
import EditEvent from "./pages/Events/EditEvent";
import EventsCalendar from "./pages/Events/EventsCalendar";
import OffersList from "./pages/Services/OffersList";
import CreateOffer from "./pages/Services/CreateOffer";
import EditOffer from "./pages/Services/EditOffer";
import ServicesList from "./pages/Services/ServicesList";
import CreateService from "./pages/Services/CreateService";
import EditService from "./pages/Services/EditService";
import TestimonialsList from "./pages/Content/TestimonialsList";
import PartnersList from "./pages/Content/PartnersList";
import ContactMessages from "./pages/Messages/ContactMessages";
import Newsletter from "./pages/Messages/Newsletter";
import MediaLibrary from "./pages/System/MediaLibrary";
import CompanyInfo from "./pages/System/CompanyInfo";
import ActivityLogs from "./pages/System/ActivityLogs";
import GlobalAnalytics from "./pages/Analytics/GlobalAnalytics";
import Settings from "./pages/System/Settings";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/OtherPage/Blank";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { RoleGuard } from "./guards/RoleGuard";
import { UserRole } from "./types/auth.types";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Pages - Main Entry Point */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes (Guest Only) */}
          <Route
            path="/signin"
            element={
              <GuestGuard>
                <SignIn />
              </GuestGuard>
            }
          />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-code" element={<VerifyResetCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            {/* Dashboard - Role-based rendering */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Users Management (SUPER_ADMIN only) */}
            <Route
              path="/users"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <UsersList />
                </RoleGuard>
              }
            />
            <Route
              path="/users/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <CreateUser />
                </RoleGuard>
              }
            />

            {/* Trainings Management (SUPER_ADMIN + ADMIN + EDITOR) */}
            <Route
              path="/admin/trainings"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <TrainingsList />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/trainings/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CreateTraining />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/trainings/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <EditTraining />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/trainings/categories"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <TrainingCategories />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/trainings/categories/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CreateTrainingCategory />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/trainings/categories/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <EditTrainingCategory />
                </RoleGuard>
              }
            />

            {/* Blog Management (SUPER_ADMIN + ADMIN + EDITOR) */}
            <Route
              path="/admin/blog/posts"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <BlogPostsList />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/posts/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CreateBlogPost />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/posts/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <EditBlogPost />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/categories"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CategoriesList />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/categories/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CategoryForm />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/categories/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CategoryForm />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/tags"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <TagsList />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/tags/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <TagForm />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/blog/tags/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <TagForm />
                </RoleGuard>
              }
            />

            {/* Events Management (SUPER_ADMIN + ADMIN + EDITOR) */}
            <Route
              path="/admin/events"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <EventsList />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/events/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CreateEvent />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/events/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <EditEvent />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/events/calendar"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <EventsCalendar />
                </RoleGuard>
              }
            />

            {/* Services Management (SUPER_ADMIN + ADMIN + EDITOR) */}
            <Route
              path="/admin/services"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <ServicesList />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/services/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <CreateService />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/services/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR]}>
                  <EditService />
                </RoleGuard>
              }
            />

            {/* Offers Management (SUPER_ADMIN + ADMIN) */}
            <Route
              path="/admin/offers"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <OffersList />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/offers/create"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <CreateOffer />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/offers/edit/:slug"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <EditOffer />
                </RoleGuard>
              }
            />

            {/* Content Management (SUPER_ADMIN + ADMIN) */}
            <Route
              path="/testimonials"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <TestimonialsList />
                </RoleGuard>
              }
            />
            <Route
              path="/partners"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <PartnersList />
                </RoleGuard>
              }
            />
            <Route
              path="/offers"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <OffersList />
                </RoleGuard>
              }
            />

            {/* Messages (SUPER_ADMIN + ADMIN) */}
            <Route
              path="/messages/contacts"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <ContactMessages />
                </RoleGuard>
              }
            />
            <Route
              path="/messages/newsletter"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <Newsletter />
                </RoleGuard>
              }
            />

            {/* System Pages (SUPER_ADMIN only) */}
            <Route
              path="/media"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <MediaLibrary />
                </RoleGuard>
              }
            />
            <Route
              path="/company"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <CompanyInfo />
                </RoleGuard>
              }
            />
            <Route
              path="/analytics"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <GlobalAnalytics />
                </RoleGuard>
              }
            />
            <Route
              path="/logs"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <ActivityLogs />
                </RoleGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <Settings />
                </RoleGuard>
              }
            />

            {/* Profile */}
            <Route path="/profile" element={<UserProfiles />} />
            
            {/* Calendar */}
            <Route path="/calendar" element={<Calendar />} />
            
            {/* Blank Page */}
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* UI Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
