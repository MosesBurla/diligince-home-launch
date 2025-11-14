import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { NotificationStoreProvider } from "@/contexts/NotificationStoreContext";
import { EnhancedApprovalProvider } from "@/contexts/EnhancedApprovalContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { RequirementProvider } from "@/contexts/RequirementContext";
import { ApprovalProvider } from "@/contexts/ApprovalContext";
import { StakeholderProvider } from "@/contexts/StakeholderContext";
import { VendorSpecializationProvider } from "@/contexts/VendorSpecializationContext";
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
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import ProfileCompletion from "@/pages/ProfileCompletion";
import TestPage from "@/pages/TestPage";
import BlogArticle from "@/pages/BlogArticle";
import StakeholderOnboarding from "@/pages/StakeholderOnboarding";
import PendingApproval from "@/pages/PendingApproval";
import WorkCompletionPayment from "@/pages/WorkCompletionPayment";
import VerificationPending from "@/pages/VerificationPending";
import VendorSettings from "@/pages/VendorSettings";

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
import IndustryStakeholders from "@/pages/IndustryStakeholders";
import IndustryDocuments from "@/pages/IndustryDocuments";
import IndustryMessages from "@/pages/IndustryMessages";
import IndustryApprovalMatrix from "@/pages/IndustryApprovalMatrix";
import IndustryAnalytics from "@/pages/IndustryAnalytics";
import IndustryTeam from "@/pages/IndustryTeam";
import IndustryNotifications from "@/pages/IndustryNotifications";
import CreateRequirement from "@/pages/CreateRequirement";
import CreatePurchaseOrder from "@/pages/CreatePurchaseOrder";
import CreateEditPurchaseOrder from "@/pages/CreateEditPurchaseOrder";
import RoleManagement from "@/pages/RoleManagement";

// Requirements sub-pages
import RequirementsDrafts from "@/pages/RequirementsDrafts";
import RequirementsPending from "@/pages/RequirementsPending";
import RequirementsApproved from "@/pages/RequirementsApproved";
import RequirementsPublished from "@/pages/RequirementsPublished";
import RequirementsArchived from "@/pages/RequirementsArchived";
import RequirementDetails from "@/pages/RequirementDetails";

// Quotations sub-pages
import QuotationsPending from "@/pages/QuotationsPending";
import QuotationsApproved from "@/pages/QuotationsApproved";
import QuotationsComparison from "@/pages/QuotationsComparison";
import QuotationDetails from "@/pages/QuotationDetails";

// Purchase Orders sub-pages
import PurchaseOrdersPending from "@/pages/PurchaseOrdersPending";
import PurchaseOrdersInProgress from "@/pages/PurchaseOrdersInProgress";
import PurchaseOrdersCompleted from "@/pages/PurchaseOrdersCompleted";
import PurchaseOrderDetails from "@/pages/PurchaseOrderDetails";

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
import ServiceVendorRFQs from "@/pages/ServiceVendorRFQs";
import ServiceVendorProjects from "@/pages/ServiceVendorProjects";
import ServiceVendorMessages from "@/pages/ServiceVendorMessages";
import ServiceVendorProfile from "@/pages/ServiceVendorProfile";
import ServiceVendorServices from "@/pages/ServiceVendorServices";

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
import VendorSubmitQuotation from "@/pages/VendorSubmitQuotation";
import VendorQuotations from "@/pages/VendorQuotations";
import VendorQuotationDetails from "@/pages/VendorQuotationDetails";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <UserProvider>
          <NotificationStoreProvider>
            <NotificationProvider>
              <EnhancedApprovalProvider>
                <RequirementProvider>
                  <ApprovalProvider>
                    <StakeholderProvider>
                      <VendorSpecializationProvider>
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

                            {/* Auth Routes */}
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route
                              path="/forgot-password"
                              element={<ForgotPassword />}
                            />
                            <Route
                              path="/reset-password"
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
                            <Route
                              path="/vendor-settings"
                              element={
                                <ProtectedRoute>
                                  <VendorSettings />
                                </ProtectedRoute>
                              }
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
                              <Route
                                path="industry-approval-matrix"
                                element={<IndustryApprovalMatrix />}
                              />
                              <Route
                                path="industry-analytics"
                                element={<IndustryAnalytics />}
                              />
                              <Route
                                path="industry-team"
                                element={<IndustryTeam />}
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
                                path="create-purchase-order"
                                element={<CreatePurchaseOrder />}
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
                                element={<RoleManagement />}
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
                                path="requirements/approved"
                                element={<RequirementsApproved />}
                              />
                              <Route
                                path="requirements/published"
                                element={<RequirementsPublished />}
                              />
                            <Route
                                path="requirements/archived"
                                element={<RequirementsArchived />}
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
                                element={<ServiceVendorRFQs />}
                              />
                              <Route
                                path="service-vendor-projects"
                                element={<ServiceVendorProjects />}
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
                                path="service-vendor-services"
                                element={<ServiceVendorServices />}
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

                              {/* Test & Common */}
                              <Route path="test" element={<TestPage />} />
                              <Route
                                path="work-completion-payment/:id"
                                element={<WorkCompletionPayment />}
                              />
                            </Route>

                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                          <Toaster richColors position="top-right"/>
                        </div>
                      </VendorSpecializationProvider>
                    </StakeholderProvider>
                  </ApprovalProvider>
                </RequirementProvider>
              </EnhancedApprovalProvider>
            </NotificationProvider>
          </NotificationStoreProvider>
        </UserProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
