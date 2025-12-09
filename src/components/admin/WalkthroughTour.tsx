import { useEffect, useCallback } from "react";
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps, ACTIONS, EVENTS } from "react-joyride";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { useAdminTranslation } from "@/contexts/AdminTranslationContext";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Custom Tooltip Component
function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
  size,
}: TooltipRenderProps) {
  const { t, isRTL } = useAdminTranslation();
  
  return (
    <div
      {...tooltipProps}
      className={`
        bg-popover border border-border rounded-xl shadow-2xl
        max-w-sm w-full animate-scale-in backdrop-blur-sm
        ${isRTL ? "text-right" : "text-left"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            {index + 1} / {size}
          </span>
        </div>
        <button
          {...closeProps}
          className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {step.title && (
          <h3 className="text-base font-semibold text-foreground mb-2">
            {step.title}
          </h3>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {step.content}
        </p>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20 rounded-b-xl ${isRTL ? "flex-row-reverse" : ""}`}>
        <div>
          {index > 0 && (
            <Button
              {...backProps}
              variant="ghost"
              size="sm"
              className={`gap-1.5 text-muted-foreground hover:text-foreground ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ChevronLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              {t.previous || "Previous"}
            </Button>
          )}
        </div>
        <Button
          {...primaryProps}
          size="sm"
          className={`gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {isLastStep ? (
            <>
              <Check className="h-4 w-4" />
              {t.finish || "Finish"}
            </>
          ) : (
            <>
              {t.next || "Next"}
              <ChevronRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function WalkthroughTour() {
  const { isRunning, stepIndex, stopTour, setStepIndex } = useWalkthrough();
  const { t, isRTL } = useAdminTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Define comprehensive tour steps with page navigation
  const steps: Step[] = [
    // STEP 1: Welcome & Sidebar Overview
    {
      target: '[data-tour="sidebar"]',
      title: t.tourWelcomeTitle || "Welcome to Admin Dashboard",
      content: t.tourWelcomeContent || "This is your command center. The sidebar provides quick access to all sections of the admin panel. Let's explore what you can do here.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 2: Dashboard Overview
    {
      target: '[data-tour="dashboard"]',
      title: t.tourDashboardTitle || "Dashboard Overview",
      content: t.tourDashboardContent || "Start here to get a bird's-eye view of your operations. See real-time statistics, recent activity, and system health at a glance.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
      data: { route: "/admin/dashboard" },
    },
    // STEP 3: Overview Page Content - Stats Cards
    {
      target: '[data-tour="overview-stats"]',
      title: t.tourOverviewStatsTitle || "Key Metrics",
      content: t.tourOverviewStatsContent || "Monitor your most important KPIs here: active queues, customers served, wait times, and satisfaction scores. These update in real-time.",
      placement: "bottom",
      disableBeacon: true,
      data: { route: "/admin/dashboard" },
    },
    // STEP 4: Overview Page - Recent Activity
    {
      target: '[data-tour="overview-activity"]',
      title: t.tourOverviewActivityTitle || "Live Activity Feed",
      content: t.tourOverviewActivityContent || "Track every action as it happens. This feed shows new customers, completed services, and system events chronologically.",
      placement: "top",
      disableBeacon: true,
      data: { route: "/admin/dashboard" },
    },
    // STEP 5: Manage Queues - Sidebar
    {
      target: '[data-tour="manage-queues"]',
      title: t.tourManageTitle || "Queue Operations",
      content: t.tourManageContent || "This is where you control your service queues. Create, pause, resume, or configure queues to optimize customer flow.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
      data: { route: "/admin/manage" },
    },
    // STEP 6: Manage Page - Create Queue Button
    {
      target: '[data-tour="create-queue-btn"]',
      title: t.tourCreateQueueTitle || "Create New Queue",
      content: t.tourCreateQueueContent || "Click here to set up a new service queue. Define capacity, priority level, and assign agents to start serving customers.",
      placement: "left",
      disableBeacon: true,
      data: { route: "/admin/manage" },
    },
    // STEP 7: Manage Page - Queue Cards
    {
      target: '[data-tour="queue-list"]',
      title: t.tourQueueListTitle || "Queue Dashboard",
      content: t.tourQueueListContent || "Each card shows a queue's status, capacity, wait times, and number of customers. Use the action menu to pause, edit, or delete queues.",
      placement: "top",
      disableBeacon: true,
      data: { route: "/admin/manage" },
    },
    // STEP 8: Analytics - Sidebar
    {
      target: '[data-tour="analytics"]',
      title: t.tourAnalyticsTitle || "Analytics & Reports",
      content: t.tourAnalyticsContent || "Dive deep into your performance data. Analyze trends, identify peak hours, and make data-driven decisions.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
      data: { route: "/admin/analytics" },
    },
    // STEP 9: Analytics Page - Charts
    {
      target: '[data-tour="analytics-charts"]',
      title: t.tourAnalyticsChartsTitle || "Visual Insights",
      content: t.tourAnalyticsChartsContent || "Interactive charts display customer traffic, efficiency rates, and queue distribution. Switch between time periods to spot trends.",
      placement: "bottom",
      disableBeacon: true,
      data: { route: "/admin/analytics" },
    },
    // STEP 10: Analytics Page - Export
    {
      target: '[data-tour="analytics-export"]',
      title: t.tourAnalyticsExportTitle || "Export Reports",
      content: t.tourAnalyticsExportContent || "Download your analytics data for presentations or further analysis. Reports include all metrics and can be filtered by date range.",
      placement: "left",
      disableBeacon: true,
      data: { route: "/admin/analytics" },
    },
    // STEP 11: Settings - Sidebar
    {
      target: '[data-tour="settings"]',
      title: t.tourSettingsTitle || "System Settings",
      content: t.tourSettingsContent || "Customize your experience. Configure business details, notification preferences, appearance, and security options.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
      data: { route: "/admin/settings" },
    },
    // STEP 12: Settings Page - Tabs
    {
      target: '[data-tour="settings-tabs"]',
      title: t.tourSettingsTabsTitle || "Settings Categories",
      content: t.tourSettingsTabsContent || "Settings are organized into tabs: General for business info, Notifications for alerts, Appearance for theme customization, and Security for password and 2FA.",
      placement: "bottom",
      disableBeacon: true,
      data: { route: "/admin/settings" },
    },
    // STEP 13: Settings Page - Theme Colors
    {
      target: '[data-tour="settings-theme"]',
      title: t.tourSettingsThemeTitle || "Personalize Your Theme",
      content: t.tourSettingsThemeContent || "Choose your preferred color scheme. Select from multiple accent colors and switch between light, dark, or system theme modes.",
      placement: "top",
      disableBeacon: true,
      data: { route: "/admin/settings" },
    },
    // STEP 14: Profile - Sidebar
    {
      target: '[data-tour="profile"]',
      title: t.tourProfileTitle || "Your Profile",
      content: t.tourProfileContent || "Manage your personal account information, update contact details, and view your access permissions.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
      data: { route: "/admin/profile" },
    },
    // STEP 15: Content Management - Sidebar Group
    {
      target: '[data-tour="content"]',
      title: t.tourContentTitle || "Content Management",
      content: t.tourContentContent || "This section houses all your website content: About Us, Contacts, Partners, Terms & Conditions, and Privacy Policies. Each supports multiple languages.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 16: About Us - Content Versioning
    {
      target: '[data-tour="about-us"]',
      title: t.tourAboutUsTitle || "About Us Versions",
      content: t.tourAboutUsContent || "Create and manage different versions of your About Us content. Use versioning to A/B test messaging or prepare updates before publishing.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
      data: { route: "/admin/about-us" },
    },
    // STEP 17: About Us Page - Create Version
    {
      target: '[data-tour="create-version-btn"]',
      title: t.tourCreateVersionTitle || "Create Content Version",
      content: t.tourCreateVersionContent || "Click here to create a new version. Only one version can be active at a time - the active version is displayed on your public website.",
      placement: "left",
      disableBeacon: true,
      data: { route: "/admin/about-us" },
    },
    // STEP 18: Partners - Unique to Partners
    {
      target: '[data-tour="partners"]',
      title: t.tourPartnersTitle || "Partner Directory",
      content: t.tourPartnersContent || "Manage your business partnerships. Add partner logos, contact information, and descriptions to showcase on your website.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
      data: { route: "/admin/partners" },
    },
    // STEP 19: Contacts
    {
      target: '[data-tour="contacts"]',
      title: t.tourContactsTitle || "Contact Management",
      content: t.tourContactsContent || "Store and organize your business contact information including addresses, phone numbers, email, and social media links.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 20: Header Actions
    {
      target: '[data-tour="header-actions"]',
      title: t.tourHeaderActionsTitle || "Quick Actions",
      content: t.tourHeaderActionsContent || "Access language settings, notifications, and your profile quickly from here. The help button (which you used to start this tour) is always available.",
      placement: "bottom",
      disableBeacon: true,
    },
    // STEP 21: Language Selector
    {
      target: '[data-tour="language-selector"]',
      title: t.tourLanguageSelectorTitle || "Switch Languages",
      content: t.tourLanguageSelectorContent || "The dashboard supports English, French, and Arabic. Switch languages instantly - all content and interface elements will update automatically.",
      placement: "bottom",
      disableBeacon: true,
    },
    // STEP 22: Final Step - Logout
    {
      target: '[data-tour="logout-btn"]',
      title: t.tourLogoutTitle || "You're All Set!",
      content: t.tourLogoutContent || "That's the tour! You now know how to navigate the admin dashboard. Remember, you can restart this tour anytime by clicking the help button. Enjoy managing your queues!",
      placement: "bottom",
      disableBeacon: true,
    },
  ];

  // Handle navigation to correct route when step changes
  useEffect(() => {
    if (isRunning && steps[stepIndex]?.data?.route) {
      const targetRoute = steps[stepIndex].data.route as string;
      if (location.pathname !== targetRoute) {
        navigate(targetRoute);
      }
    }
  }, [stepIndex, isRunning, location.pathname, navigate, steps]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, type, action } = data;
    
    // Handle step navigation
    if (type === EVENTS.STEP_AFTER) {
      if (action === ACTIONS.NEXT) {
        setStepIndex(index + 1);
      } else if (action === ACTIONS.PREV) {
        setStepIndex(index - 1);
      }
    }
    
    // Handle skip on target not found
    if (type === EVENTS.TARGET_NOT_FOUND) {
      // Skip to next step if target not found
      setStepIndex(index + 1);
    }
    
    // Handle tour completion
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      stopTour();
      // Return to dashboard
      navigate("/admin/dashboard");
    }
  }, [setStepIndex, stopTour, navigate]);

  // Don't render if not running
  if (!isRunning) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      stepIndex={stepIndex}
      continuous
      scrollToFirstStep
      showSkipButton={false}
      showProgress={false}
      disableOverlayClose={false}
      spotlightClicks={false}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      floaterProps={{
        disableAnimation: false,
        hideArrow: false,
      }}
      styles={{
        options: {
          arrowColor: "hsl(var(--popover))",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
        },
        spotlight: {
          borderRadius: "12px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        buttonNext: {
          display: "none",
        },
        buttonBack: {
          display: "none",
        },
        buttonClose: {
          display: "none",
        },
        buttonSkip: {
          display: "none",
        },
      }}
    />
  );
}
