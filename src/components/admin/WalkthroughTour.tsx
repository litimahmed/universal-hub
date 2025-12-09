import { useCallback, useMemo } from "react";
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps, ACTIONS, EVENTS } from "react-joyride";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { useAdminTranslation } from "@/contexts/AdminTranslationContext";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Custom Tooltip Component
function CustomTooltip({
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
      style={{ zIndex: 10001 }}
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
  const steps: Step[] = useMemo(() => [
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
    },
    // STEP 3: Overview Page Content - Stats Cards
    {
      target: '[data-tour="overview-stats"]',
      title: t.tourOverviewStatsTitle || "Key Metrics",
      content: t.tourOverviewStatsContent || "Monitor your most important KPIs here: active queues, customers served, wait times, and satisfaction scores. These update in real-time.",
      placement: "bottom",
      disableBeacon: true,
    },
    // STEP 4: Manage Queues - Sidebar
    {
      target: '[data-tour="manage-queues"]',
      title: t.tourManageTitle || "Queue Operations",
      content: t.tourManageContent || "This is where you control your service queues. Create, pause, resume, or configure queues to optimize customer flow.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 5: Analytics - Sidebar
    {
      target: '[data-tour="analytics"]',
      title: t.tourAnalyticsTitle || "Analytics & Reports",
      content: t.tourAnalyticsContent || "Dive deep into your performance data. Analyze trends, identify peak hours, and make data-driven decisions.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 6: Settings - Sidebar
    {
      target: '[data-tour="settings"]',
      title: t.tourSettingsTitle || "System Settings",
      content: t.tourSettingsContent || "Customize your experience. Configure business details, notification preferences, appearance, and security options.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 7: Profile - Sidebar
    {
      target: '[data-tour="profile"]',
      title: t.tourProfileTitle || "Your Profile",
      content: t.tourProfileContent || "Manage your personal account information, update contact details, and view your access permissions.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 8: Content Management - Sidebar Group
    {
      target: '[data-tour="content"]',
      title: t.tourContentTitle || "Content Management",
      content: t.tourContentContent || "This section houses all your website content: About Us, Contacts, Partners, Terms & Conditions, and Privacy Policies. Each supports multiple languages.",
      placement: isRTL ? "left" : "right",
      disableBeacon: true,
    },
    // STEP 9: Header Actions
    {
      target: '[data-tour="header-actions"]',
      title: t.tourHeaderActionsTitle || "Quick Actions",
      content: t.tourHeaderActionsContent || "Access language settings, notifications, and your profile quickly from here. The help button (which you used to start this tour) is always available.",
      placement: "bottom",
      disableBeacon: true,
    },
    // STEP 10: Language Selector
    {
      target: '[data-tour="language-selector"]',
      title: t.tourLanguageSelectorTitle || "Switch Languages",
      content: t.tourLanguageSelectorContent || "The dashboard supports English, French, and Arabic. Switch languages instantly - all content and interface elements will update automatically.",
      placement: "bottom",
      disableBeacon: true,
    },
  ], [t, isRTL]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, type, action } = data;
    
    console.log('Joyride callback:', { status, index, type, action });
    
    // Handle step navigation
    if (type === EVENTS.STEP_AFTER) {
      if (action === ACTIONS.NEXT) {
        setStepIndex(index + 1);
      } else if (action === ACTIONS.PREV) {
        setStepIndex(index - 1);
      }
    }
    
    // Handle skip on target not found - move to next step
    if (type === EVENTS.TARGET_NOT_FOUND) {
      console.log('Target not found for step:', index);
      if (index < steps.length - 1) {
        setStepIndex(index + 1);
      } else {
        stopTour();
      }
    }
    
    // Handle tour completion
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      stopTour();
    }
    
    // Handle close action
    if (action === ACTIONS.CLOSE) {
      stopTour();
    }
  }, [setStepIndex, stopTour, steps.length]);

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
      disableScrolling={false}
      spotlightClicks={false}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      locale={{
        back: t.previous || "Previous",
        close: t.close || "Close",
        last: t.finish || "Finish",
        next: t.next || "Next",
        skip: t.skip || "Skip",
      }}
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
          borderRadius: 12,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    />
  );
}
