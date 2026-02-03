import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DiliginceChatbot } from "@/components/chatbot";
import { UserProvider } from "@/contexts/UserContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { NotificationStoreProvider } from "@/contexts/NotificationStoreContext";
import { EnhancedApprovalProvider } from "@/contexts/EnhancedApprovalContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { RequirementProvider } from "@/contexts/RequirementContext";
import { ApprovalProvider } from "@/contexts/ApprovalContext";
import { StakeholderProvider } from "@/contexts/StakeholderContext";
import { VendorSpecializationProvider } from "@/contexts/VendorSpecializationContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { PricingSelectionProvider } from "@/contexts/PricingSelectionContext";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";


// Public pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import Careers from "@/pages/Careers";
import Legal from "@/pages/Legal";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Security from "@/pages/Security";
import CookiePolicy from "@/pages/CookiePolicy";
import HelpCenter from "@/pages/HelpCenter";
import Documentation from "@/pages/Documentation";
import Community from "@/pages/Community";
import PressKit from "@/pages/PressKit";
import SignUp from "@/pages/SignUp";
import MultiStepLogin from "@/pages/MultiStepLogin";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import ComingSoon from "@/pages/ComingSoon";
import ProfileCompletion from "@/pages/ProfileCompletion";
import TestPage from "@/pages/TestPage";
import BlogArticle from "@/pages/BlogArticle";
import StakeholderOnboarding from "@/pages/StakeholderOnboarding";
import PendingApproval from "@/pages/PendingApproval";
import PendingApprovals from "@/pages/PendingApprovals";
import WorkCompletionPayment from "@/pages/WorkCompletionPayment";
import VerificationPending from "@/pages/VerificationPending";
import VendorSettings from "@/pages/VendorSettings";
import VendorPaymentSettings from "@/pages/VendorPaymentSettings";
import VendorCertifications from "@/pages/VendorCertifications";
import VendorProjectsPortfolio from "@/pages/VendorProjectsPortfolio";

// Industry pages
import IndustryDashboard from "@/pages/IndustryDashboard";
import IndustryProfile from "@/pages/IndustryProfile/IndustryProfile";
import IndustryRequirements from "@/pages/IndustryRequirements";
import IndustryApprovals from "@/pages/IndustryApprovals";
import IndustryPurchaseOrders from "@/pages/IndustryPurchaseOrders";
import IndustryQuotes from "@/pages/IndustryQuotes";
import IndustryReports from "@/pages/IndustryReports";
import IndustrySettings from "@/pages/IndustrySettings";
import IndustryWorkflows from "@/pages/IndustryWorkflows";
import IndustryProjectWorkflow from "@/pages/IndustryProjectWorkflow";
import IndustryWorkflowDetails from "@/pages/IndustryWorkflowDetails";
import IndustryStakeholders from "@/pages/IndustryStakeholders";
import IndustryDocuments from "@/pages/IndustryDocuments";
import IndustryMessages from "@/pages/IndustryMessages";
import UserAccountSettings from "@/pages/settings/UserAccountSettings";

import IndustryAnalytics from "@/pages/IndustryAnalytics";
import TeamMembersPage from "@/pages/settings/TeamMembersPage";
import IndustryNotifications from "@/pages/IndustryNotifications";
import CreateRequirement from "@/pages/CreateRequirement";
import CreatePurchaseOrder from "@/pages/CreatePurchaseOrder";
import CreateEditPurchaseOrder from "@/pages/CreateEditPurchaseOrder";
import RoleManagement from "@/pages/RoleManagement";
import RoleManagementPage from "@/pages/RoleManagementPage";
import CreateRolePage from "@/pages/CreateRolePage";
import EditRolePage from "@/pages/EditRolePage";
import ViewRolePage from "@/pages/ViewRolePage";
import VendorRoleManagementPage from "@/pages/VendorRoleManagementPage";
import VendorCreateRolePage from "@/pages/VendorCreateRolePage";
import VendorEditRolePage from "@/pages/VendorEditRolePage";
import VendorViewRolePage from "@/pages/VendorViewRolePage";
import { ApprovalMatrixListPage } from "@/pages/ApprovalMatrixListPage";
import { ApprovalMatrixFormPage } from "@/pages/ApprovalMatrixFormPage";
import { ApprovalMatrixViewPage } from "@/pages/ApprovalMatrixViewPage";

// Requirements sub-pages
import RequirementsDrafts from "@/pages/RequirementsDrafts";
import RequirementsPending from "@/pages/RequirementsPending";
import PendingRequirementView from "@/pages/PendingRequirementView";
import RequirementsApproved from "@/pages/RequirementsApproved";
import ApprovedRequirementView from "@/pages/ApprovedRequirementView";
import RequirementsPublished from "@/pages/RequirementsPublished";
import PublishedRequirementView from "@/pages/PublishedRequirementView";
import RequirementDetails from "@/pages/RequirementDetails";

// Quotations sub-pages
import QuotationsPending from "@/pages/QuotationsPending";
import QuotationsApproved from "@/pages/QuotationsApproved";
import QuotationsComparison from "@/pages/QuotationsComparison";
import QuotationDetails from "@/pages/QuotationDetails";
import QuotationsForRequirement from "@/pages/QuotationsForRequirement";

// Purchase Orders sub-pages
import PurchaseOrdersPending from "@/pages/PurchaseOrdersPending";
import PurchaseOrdersInProgress from "@/pages/PurchaseOrdersInProgress";
import PurchaseOrdersCompleted from "@/pages/PurchaseOrdersCompleted";
import PurchaseOrderDetails from "@/pages/PurchaseOrderDetails";
import VendorPurchaseOrderDetails from "@/pages/VendorPurchaseOrderDetails";

// Workflow sub-pages
import WorkflowsActive from "@/pages/WorkflowsActive";
// import WorkflowsTimeline from "@/pages/WorkflowsTimeline";
// import WorkflowsReports from "@/pages/WorkflowsReports";

// Stakeholder sub-pages
import StakeholdersVendors from "@/pages/StakeholdersVendors";
import StakeholdersProfessionals from "@/pages/StakeholdersProfessionals";

// Diligince HUB pages
import FindVendors from "@/pages/Diligince-hub/FindVendors";
import FindProfessionals from "@/pages/Diligince-hub/FindProfessionals";

// Vendor pages
import ServiceVendorDashboard from "@/pages/ServiceVendorDashboard";
import ProductVendorDashboard from "@/pages/ProductVendorDashboard";
import LogisticsVendorDashboard from "@/pages/LogisticsVendorDashboard";

// Service Vendor pages
// ServiceVendorRFQs removed - using VendorRFQsBrowse instead
import ServiceVendorProjects from "@/pages/ServiceVendorProjects";
import ServiceVendorMessages from "@/pages/ServiceVendorMessages";
import ServiceVendorProfile from "@/pages/ServiceVendorProfile";
import ServiceVendorServices from "@/pages/ServiceVendorServices";
import VendorWorkflowDetails from "@/pages/VendorWorkflowDetails";

// Product Vendor pages
import ProductVendorRFQs from "@/pages/ProductVendorRFQs";
import ProductVendorOrders from "@/pages/ProductVendorOrders";
import ProductVendorCatalog from "@/pages/ProductVendorCatalog";
import ProductVendorMessages from "@/pages/ProductVendorMessages";
import ProductVendorProfile from "@/pages/ProductVendorProfile";

// Logistics Vendor pages
import LogisticsVendorRequests from "@/pages/LogisticsVendorRequests";
import LogisticsVendorDeliveries from "@/pages/LogisticsVendorDeliveries";
import LogisticsVendorFleet from "@/pages/LogisticsVendorFleet";
import LogisticsVendorMessages from "@/pages/LogisticsVendorMessages";
import LogisticsVendorProfile from "@/pages/LogisticsVendorProfile";

// Professional pages
import ProfessionalDashboard from "@/pages/ProfessionalDashboard";
import ProfessionalOpportunities from "@/pages/ProfessionalOpportunities";
import ProfessionalCalendar from "@/pages/ProfessionalCalendar";
import ProfessionalMessages from "@/pages/ProfessionalMessages";
import ProfessionalProfile from "@/pages/ProfessionalProfile";
import ProfessionalPortfolio from "@/pages/ProfessionalPortfolio";
import ProfessionalCertifications from "@/pages/ProfessionalCertifications";

// Professional sub-pages
import OpportunitiesSaved from "@/pages/OpportunitiesSaved";
import OpportunitiesApplications from "@/pages/OpportunitiesApplications";
import ProjectsActive from "@/pages/ProjectsActive";

// Vendor sub-pages
import VendorRFQsBrowse from "@/pages/VendorRFQsBrowse";
import VendorRFQsSaved from "@/pages/VendorRFQsSaved";
import VendorRFQsApplied from "@/pages/VendorRFQsApplied";
import VendorRFQDetail from "@/pages/VendorRFQDetail";
import VendorSubmitQuotation from "@/pages/VendorSubmitQuotation";
import VendorQuotations from "@/pages/VendorQuotations";
import VendorQuotationDetails from "@/pages/VendorQuotationDetails";

// Subscription pages
import SubscriptionPlans from "@/pages/subscription/SubscriptionPlans";
import SubscriptionTransactions from "@/pages/subscription/SubscriptionTransactions";
import TransactionDetail from "@/pages/subscription/TransactionDetail";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <UserProvider>
          <WebSocketProvider>
            <PermissionsProvider>
              <NotificationStoreProvider>
                <NotificationProvider>
                  <EnhancedApprovalProvider>
                    <RequirementProvider>
                      <ApprovalProvider>
                        <StakeholderProvider>
                          <VendorSpecializationProvider>
                            <PricingSelectionProvider>
                              <div className="App">
                                <Routes>
                                  {/* Public Routes */}
                                  <Route path="/" element={<Index />} />
                                  <Route path="/about" element={<About />} />
                                  <Route path="/contact" element={<Contact />} />
                                  <Route path="/pricing" element={<Pricing />} />
                                  <Route path="/blog" element={<Blog />} />
                                  <Route
                                    path="/blog/:slug"
                                    element={<BlogArticle />}
                                  />
                                  <Route path="/careers" element={<Careers />} />
                                  <Route path="/legal" element={<Legal />} />
                                  <Route path="/privacy" element={<Privacy />} />
                                  <Route path="/terms" element={<Terms />} />
                                  <Route path="/security" element={<Security />} />
                                  <Route path="/cookies" element={<CookiePolicy />} />
                                  <Route path="/help" element={<HelpCenter />} />
                                  <Route path="/documentation" element={<Documentation />} />
                                  <Route path="/community" element={<Community />} />
                                  <Route path="/press" element={<PressKit />} />
                                  <Route path="/solutions/industries" element={<ComingSoon />} />
                                  <Route path="/solutions/professionals" element={<ComingSoon />} />
                                  <Route path="/solutions/vendors" element={<ComingSoon />} />
                                  <Route path="/solutions/enterprise" element={<ComingSoon />} />

                                  {/* Coming Soon Route */}
                                  <Route path="/coming-soon" element={<ComingSoon />} />

                                  {/* Auth Routes */}
                                  <Route path="/signup" element={<SignUp />} />
                                  <Route path="/login" element={<MultiStepLogin />} />
                                  <Route
                                    path="/forgot-password"
                                    element={<ForgotPassword />}
                                  />
                                  <Route
                                    path="/reset-password/:token"
                                    element={<ResetPassword />}
                                  />
                                  <Route
                                    path="/pending-approval"
                                    element={<PendingApproval />}
                                  />
                                  <Route
                                    path="/verification-pending"
                                    element={
                                      <ProtectedRoute>
                                        <VerificationPending />
                                      </ProtectedRoute>
                                    }
                                  />
                                  {/* Legacy vendor-settings route - redirect to dashboard path */}
                                  <Route
                                    path="/vendor-settings"
                                    element={<Navigate to="/dashboard/vendor-settings" replace />}
                                  />

                                  {/* Profile & Onboarding */}
                                  <Route
                                    path="/profile-completion"
                                    element={<ProfileCompletion />}
                                  />
                                  <Route
                                    path="/stakeholder-onboarding/:token"
                                    element={<StakeholderOnboarding />}
                                  />

                                  {/* Dashboard Routes */}
                                  <Route path="/dashboard/*" element={
                                    <ProtectedRoute>
                                      <Layout />
                                    </ProtectedRoute>
                                  }>
                                    {/* Vendor Settings (inside dashboard for sidebar visibility) */}
                                    <Route
                                      path="vendor-settings"
                                      element={<VendorSettings />}
                                    />

                                    {/* Industry */}
                                    <Route
                                      path="industry"
                                      element={<IndustryDashboard />}
                                    />
                                    <Route
                                      path="industry-profile"
                                      element={<IndustryProfile />}
                                    />
                                    <Route
                                      path="industry-requirements"
                                      element={<IndustryRequirements />}
                                    />
                                    <Route
                                      path="industry-approvals"
                                      element={<IndustryApprovals />}
                                    />
                                    <Route
                                      path="industry-purchase-orders"
                                      element={<IndustryPurchaseOrders />}
                                    />
                                    <Route
                                      path="industry-quotes"
                                      element={<IndustryQuotes />}
                                    />
                                    <Route
                                      path="industry-reports"
                                      element={<IndustryReports />}
                                    />
                                    <Route
                                      path="industry-settings"
                                      element={<IndustrySettings />}
                                    />
                                    <Route
                                      path="industry-workflows"
                                      element={<IndustryWorkflows />}
                                    />
                                    <Route
                                      path="industry-project-workflow/:id"
                                      element={<IndustryProjectWorkflow />}
                                    />
                                    <Route
                                      path="workflow-details/:id"
                                      element={<IndustryWorkflowDetails />}
                                    />
                                    <Route
                                      path="industry-stakeholders"
                                      element={<IndustryStakeholders />}
                                    />
                                    <Route
                                      path="industry-documents"
                                      element={<IndustryDocuments />}
                                    />
                                    <Route
                                      path="industry-messages"
                                      element={<IndustryMessages />}
                                    />
                                    {/* Redirect from old approval matrix path to new redesigned pages */}
                                    <Route
                                      path="industry-approval-matrix"
                                      element={<Navigate to="/dashboard/approval-matrix" replace />}
                                    />
                                    <Route
                                      path="industry-analytics"
                                      element={<IndustryAnalytics />}
                                    />
                                    <Route
                                      path="industry-team"
                                      element={<TeamMembersPage />}
                                    />
                                    <Route
                                      path="industry-notifications"
                                      element={<IndustryNotifications />}
                                    />
                                    <Route
                                      path="create-requirement"
                                      element={<CreateRequirement />}
                                    />
                                    <Route
                                      path="pending-approvals"
                                      element={<PendingApprovals />}
                                    />
                                    <Route
                                      path="create-purchase-order"
                                      element={<CreateEditPurchaseOrder />}
                                    />
                                    <Route
                                      path="purchase-orders/create"
                                      element={<CreateEditPurchaseOrder />}
                                    />
                                    <Route
                                      path="purchase-orders/:id/edit"
                                      element={<CreateEditPurchaseOrder />}
                                    />
                                    <Route
                                      path="role-management"
                                      element={<RoleManagementPage />}
                                    />
                                    <Route
                                      path="role-management/create"
                                      element={<CreateRolePage />}
                                    />
                                    <Route
                                      path="role-management/:roleId"
                                      element={<ViewRolePage />}
                                    />
                                    <Route
                                      path="role-management/:roleId/edit"
                                      element={<EditRolePage />}
                                    />

                                    {/* Approval Matrix Routes */}
                                    <Route
                                      path="approval-matrix"
                                      element={<ApprovalMatrixListPage />}
                                    />
                                    <Route
                                      path="approval-matrix/create"
                                      element={<ApprovalMatrixFormPage />}
                                    />
                                    <Route
                                      path="approval-matrix/:matrixId"
                                      element={<ApprovalMatrixViewPage />}
                                    />
                                    <Route
                                      path="approval-matrix/:matrixId/edit"
                                      element={<ApprovalMatrixFormPage />}
                                    />

                                    {/* Requirements Sub-routes */}
                                    <Route
                                      path="requirements/drafts"
                                      element={<RequirementsDrafts />}
                                    />
                                    <Route
                                      path="requirements/pending"
                                      element={<RequirementsPending />}
                                    />
                                    <Route
                                      path="requirements/pending/:id"
                                      element={<PendingRequirementView />}
                                    />
                                    <Route
                                      path="requirements/approved"
                                      element={<RequirementsApproved />}
                                    />
                                    <Route
                                      path="requirements/approved/:id"
                                      element={<ApprovedRequirementView />}
                                    />
                                    <Route
                                      path="requirements/published"
                                      element={<RequirementsPublished />}
                                    />
                                    <Route
                                      path="requirements/published/:id"
                                      element={<PublishedRequirementView />}
                                    />
                                    {/* Requirement Details */}
                                    <Route
                                      path="requirements/:id"
                                      element={<RequirementDetails />}
                                    />

                                    {/* Quotations Sub-routes */}
                                    <Route
                                      path="quotations/pending"
                                      element={<QuotationsPending />}
                                    />
                                    <Route
                                      path="quotations/approved"
                                      element={<QuotationsApproved />}
                                    />
                                    <Route
                                      path="quotations/comparison"
                                      element={<QuotationsComparison />}
                                    />
                                    <Route
                                      path="quotations/requirement/:draftId"
                                      element={<QuotationsForRequirement />}
                                    />
                                    <Route
                                      path="quotations/:id"
                                      element={<QuotationDetails />}
                                    />

                                    {/* Purchase Orders Sub-routes */}
                                    <Route
                                      path="purchase-orders/pending"
                                      element={<PurchaseOrdersPending />}
                                    />
                                    <Route
                                      path="purchase-orders/in-progress"
                                      element={<PurchaseOrdersInProgress />}
                                    />
                                    <Route
                                      path="purchase-orders/completed"
                                      element={<PurchaseOrdersCompleted />}
                                    />
                                    <Route
                                      path="purchase-orders/:id"
                                      element={<PurchaseOrderDetails />}
                                    />
                                    <Route
                                      path="vendor/purchase-orders/:id"
                                      element={<VendorPurchaseOrderDetails />}
                                    />

                                    {/* Workflow Sub-routes */}
                                    <Route
                                      path="workflows/active"
                                      element={<WorkflowsActive />}
                                    />
                                    {/* <Route
                                path="workflows/timeline"
                                element={<WorkflowsTimeline />}
                              />
                              <Route
                                path="workflows/reports"
                                element={<WorkflowsReports />}
                              /> */}

                                    {/* Stakeholder Sub-routes */}
                                    <Route
                                      path="stakeholders/vendors"
                                      element={<StakeholdersVendors />}
                                    />
                                    <Route
                                      path="stakeholders/professionals"
                                      element={<StakeholdersProfessionals />}
                                    />

                                    {/* Diligince HUB Routes */}
                                    <Route
                                      path="Diligince-hub/vendors"
                                      element={<FindVendors />}
                                    />
                                    <Route
                                      path="Diligince-hub/professionals"
                                      element={<FindProfessionals />}
                                    />

                                    {/* Vendor Routes */}
                                    <Route
                                      path="service-vendor"
                                      element={<ServiceVendorDashboard />}
                                    />
                                    <Route
                                      path="product-vendor"
                                      element={<ProductVendorDashboard />}
                                    />
                                    <Route
                                      path="logistics-vendor"
                                      element={<LogisticsVendorDashboard />}
                                    />

                                    {/* Service Vendor Routes */}
                                    <Route
                                      path="service-vendor-rfqs"
                                      element={<VendorRFQsBrowse />}
                                    />
                                    <Route
                                      path="rfqs/:rfqId"
                                      element={<VendorRFQDetail />}
                                    />
                                    <Route
                                      path="service-vendor-projects"
                                      element={<ServiceVendorProjects />}
                                    />
                                    <Route
                                      path="vendor/projects/:id"
                                      element={<VendorWorkflowDetails />}
                                    />
                                    <Route
                                      path="service-vendor-messages"
                                      element={<ServiceVendorMessages />}
                                    />
                                    <Route
                                      path="service-vendor-profile"
                                      element={<ServiceVendorProfile />}
                                    />
                                    <Route
                                      path="service-vendor-profile/payment"
                                      element={<VendorPaymentSettings />}
                                    />
                                    <Route
                                      path="service-vendor-services"
                                      element={<ServiceVendorServices />}
                                    />

                                    {/* Vendor Team & Role Management */}
                                    <Route
                                      path="team/roles"
                                      element={<VendorRoleManagementPage />}
                                    />
                                    <Route
                                      path="team/roles/create"
                                      element={<VendorCreateRolePage />}
                                    />
                                    <Route
                                      path="team/roles/:id"
                                      element={<VendorViewRolePage />}
                                    />
                                    <Route
                                      path="team/roles/:id/edit"
                                      element={<VendorEditRolePage />}
                                    />

                                    {/* Product Vendor Routes */}
                                    <Route
                                      path="product-vendor-rfqs"
                                      element={<ProductVendorRFQs />}
                                    />
                                    <Route
                                      path="product-vendor-orders"
                                      element={<ProductVendorOrders />}
                                    />
                                    <Route
                                      path="product-vendor-catalog"
                                      element={<ProductVendorCatalog />}
                                    />
                                    <Route
                                      path="product-vendor-messages"
                                      element={<ProductVendorMessages />}
                                    />
                                    <Route
                                      path="product-vendor-profile"
                                      element={<ProductVendorProfile />}
                                    />
                                    <Route
                                      path="product-vendor-profile/payment"
                                      element={<VendorPaymentSettings />}
                                    />

                                    {/* Logistics Vendor Routes */}
                                    <Route
                                      path="logistics-vendor-requests"
                                      element={<LogisticsVendorRequests />}
                                    />
                                    <Route
                                      path="logistics-vendor-deliveries"
                                      element={<LogisticsVendorDeliveries />}
                                    />
                                    <Route
                                      path="logistics-vendor-fleet"
                                      element={<LogisticsVendorFleet />}
                                    />
                                    <Route
                                      path="logistics-vendor-messages"
                                      element={<LogisticsVendorMessages />}
                                    />
                                    <Route
                                      path="logistics-vendor-profile"
                                      element={<LogisticsVendorProfile />}
                                    />
                                    <Route
                                      path="logistics-vendor-profile/payment"
                                      element={<VendorPaymentSettings />}
                                    />

                                    {/* Professional Routes */}
                                    <Route
                                      path="professional"
                                      element={<ProfessionalDashboard />}
                                    />
                                    <Route
                                      path="professional-opportunities"
                                      element={<ProfessionalOpportunities />}
                                    />
                                    <Route
                                      path="professional-calendar"
                                      element={<ProfessionalCalendar />}
                                    />
                                    <Route
                                      path="professional-messages"
                                      element={<ProfessionalMessages />}
                                    />
                                    <Route
                                      path="professional-profile"
                                      element={<ProfessionalProfile />}
                                    />
                                    <Route
                                      path="professional-portfolio"
                                      element={<ProfessionalPortfolio />}
                                    />
                                    <Route
                                      path="professional-certifications"
                                      element={<ProfessionalCertifications />}
                                    />

                                    {/* Professional Sub-routes */}
                                    <Route
                                      path="opportunities/saved"
                                      element={<OpportunitiesSaved />}
                                    />
                                    <Route
                                      path="opportunities/applications"
                                      element={<OpportunitiesApplications />}
                                    />
                                    <Route
                                      path="projects/active"
                                      element={<ProjectsActive />}
                                    />

                                    {/* Vendor Sub-routes */}
                                    <Route
                                      path="rfqs/browse"
                                      element={<VendorRFQsBrowse />}
                                    />
                                    <Route
                                      path="rfqs/saved"
                                      element={<VendorRFQsSaved />}
                                    />
                                    <Route
                                      path="rfqs/applied"
                                      element={<VendorRFQsApplied />}
                                    />
                                    <Route
                                      path="rfqs/:rfqId/submit-quotation"
                                      element={<VendorSubmitQuotation />}
                                    />
                                    <Route
                                      path="vendor/quotations"
                                      element={<VendorQuotations />}
                                    />
                                    <Route
                                      path="vendor/quotations/:quotationId"
                                      element={<VendorQuotationDetails />}
                                    />
                                    <Route
                                      path="vendor/quotations/:quotationId/edit"
                                      element={<VendorSubmitQuotation />}
                                    />

                                    {/* Subscription Routes */}
                                    <Route
                                      path="subscription/plans"
                                      element={<SubscriptionPlans />}
                                    />
                                    <Route
                                      path="subscription/transactions"
                                      element={<SubscriptionTransactions />}
                                    />
                                    <Route
                                      path="subscription/transactions/:id"
                                      element={<TransactionDetail />}
                                    />
                                    <Route
                                      path="subscription"
                                      element={<SubscriptionPlans />}
                                    />

                                    {/* Test & Common */}
                                    <Route path="test" element={<TestPage />} />
                                    <Route
                                      path="work-completion-payment/:id"
                                      element={<WorkCompletionPayment />}
                                    />
                                  </Route>

                                  {/* Settings Routes - with Layout wrapper */}
                                  <Route path="/settings/*" element={
                                    <ProtectedRoute>
                                      <Layout />
                                    </ProtectedRoute>
                                  }>
                                    <Route path="account-settings" element={<UserAccountSettings />} />
                                  </Route>

                                  {/* 404 */}
                                  <Route path="*" element={<NotFound />} />
                                </Routes>
                                <Toaster richColors position="top-right" />
                                <DiliginceChatbot />
                              </div>
                            </PricingSelectionProvider>
                          </VendorSpecializationProvider>
                        </StakeholderProvider>
                      </ApprovalProvider>
                    </RequirementProvider>
                  </EnhancedApprovalProvider>
                </NotificationProvider>
              </NotificationStoreProvider>
            </PermissionsProvider>
          </WebSocketProvider>
        </UserProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
