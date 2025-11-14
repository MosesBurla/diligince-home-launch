import React, { useState, useEffect, Suspense, memo } from "react";
import { Home, Briefcase, Calendar, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import ProfessionalHeader from "@/components/professional/ProfessionalHeader";
import { FastLoadingState } from "@/components/shared/loading/FastLoadingState";
import { SkeletonLoader } from "@/components/shared/loading/SkeletonLoader";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { perfUtils } from "@/utils/performance";
import { useAsyncOperation } from "@/hooks/useAsyncOperation";

// Lazy load dashboard components
const DashboardStats = React.lazy(() =>
  import("@/components/professional/dashboard/DashboardStats").then((m) => ({
    default: m.DashboardStats,
  }))
);

const AvailabilityCalendar = React.lazy(() =>
  import("@/components/professional/dashboard/AvailabilityCalendar").then(
    (m) => ({
      default: m.AvailabilityCalendar,
    })
  )
);

const JobOpportunities = React.lazy(() =>
  import("@/components/professional/dashboard/JobOpportunities").then((m) => ({
    default: m.JobOpportunities,
  }))
);

const OngoingProjects = React.lazy(() =>
  import("@/components/professional/dashboard/OngoingProjects").then((m) => ({
    default: m.OngoingProjects,
  }))
);

const MessageCenter = React.lazy(() =>
  import("@/components/professional/dashboard/MessageCenter").then((m) => ({
    default: m.MessageCenter,
  }))
);

// ---------------- Types ----------------
interface ApplicationData {
  coverLetter: string;
  resumeUrl?: string;
}

interface ProjectUpdate {
  status?: string;
  progress?: number;
  nextMilestone?: string;
}

interface Message {
  id: number;
  sender: string;
  initials: string;
  message: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  color: string;
  unread: boolean;
  type: string;
}

interface Project {
  id: number;
  title: string;
  client: string;
  timeline: string;
  status: string;
  progress: number;
  priority: "high" | "medium" | "low";
  nextMilestone: string;
  totalValue: string;
  remainingDays: number;
}

interface Job {
  id: number;
  title: string;
  company: string;
  budget: string;
  duration: string;
  location: string;
  skillsMatch: number;
  postedDate: string;
  deadline: string;
  status: string;
  description: string;
  requirements: string[];
}

// ---------------- Mock Data ----------------
const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Chem Industries",
    initials: "CI",
    message:
      "The valve inspection is scheduled for tomorrow. Please confirm...",
    timestamp: "10:42 AM",
    priority: "high",
    color: "green",
    unread: true,
    type: "project-update",
  },
  {
    id: 2,
    sender: "Power Gen Co.",
    initials: "PG",
    message: "We've prepared all documentation for your audit next week...",
    timestamp: "Yesterday",
    priority: "medium",
    color: "blue",
    unread: true,
    type: "project-preparation",
  },
  {
    id: 3,
    sender: "Steel Plant Ltd.",
    initials: "SP",
    message:
      "Thank you for your application. We'd like to schedule an interview...",
    timestamp: "2d ago",
    priority: "high",
    color: "orange",
    unread: false,
    type: "job-response",
  },
  {
    id: 4,
    sender: "AutoParts Ltd.",
    initials: "AP",
    message:
      "We're interested in your profile for our PLC programming project...",
    timestamp: "3d ago",
    priority: "medium",
    color: "pink",
    unread: false,
    type: "job-inquiry",
  },
  {
    id: 5,
    sender: "Diligince.ai",
    initials: "DL",
    message:
      "We've found 3 new job opportunities matching your skills profile...",
    timestamp: "5d ago",
    priority: "low",
    color: "purple",
    unread: false,
    type: "system-notification",
  },
];

const mockProjects: Project[] = [
  {
    id: 1,
    title: "Valve System Inspection",
    client: "Chem Industries",
    timeline: "May 7-8, 2025",
    status: "in-progress",
    progress: 50,
    priority: "high",
    nextMilestone: "Complete initial assessment",
    totalValue: "₹85,000",
    remainingDays: 2,
  },
  {
    id: 2,
    title: "Electrical System Audit",
    client: "Power Gen Co.",
    timeline: "May 12-13, 2025",
    status: "scheduled",
    progress: 0,
    priority: "medium",
    nextMilestone: "Project kickoff meeting",
    totalValue: "₹120,000",
    remainingDays: 5,
  },
];

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Control System Upgrade",
    company: "Steel Plant Ltd.",
    budget: "₹350,000",
    duration: "4 weeks",
    location: "Mumbai",
    skillsMatch: 95,
    postedDate: "2024-05-01",
    deadline: "2024-05-15",
    status: "open",
    description: "Upgrade existing control systems with latest PLC technology",
    requirements: [
      "PLC Programming",
      "Control Systems",
      "Industrial Automation",
    ],
  },
  {
    id: 2,
    title: "PLC Programming for New Line",
    company: "AutoParts Ltd.",
    budget: "₹280,000",
    duration: "3 weeks",
    location: "Pune",
    skillsMatch: 88,
    postedDate: "2024-04-28",
    deadline: "2024-05-12",
    status: "open",
    description: "Program PLC for new automotive parts production line",
    requirements: ["PLC Programming", "Manufacturing", "Quality Control"],
  },
];

// ---------------- Header Navigation ----------------
const headerNavItems = [
  {
    label: "Dashboard",
    icon: <Home size={18} />,
    href: "/professional-dashboard",
    active: true,
  },
  {
    label: "Opportunities",
    icon: <Briefcase size={18} />,
    href: "/professional-opportunities",
  },
  {
    label: "Calendar",
    icon: <Calendar size={18} />,
    href: "/professional-calendar",
  },
  {
    label: "Messages",
    icon: <MessageSquare size={18} />,
    href: "/professional-messages",
  },
  { label: "Profile", icon: <User size={18} />, href: "/professional-profile" },
];

// ---------------- Dashboard Container ----------------
const DashboardContainer = memo(() => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  const { execute: loadDashboardData } = useAsyncOperation({
    successMessage: "Dashboard data loaded successfully",
  });

  const handleMessageReply = async (messageId: number, reply: string) => {
    await loadDashboardData(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Reply to message ${messageId}: ${reply}`);
      return { success: true };
    });
  };

  const handleJobApplication = async (
    jobId: number,
    applicationData: ApplicationData
  ) => {
    await loadDashboardData(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Application for job ${jobId}:`, applicationData);
      return { success: true };
    });
  };

  const handleProjectUpdate = async (
    projectId: number,
    updates: ProjectUpdate
  ) => {
    await loadDashboardData(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, ...updates } : project
        )
      );
      return { success: true };
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Professional Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, Rahul! Here's your professional activity overview.
        </p>
      </div>

      {/* Stats */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg border border-gray-100"
              >
                <SkeletonLoader lines={2} height="20px" />
              </div>
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense
          fallback={
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <SkeletonLoader lines={6} />
            </div>
          }
        >
          <AvailabilityCalendar />
        </Suspense>

        <Suspense
          fallback={
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <SkeletonLoader lines={6} />
            </div>
          }
        >
          <JobOpportunities
            jobs={jobs}
            onApplicationSubmit={handleJobApplication}
          />
        </Suspense>
      </div>

      {/* Projects */}
      <Suspense
        fallback={
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <SkeletonLoader lines={8} />
          </div>
        }
      >
        <OngoingProjects
          projects={projects}
          onProjectUpdate={handleProjectUpdate}
        />
      </Suspense>

      {/* Messages */}
      <Suspense
        fallback={
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <SkeletonLoader lines={5} />
          </div>
        }
      >
        <MessageCenter messages={messages} onReply={handleMessageReply} />
      </Suspense>
    </div>
  );
});

DashboardContainer.displayName = "DashboardContainer";

// ---------------- Main Component ----------------
const ProfessionalDashboard = () => {
  console.log("ProfessionalDashboard rendering - optimized version");
  usePerformanceMonitor("ProfessionalDashboard");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    perfUtils.measureCoreWebVitals();
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setInitialLoading(false);
      toast.success("Welcome to your Professional Dashboard");
    };

    loadInitialData();
  }, []);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* // <ProfessionalHeader navItems={headerNavItems} /> */} 

        <main className="pt-16 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <FastLoadingState message="Loading your dashboard..." size="lg" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg border border-gray-100"
                >
                  <SkeletonLoader lines={2} height="20px" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <SkeletonLoader lines={4} />
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <SkeletonLoader lines={4} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* // <ProfessionalHeader navItems={headerNavItems} /> */}

      <main className="pt-16 p-6 lg:p-8">
        <DashboardContainer />
      </main>
    </div>
  );
};

export default memo(ProfessionalDashboard);
